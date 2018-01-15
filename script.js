class SimulationItem extends React.Component {

  renderNameField() {
    var isEnabled = this.props.simulation.enabled && this.props.simulation.validated;
    return (
      <div>
      <p>{JSON.stringify(this.props.simulation)}</p>
      <p><label><input type="checkbox" name={'enabled-' + this.props.num} checked={this.props.simulation.enabled} onChange={this.props.onInputChange} /> Enabled</label></p>
      <p><label>Name: <input type="text" name={'name-' + this.props.num} value={this.props.simulation.name} onChange={this.props.onInputChange} /></label></p>
      </div>
    );
  }

  renderInput(valueNum, labelText, inputType) {
    if (inputType != 'checkbox') {
      return (
        <p><label>{labelText} <input type={inputType} name={'value' + valueNum + '-' + this.props.num} value={this.props.simulation.values[valueNum]} onChange={this.props.onInputChange} /></label></p>
      )
    } else {
      return (
        <p><label>{labelText} <input type={inputType} name={'value' + valueNum + '-' + this.props.num} checked={this.props.simulation.values[valueNum] == 'on'} onClick={this.props.onInputChange} /></label></p>
      )
    }
  }

  renderTimeline() {
    return "lol";
  }

  renderActiveContent() {

  }

  render() {
    var toggleText = this.props.isActive ? 'Close' : 'Open';
    return (
      <div className="simulation-item">
        <div className="simulation-item-summary">
          <button onClick={this.props.onActivate}>{toggleText}</button>
          <span className="simulation-item-name">{this.props.simulation.name}</span>
          <span className="simulation-timeline-container">{this.renderTimeline()}</span>
          <button onClick={this.props.onRemove}>Remove</button>
        </div>
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
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate || startDate < this.props.simConfig.startDate || endDate > this.props.simConfig.endDate) {
      return;
    }
    var totalSeconds = this.props.simConfig.endDate.valueOf() - this.props.simConfig.startDate.valueOf();
    var startDatePercent = 100*(startDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds;
    var endDatePercent = 100*(endDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds - startDatePercent;

    var timelineStyle = {
      marginLeft: startDatePercent + '%',
      width: endDatePercent + '%'
    };
    return (
      <span className="simulation-timeline-item" style={timelineStyle}></span>
    )
  }

  renderActiveContent() {
    return (
      <div>
        {this.renderNameField()}
        {this.renderInput(0, 'Loan date:', 'date')}
        {this.renderInput(1, 'Loan term (# of years)', 'number')}
        {this.renderInput(2, 'Interest rate (%)', 'text')}
        {this.renderInput(3, 'Loan amount ($)', 'number')}
        {this.renderInput(4, 'Monthly payment ($/month)', 'text')}
      </div>
    );
  }
}

class Expenditure extends SimulationItem {
  renderTimeline() {
    var startDate = new Date(this.props.simulation.values[0]);
    var endDate = new Date(this.props.simulation.values[1]);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate || startDate < this.props.simConfig.startDate || endDate > this.props.simConfig.endDate) {
      return;
    }
    var totalSeconds = this.props.simConfig.endDate.valueOf() - this.props.simConfig.startDate.valueOf();
    var startDatePercent = 100*(startDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds;
    var endDatePercent = 100*(endDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds - startDatePercent;

    var timelineStyle = {
      marginLeft: startDatePercent + '%',
      width: endDatePercent + '%'
    };
    return (
      <span className="simulation-timeline-item" style={timelineStyle}></span>
    )
  }

  renderActiveContent() {
    return (
      <div>
        {this.renderNameField()}
        {this.renderInput(0, 'Start date:', 'date')}
        {this.renderInput(1, 'End date:', 'date')}
        {this.renderInput(2, 'Cost ($/month)', 'number')}
      </div>
    );
  }
}

class Windfall extends SimulationItem {
  renderTimeline() {
    var date = new Date(this.props.simulation.values[0]);
    if (isNaN(date.getTime()) || date < this.props.simConfig.startDate || date > this.props.simConfig.endDate) {
      return;
    }
    var totalSeconds = this.props.simConfig.endDate.valueOf() - this.props.simConfig.startDate.valueOf();
    var startDatePercent = 100*(date.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds;

    var timelineStyle = {
      marginLeft: startDatePercent + '%',
      width: '3px'
    };
    return (
      <span className="simulation-timeline-item" style={timelineStyle}></span>
    );
  }

  renderActiveContent() {
    return (
      <div>
        {this.renderNameField()}
        {this.renderInput(0, 'Date:', 'date')}
        {this.renderInput(1, 'Amount:', 'number')}
      </div>
    );
  }
}

class Job extends SimulationItem {
  renderTimeline() {
    var startDate = new Date(this.props.simulation.values[0]);
    var endDate = new Date(this.props.simulation.values[1]);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate || startDate < this.props.simConfig.startDate || endDate > this.props.simConfig.endDate) {
      return;
    }
    var totalSeconds = this.props.simConfig.endDate.valueOf() - this.props.simConfig.startDate.valueOf();
    var startDatePercent = 100*(startDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds;
    var endDatePercent = 100*(endDate.valueOf() - this.props.simConfig.startDate.valueOf()) / totalSeconds - startDatePercent;

    var timelineStyle = {
      marginLeft: startDatePercent + '%',
      width: endDatePercent + '%'
    };
    return (
      <span className="simulation-timeline-item" style={timelineStyle}></span>
    )
  }

  renderActiveContent() {
    return (
      <div>
        {this.renderNameField()}
        {this.renderInput(0, 'Start date:', 'date')}
        {this.renderInput(1, 'End date:', 'date')}
        {this.renderInput(2, 'Salary ($/year)', 'number')}
      </div>
    );
  }
}

class SimulationManager extends React.Component {
  render() {
    var messages = [];
    for (var i = 0; i < this.props.status.workerMessages.length; i++) {
      messages.push(<span key={i}>{this.props.status.workerMessages[i]}<br /></span>);
    }
    return (
      <div>
        <p><button onClick={this.props.onStart}>{this.props.status.active ? 'Cancel' : 'Start'}</button> {this.props.status.percent > 0 ? this.props.status.percent.toString() + '%' : null}</p>
        <p><label>End date: <input type="date" name="endDate" onChange={this.props.onChange} value={this.props.config.endDate.toISOString().substring(0,10)} /></label></p>
        <p><label># of simulations: <input type="number" name="numSims" onChange={this.props.onChange} value={this.props.config.numSims} /></label></p>
        <details>
          <summary>Debug messages</summary>
          {messages}
        </details>
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
      <div id='chart-container' style={{height: '400px'}}>
        <canvas id="chart-canvas"></canvas>
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
      },
      simulationStatus: {
        active: false,
        percent: 0,
        workerMessages: [],
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
      validated: false,
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
      case 'debug':
        simStatus.workerMessages.push(e.data.message); break;
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
        return <Loan key={i} num={i} simulation={simItem} simConfig={this.state.simulationConfig} isActive={isActive} onInputChange={this.handleItemChange.bind(this)} onActivate={() => this.toggleActiveItem(i)} onRemove={() => this.removeItem(i)} />;
      case 'windfall':
        return <Windfall key={i} num={i} simulation={simItem} simConfig={this.state.simulationConfig} isActive={isActive} onInputChange={this.handleItemChange.bind(this)} onActivate={() => this.toggleActiveItem(i)} onRemove={() => this.removeItem(i)} />;
      case 'expenditure':
        return <Expenditure key={i} num={i} simulation={simItem} simConfig={this.state.simulationConfig} isActive={isActive} onInputChange={this.handleItemChange.bind(this)} onActivate={() => this.toggleActiveItem(i)} onRemove={() => this.removeItem(i)} />;
      case 'job':
        return <Job key={i} num={i} simulation={simItem} simConfig={this.state.simulationConfig} isActive={isActive} onInputChange={this.handleItemChange.bind(this)} onActivate={() => this.toggleActiveItem(i)} onRemove={() => this.removeItem(i)} />;
    }
  }

  render() {
    var simulationItemRows = [];
    for (var i = 0; i < this.state.simulationItems.length; i++) {
      simulationItemRows.push(this.renderSimulationItem(i));
    }

    return (
      <div>
        <div>{simulationItemRows}</div>

        <hr />

        <button onClick={() => this.addNewItem('loan')}>Add Loan</button>
        <button onClick={() => this.addNewItem('windfall')}>Add Windfall</button>
        <button onClick={() => this.addNewItem('job')}>Add Job</button>
        <button onClick={() => this.addNewItem('expenditure')}>Add Expenditure</button>

        <hr />

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