class SimulationItem extends React.Component {

  renderNameField(isDisabled) {
    return (
      <div>
        <p><label><input type="checkbox" name={'enabled-' + this.props.num} checked={this.props.simulation.enabled} onChange={this.props.onInputChange} disabled={isDisabled} /> Enabled</label></p>
        <p><label><input type="text" name={'name-' + this.props.num} value={this.props.simulation.name} onChange={this.props.onInputChange} disabled={isDisabled} /> Name</label></p>
      </div>
    );
  }

  renderDateInput(valueNum, isDisabled, labelText, min = null, max = null) {
     return (
        <p><label><input type="date" name={'value' + valueNum + '-' + this.props.num} value={this.props.simulation.values[valueNum]} onChange={this.props.onInputChange} min={min} max={max} disabled={isDisabled} required /> {labelText}</label></p>
      )
  }

  renderNumberInput(valueNum, isDisabled, labelText, min) {
    return (
      <p><label><input type="number" name={'value' + valueNum + '-' + this.props.num} value={this.props.simulation.values[valueNum]} onChange={this.props.onInputChange} disabled={isDisabled} min={min} required /> {labelText}</label></p>
      )
  }

  renderTextInput(valueNum, isDisabled, labelText) {
    return (
      <p><label><input type="text" name={'value' + valueNum + '-' + this.props.num} value={this.props.simulation.values[valueNum]} onChange={this.props.onInputChange} disabled={isDisabled} required /> {labelText}</label></p>
    )
  }

  renderCheckboxInput(valueNum, isDisabled, labelText) {
    return (
      <p><label><input type="checkbox" name={'value' + valueNum + '-' + this.props.num} checked={this.props.simulation.values[valueNum] == 'on'} onClick={this.props.onInputChange} disabled={isDisabled} /> {labelText}</label></p>
    )
  }

  renderTimeline() {
  }

  renderActiveContent() {
  }

  renderRemoveAndCloseButtons() {
    return (
      <p className="simulation-item-actions">
        <button onClick={this.props.onActivate}>Close</button>
        <button onClick={this.props.onRemove}>Remove</button>
      </p>
    );
  }

  render() {
    var toggleText = this.props.isActive ? 'Close' : 'Open';
    var classAttr = 'simulation-item';
    if (this.props.simulation.valid) {
      classAttr += ' ' + this.props.simulation.simType;
    } else {
      classAttr += ' invalid';
    }
    if (this.props.isActive) classAttr += ' active';
    return (
      <div className={classAttr} data-item-num={this.props.num}>
          <div onClick={this.props.onActivate} className="simulation-timeline-container">{this.renderTimeline()}</div>
          
        {this.props.isActive ? this.renderActiveContent() : null}
      </div>
    );
  }
}

class Loan extends SimulationItem {
  renderTimeline() {
    var startDate = new Date(this.props.simulation.values[0]);
    var endDate = new Date(startDate.getTime());
    endDate.setFullYear(endDate.getFullYear() + parseInt(this.props.simulation.values[1]));
    if (!this.props.simulation.valid) {
      return <span className="simulation-timeline">{this.props.simulation.name + ' - Incomplete setup'}</span>;
    }
    var totalSeconds = this.props.simConfig.endDate.valueOf() - this.props.simConfig.startDate.valueOf();
    var startDatePercent = 100*(startDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds;
    var endDatePercent = 100*(endDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds - startDatePercent;

    var timelineStyle = {
      marginLeft: startDatePercent + '%',
      width: endDatePercent + '%'
    };
    return (
      <span className="simulation-timeline" style={timelineStyle}>{this.props.simulation.name}</span>
    )
  }

  renderActiveContent() {
    return (
      <div>
        {this.renderNameField(this.props.isDisabled)}
        {this.renderDateInput(0, this.props.isDisabled, 'Loan date', this.props.simConfig.startDate.toISOString().substring(0, 10))}
        {this.renderNumberInput(1, this.props.isDisabled, 'Loan term (# of years)', 0)}
        {this.renderTextInput(2, this.props.isDisabled, 'Interest rate (%)')}
        {this.renderNumberInput(3, this.props.isDisabled, 'Loan amount ($)', 0)}
        {this.renderTextInput(4, this.props.isDisabled, 'Monthly payment ($/month)')}
        {this.renderRemoveAndCloseButtons()}
      </div>
    );
  }
}

class Expenditure extends SimulationItem {
  renderTimeline() {
    var startDate = new Date(this.props.simulation.values[0]);
    var endDate = new Date(this.props.simulation.values[1]);
    if (!this.props.simulation.valid) {
      return <span className="simulation-timeline">{this.props.simulation.name + ' - Incomplete setup'}</span>;
    }
    var totalSeconds = this.props.simConfig.endDate.valueOf() - this.props.simConfig.startDate.valueOf();
    var startDatePercent = 100*(startDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds;
    var endDatePercent = 100*(endDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds - startDatePercent;

    var timelineStyle = {
      marginLeft: startDatePercent + '%',
      width: endDatePercent + '%'
    };
    return (
      <span className="simulation-timeline" style={timelineStyle}>{this.props.simulation.name}</span>
    )
  }

  renderActiveContent() {
    return (
      <div>
        {this.renderNameField(this.props.isDisabled)}
        {this.renderDateInput(0, this.props.isDisabled, 'Start date', this.props.simConfig.startDate.toISOString().substring(0, 10), this.props.simulation.values[1])}
        {this.renderDateInput(1, this.props.isDisabled, 'End date', this.props.simulation.values[0], this.props.simConfig.endDate.toISOString().substring(0, 10))}
        {this.renderNumberInput(2, this.props.isDisabled, 'Cost ($/month)', 0)}
        {this.renderRemoveAndCloseButtons()}
      </div>
    );
  }
}

class Windfall extends SimulationItem {
  renderTimeline() {
    var date = new Date(this.props.simulation.values[0]);
    if (!this.props.simulation.valid) {
      return <span className="simulation-timeline">{this.props.simulation.name + ' - Incomplete setup'}</span>;
    }
    var totalSeconds = this.props.simConfig.endDate.valueOf() - this.props.simConfig.startDate.valueOf();
    var startDatePercent = 100*(date.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds;

    var timelineStyle = {
      marginLeft: startDatePercent + '%',
      width: '3px'
    };
    return (
      <span className="simulation-timeline" style={timelineStyle}>{this.props.simulation.name}</span>
    );
  }

  renderActiveContent() {
    return (
      <div>
        {this.renderNameField(this.props.isDisabled)}
        {this.renderDateInput(0, this.props.isDisabled, 'Date', this.props.simConfig.startDate.toISOString().substring(0, 10), this.props.simConfig.endDate.toISOString().substring(0, 10))}
        {this.renderNumberInput(1, this.props.isDisabled, 'Amount ($)', 0)}
        {this.renderRemoveAndCloseButtons()}
      </div>
    );
  }
}

class Job extends SimulationItem {
  renderTimeline() {
    var startDate = new Date(this.props.simulation.values[0]);
    var endDate = new Date(this.props.simulation.values[1]);
    if (!this.props.simulation.valid) {
      return <span className="simulation-timeline">{this.props.simulation.name + ' - Incomplete setup'}</span>;
    }
    var totalSeconds = this.props.simConfig.endDate.valueOf() - this.props.simConfig.startDate.valueOf();
    var startDatePercent = 100*(startDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds;
    var endDatePercent = 100*(endDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds - startDatePercent;

    var timelineStyle = {
      marginLeft: startDatePercent + '%',
      width: endDatePercent + '%'
    };
    return (
      <span className="simulation-timeline" style={timelineStyle}>{this.props.simulation.name}</span>
    )
  }

  renderActiveContent() {
    return (
      <div>
        {this.renderNameField(this.props.isDisabled)}
        {this.renderDateInput(0, this.props.isDisabled, 'Start date', this.props.simConfig.startDate.toISOString().substring(0, 10), this.props.simulation.values[1])}
        {this.renderDateInput(1, this.props.isDisabled, 'End date', this.props.simulation.values[0], this.props.simConfig.endDate.toISOString().substring(0, 10))}
        {this.renderNumberInput(2, this.props.isDisabled, 'Salary ($/year)', 0)}
        {this.renderRemoveAndCloseButtons()}
      </div>
    );
  }
}

class SimulationManager extends React.Component {
  render() {
    return (
      <div className="simulation-manager">
        <h2>Simulation config</h2>
        <p><label><input type="number" name="numSims" onChange={this.props.onChange} value={this.props.config.numSims} min="1" /> # of simulations to run</label></p>
        <p><button onClick={this.props.onStart}>{this.props.status.active ? 'Cancel' : 'Start'}</button> {this.props.status.percent > 0 && this.props.status.active ? this.props.status.percent.toString() + '%' : null}</p>
      </div>
    );
  }
}


class SimulationResults extends React.Component {
  constructor(props) {
    super(props);
    this.chart = null;
    this.oldProps = '';
  }

  componentWillReceiveProps() {
    this.oldProps = JSON.stringify(Object.assign({}, this.props));
  }

  componentDidMount() {
    this.chart = new Chart(document.getElementById('chart-canvas'), {
      type: 'line',
      data: {
        datasets: this.getDatasets(),
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                quarter: 'MMM YYYY',
              },
              tooltipFormat: 'MMM YYYY',
            }
          }],
          yAxes: [{
            ticks: {
              callback: function(value, index, values) {
                return '$' + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              }
            }
          }]
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            label: function(item, dataObj) {
              return dataObj.datasets[item.datasetIndex].label + ': $' + (item.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            },
          },
        },
        maintainAspectRatio: false,
        responsive: true,
      }
    });
  }

  componentDidUpdate() {
    if (this.oldProps === JSON.stringify(this.props)) return;
    this.chart.data.datasets = this.getDatasets();
    this.chart.update();
  }

  getDatasets() {
    var datasets = [];
    for (var i = 0; i < this.props.results.length; i++) {
      datasets.push({
        label: this.props.results[i].name,
        data: this.props.results[i].data,
        borderColor: this.getPercentileColor(i),
        fill: false,
        lineTension: 0, // straight lines
        pointRadius: 0,
      });
    }
    return datasets;
  }


  getPercentileColor(i) {
    var color;
    switch (i) {
      case 4: // 5th
        color = '#ff0000'; break;
      case 3: // 25th
        color = '#ffaa00'; break;
      case 2: // 50th
        color = '#000000'; break;
      case 1: // 75th
        color = '#0000aa'; break;
      case 0: // 95th
        color = '#00ff00'; break;
    }
    return color;
  }

  render() {
    return (
      <div>
        <h2>Results</h2>
        <div id='chart-container' style={{height: '400px'}}>
          <canvas id="chart-canvas"></canvas>
        </div>
      </div>
    );

  }

}

class SimulationContainer extends React.Component {
  constructor(props) {
    super(props);
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 10*365);
    this.state = {
      simulationItems: [],
      activeItem: -1,
      simulationConfig: {
        startDate: new Date(),
        endDate: endDate,
        numSims: 5,
        debug: false,
        initialBalance: 0,
      },
      simulationStatus: {
        active: false,
        percent: 0,
        results: {},
        labels: {},
        finished: false,
      },
    };
    this.worker = new Worker('worker.js?' + (Date.now()));
    this.worker.onmessage = this.workerMessageHandler.bind(this);
  }

  addNewItem(simType) {
    let simulationItems = this.state.simulationItems;
    simulationItems.push({
      simType: simType,
      enabled: true,
      valid: false,
      errorMessage: '',
      name: simType.charAt(0).toUpperCase() + simType.slice(1),
      values: ['', '', '', '', '']
    })
    this.setState({simulationItems: simulationItems, activeItem: (simulationItems.length - 1)});
  }

  removeItem(i) {
    let simulationItems = this.state.simulationItems;
    if (i < this.state.simulationItems.length) {
      simulationItems.splice(i, 1);
    }
    this.setState({simulationItems: simulationItems, activeItem: -1});
  }

  toggleActiveItem(i) {
    var newActive = this.state.activeItem === i ? -1 : i;
    this.setState({activeItem: newActive});
  }

  startOrStopSimulations() {
    var workerMessage = this.state;
    workerMessage.action = workerMessage.simulationStatus.active ? 'abort' : 'start';
    this.worker.postMessage(workerMessage);
  }

  workerMessageHandler(e) {
    var simStatus = this.state.simulationStatus;
    switch (e.data.type) {
      case 'percent':
        simStatus.percent = e.data.percent;
        this.worker.postMessage({action: 'continue'});
        break;
      case 'status':
        simStatus.active = e.data.active; break;
      case 'results':
        simStatus.finished = true;
        simStatus.results = e.data.results;
        simStatus.labels = e.data.labels;
        break;
    }
    this.setState({simulationStatus: simStatus});
  }

  handleItemChange(e) {
    var value = e.target.value;
    var inputNameParts = e.target.name.split('-');
    var itemNum = parseInt(inputNameParts[1]);

    var simItems = this.state.simulationItems;
    var simItem = simItems[itemNum];

    if (inputNameParts[0].includes('name')) {
      simItem.name = value;
    } else if (inputNameParts[0].includes('enabled')) {
      simItem.enabled = e.target.checked;
    } else if (inputNameParts[0].includes('value')) {
      var valueNum = parseInt(inputNameParts[0].replace(/[a-z]/g, ''));
      simItem.values[valueNum] = value;
      if (simItem.simType == 'loan') {
        if ([1, 2, 3].includes(valueNum) && simItem.values[1] && simItem.values[2] && simItem.values[3]) {
          // Recalculate monthly payment
          simItem.values[4] = calculateMonthlyPayment(simItem.values[3], simItem.values[2], simItem.values[1]);
        } else if (valueNum == 4 && simItem.values[4] && simItem.values[1] && simItem.values[2]) {
          // Recalculate loan amount
          simItem.values[3] = calculatePrincipal(simItem.values[4], simItem.values[2], simItem.values[1]);
        }
      }
      simItem.valid = false;
      if (e.target.validity.valid) {
        simItem.valid = document.querySelector('.simulation-item[data-item-num="' + itemNum + '"] input:invalid') === null;
      }
    }
    simItems[itemNum] = simItem;
    this.setState({simulationItems: simItems});
  }

  handleConfigChange(e) {
    var simConfig = this.state.simulationConfig;
    switch (e.target.name) {
      case 'numSims':
        simConfig.numSims = e.target.value;
        break;
      case 'initialBalance':
        simConfig.initialBalance = e.target.value;
        break;
      case 'endDate':
        simConfig.endDate = new Date(e.target.value);
        break;
    }
    this.setState({simulationConfig: simConfig});
  }

  renderSimulationItem(i) {
    var simItem = this.state.simulationItems[i];
    var isActive = this.state.activeItem === i;
    switch (simItem.simType) {
      case 'loan':
        return <Loan key={i} num={i} simulation={simItem} isDisabled={this.state.simulationStatus.active} simConfig={this.state.simulationConfig} isActive={isActive} onInputChange={this.handleItemChange.bind(this)} onActivate={() => this.toggleActiveItem(i)} onRemove={() => this.removeItem(i)} />;
      case 'windfall':
        return <Windfall key={i} num={i} simulation={simItem} isDisabled={this.state.simulationStatus.active} simConfig={this.state.simulationConfig} isActive={isActive} onInputChange={this.handleItemChange.bind(this)} onActivate={() => this.toggleActiveItem(i)} onRemove={() => this.removeItem(i)} />;
      case 'expenditure':
        return <Expenditure key={i} num={i} simulation={simItem} isDisabled={this.state.simulationStatus.active} simConfig={this.state.simulationConfig} isActive={isActive} onInputChange={this.handleItemChange.bind(this)} onActivate={() => this.toggleActiveItem(i)} onRemove={() => this.removeItem(i)} />;
      case 'job':
        return <Job key={i} num={i} simulation={simItem} isDisabled={this.state.simulationStatus.active} simConfig={this.state.simulationConfig} isActive={isActive} onInputChange={this.handleItemChange.bind(this)} onActivate={() => this.toggleActiveItem(i)} onRemove={() => this.removeItem(i)} />;
    }
  }

  render() {
    var simulationItemRows = [];
    for (var i = this.state.simulationItems.length - 1; i >= 0; i--) {
      simulationItemRows.push(this.renderSimulationItem(i));
    }

    return (
      <div>
        <h1>Net worth simulator</h1>

        <h2>1. Enter your current net worth</h2>
        <p><label><input type="number" name="initialBalance" onChange={this.handleConfigChange.bind(this)} value={this.state.simulationConfig.initialBalance} /> Initial net worth ($)</label></p>

        <h2>2. How far do you want to simulate?</h2>
        <p><label><input type="date" name="endDate" onChange={this.handleConfigChange.bind(this)} value={this.state.simulationConfig.endDate.toISOString().substring(0,10)} /> End date</label></p>

        <h2>3. Simulate life events</h2>
        <p>Add financial events in your life that you want to simulate.</p>
        <p className="simulation-add-item">
          <button onClick={() => this.addNewItem('loan')}>Add Loan</button>
          <button onClick={() => this.addNewItem('windfall')}>Add Windfall</button>
          <button onClick={() => this.addNewItem('job')}>Add Job</button>
          <button onClick={() => this.addNewItem('expenditure')}>Add Expenditure</button>
        </p>
        <div className="simulation-item-container">{simulationItemRows}</div>

        <SimulationManager onStart={() => this.startOrStopSimulations()} onChange={this.handleConfigChange.bind(this)} config={this.state.simulationConfig} status={this.state.simulationStatus}  />

        {this.state.simulationStatus.finished &&

          <SimulationResults results={this.state.simulationStatus.results} labels={this.state.simulationStatus.labels} />
        }
      </div>
    );
  }
}


if (!window.Worker) {
  alert("No web worker!");
}

ReactDOM.render(<SimulationContainer />, document.getElementById('simulations'));


function calculateMonthlyPayment(principal, interestRate, numYears) {
  var numMonths = numYears*12;
  interestRate = interestRate/(100*12);
  return Math.round(100*interestRate*principal / (1 - Math.pow(1 + interestRate, -1*numMonths)))/100;
}

function calculatePrincipal(monthlyPayment, interestRate, numYears) {
  var numMonths = numYears*12;
  interestRate = interestRate/(100*12);
  return Math.round(100*monthlyPayment*(1 - Math.pow(1 + interestRate, -1*numMonths))/interestRate)/100;
}