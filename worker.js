class SimulationHandler {
  setConfig(config) {
    this.startDate = config.simulationConfig.startDate;
    this.endDate = config.simulationConfig.endDate;
    this.simItems = config.simulationItems;
    this.totalSims = config.simulationConfig.numSims;
    this.currentSim = 0;
    console.log("Starting with config:")
    console.log(this.config);
    this.monthlyBalances = {};
    this.abort = false;
    this.sendStatusMessage(true /* active */);
  }

  continueSimulations() {    
    // Run through 10 simulations and send a status update
    for (var i = this.currentSim; i < this.currentSim + 10 && i < this.totalSims; i++) {
      console.log('Running simulation #' + i);
      this.runSimulation();
    }
    if (this.abort) {
      this.monthlyBalances = {};
      this.sendStatusMessage(false /* active */);
      return;
    }
    if (i >= this.totalSims) {
      // If this is the last simulation, send the final results.
      //console.log("BALANCES");
      //console.log(JSON.stringify(this.monthlyBalances));
      this.calculateAndSendResults();
      this.sendStatusMessage(false /* active */);
      return;
    }

    this.currentSim = i;
    console.log("Finished 10 sims...");
    this.sendStatusPercent(Math.round(100 * i / this.totalSims));
  }

  abortSimulation() {
    this.abort = true;
  }

  runSimulation() {
    var balance = 0;

    // Initialize all items
    var simItems = [];
    for (var simItem of this.simItems) {
      if (!simItem.enabled) continue;
      switch (simItem.simType) {
        case 'windfall':
          simItems.push(new Windfall(simItem.values[0], simItem.values[1]));
          break;
        case 'job':
          simItems.push(new Job(simItem.values[0], simItem.values[1], simItem.values[2]));
          break;
        case 'expenditure':
          simItems.push(new Expenditure(simItem.values[0], simItem.values[1], simItem.values[2]));
          break;
        case 'loan':
          simItems.push(new Loan(simItem.values[0], simItem.values[1], simItem.values[2], simItem.values[3]));
          break;
      }
    }

    // Start at the first of next month to make things easier
    for (var currentDate = new Date(this.startDate.getTime()); currentDate <= this.endDate; currentDate.setMonth(currentDate.getMonth() + 1)) {
      for (var i = 0; i < simItems.length; i++) {
        balance += simItems[i].advanceMonth(currentDate);
      }
      balance = this.adjustMonthlyBalance(balance);
      this.storeMonthlyBalance(currentDate, balance);
    }
  }

  adjustMonthlyBalance(balance) {
    var monthlyRate;
    if (balance > 0) {
      var investmentRateOfReturn = getRandomNormalDist(4, 4);
      monthlyRate = Math.pow(1 + investmentRateOfReturn/100, 1/12);
    } else {
      var loanInterest = getRandomNormalDist(4, 2);
      monthlyRate = Math.pow(1 + loanInterest/100, 1/12);
    }
    return balance*monthlyRate;
  }

  storeMonthlyBalance(currentDate, balance) {
    var index = currentDate.valueOf();
    if (!this.monthlyBalances[index]) {
      this.monthlyBalances[index] = [balance];
    } else {
      this.monthlyBalances[index].push(balance);
    }
  }


  calculateAndSendResults() {
    var keys = Object.keys(this.monthlyBalances);


    // TODO: Create percentiles programmatically?
    var results5thPercentile = [];
    var results25thPercentile = [];
    var results50thPercentile = [];
    var results75thPercentile = [];
    var results95thPercentile = [];

    var index5thPercentile = Math.max(0, Math.round(this.totalSims * 0.05) - 1);
    var index25thPercentile = Math.round(this.totalSims * 0.25) - 1;
    var index50thPercentile = Math.round(this.totalSims * 0.5) - 1;
    var index75thPercentile = Math.round(this.totalSims * 0.75) - 1;
    var index95thPercentile = Math.round(this.totalSims * 0.95) - 1;

    var labels = [];

    for (var key of keys) {
      var month = this.monthlyBalances[key].slice();
      month.sort((a, b) => {
        return a - b;
      });

      var keyInt = parseInt(key);
      labels.push(new Date(keyInt));

      results5thPercentile.push({t: new Date(keyInt), y: Math.round(month[index5thPercentile])});
      results25thPercentile.push({t: new Date(keyInt), y: Math.round(month[index25thPercentile])});
      results50thPercentile.push({t: new Date(keyInt), y: Math.round(month[index50thPercentile])});
      results75thPercentile.push({t: new Date(keyInt), y: Math.round(month[index75thPercentile])});
      results95thPercentile.push({t: new Date(keyInt), y: Math.round(month[index95thPercentile])});
    }

    var results = [
      {
        name: 'Best case',
        data: results95thPercentile
      },
      {
        name: 'Lucky',
        data: results75thPercentile
      },
      {
        name: 'Median',
        data: results50thPercentile
      },
      {
        name: 'Unlucky',
        data: results25thPercentile
      },
      {
        name: 'Worst case',
        data: results5thPercentile
      }
    ];

    postMessage({type: 'results', results: results, labels: labels});
  }

  sendStatusPercent(percent) {
    postMessage({type: 'percent', percent: percent})
  }

  sendStatusMessage(active) {
    postMessage({type: 'status', active: active});
  }
}


class Windfall {
  constructor(date, amount) {
    // Adjust initial amount by +/- 10%
    this.amount = parseInt(amount) + getRandomNormalDist(0, 0.1*parseInt(amount));
    this.receiptDate = new Date(date);
    this.used = false;
  }

  advanceMonth(currentDate) {
    if (this.used || currentDate < this.receiptDate) return 0;
    this.used = true;
    return this.amount;
  }
}

class Job {
  constructor(startDate, endDate, salary) {
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    // Adjust initial salary by +/- 20%
    salary = parseInt(salary) + getRandomNormalDist(0, 0.2*parseInt(salary));
    this.monthlySalary = salary / 12;
    this.taxRate = 0.33;
  }

  advanceMonth(currentDate) {
    if (currentDate < this.startDate || currentDate > this.endDate) return 0;
    if (currentDate.getMonth() == 0) {
      // Once a year, adjust salary by -2% - 10%.
      this.monthlySalary = this.monthlySalary * getRandomNormalDist(1.04, 0.06);
      postMessage("new salary: " + this.monthlySalary);
    }
    return this.monthlySalary * (1 - this.taxRate);
  }
}

class Expenditure {
  constructor(startDate, endDate, monthlyCost) {
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    // vary initial monthly cost by +/- 10%
    this.monthlyCost = (-1 * parseInt(monthlyCost)) * getRandomNormalDist(1, 0.1);
    this.annualGrowth = 1.02;
  }

  advanceMonth(currentDate) {
    if (currentDate < this.startDate || currentDate > this.endDate) return 0;
    if (currentDate.getMonth() == 0) {
      // Once a year, increase cost by 0 - 10% (accounting for inflation)
      this.monthlyCost = this.monthlyCost * getRandomNormalDist(1.05, 0.05);
    }
    return this.monthlyCost;
  }
}

class Loan {
  constructor(startDate, numYears, interestRate, amount) {
    this.startDate = new Date(startDate);
    this.endDate = new Date(startDate);
    this.endDate.setFullYear(this.endDate.getFullYear() + parseInt(numYears));
    amount = parseInt(amount) + getRandomNormalDist(0, 0.25*parseInt(amount));
    interestRate = parseInt(interestRate) + getRandomNormalDist(0, 3);
    this.monthlyPayment = -1 * calculateMonthlyPayment(parseInt(amount), interestRate, parseInt(numYears));
  }

  advanceMonth(currentDate) {
    if (currentDate < this.startDate || currentDate > this.endDate) return 0;
    return this.monthlyPayment;
  }
}







function calculateMonthlyPayment(principal, interestRate, numYears) {
  var numMonths = numYears*12;
  interestRate = interestRate/(100*12);
  return Math.round(100*interestRate*principal / (1 - Math.pow(1 + interestRate, -1*numMonths)))/100;
}


// assumes `max` is positive!
function getRandomNumberInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Return a number between 0 and 1, centered around 0.5.
function getRandomNormalDist(center, maxDistanceFromCenter) {
  // Determine a random number from a ~normal distribution between -1 and 1 centered around 0
  // Comes from https://stackoverflow.com/a/39187274
  var rand = 0;
  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }
  rand = rand / 3 - 1;

  // Now adjust the position and return.
  rand = rand*maxDistanceFromCenter + center;
  return rand;
}



var simulationHandler = new SimulationHandler();


onmessage = function(e) {
  var message = e.data;
  console.log(message);
  switch (message.action) {
    case 'start':
      console.log('setting config');
      simulationHandler.setConfig(message);
    case 'continue':
      simulationHandler.continueSimulations();
      break;
    case 'abort':
      console.log('received abort signal');
      simulationHandler.abortSimulation();
      break;
  }
}