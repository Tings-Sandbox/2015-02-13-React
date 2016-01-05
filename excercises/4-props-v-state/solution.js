////////////////////////////////////////////////////////////////////////////////
// Excercise:
//
// make tabs a "pure component" by not managing any of its own state, instead
// add a property to tell it which tab to show, and then have it communicate
// with its owner to get rerendered with a new active tab.
////////////////////////////////////////////////////////////////////////////////
var React = require('react');
var styles = require('./styles');
var data = require('./data');

var Tabs = React.createClass({

  propTypes: {
    data: React.PropTypes.array.isRequired,
    activeTabIndex: React.PropTypes.number.isRequired,
    onActivateTab: React.PropTypes.func.isRequired,
  },

  //notice that this function calls a function that will handle the state, but doesn't affect state directly. because we're in a child component
  handleTabClick (activeTabIndex) {
    this.props.onActivateTab(activeTabIndex);
  },

  renderTabs () {
    return this.props.data.map((tab, index) => {
      var style = this.props.activeTabIndex === index ?
        styles.activeTab : styles.tab;
      var clickHandler = this.handleTabClick.bind(this, index);
      return (
        <div key={tab.name} style={style} onClick={clickHandler}>
          {tab.name}
        </div>
      );
    });
  },

  renderPanel () {
    var tab = this.props.data[this.props.activeTabIndex];
    return (
      <div>
        <p>{tab.description}</p>
      </div>
    );
  },

  render () {
    return (
      <div style={styles.app}>
        <div style={styles.tabs}>
          {this.renderTabs()}
        </div>
        <div style={styles.tabPanels}>
          {this.renderPanel()}
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  //state is moved to the parent component
  getInitialState () {
    return {
      activeTabIndex: 0
    };
  },

  handleActivateTab (activeTabIndex) {
    this.setState({ activeTabIndex });
  },

  render () {
    return (
      <div>
        <h1>Props v. State</h1>
        <Tabs
          //state and functions handling state are passed as props to child components
          data={this.props.tabs}
          activeTabIndex={this.state.activeTabIndex}
          onActivateTab={this.handleActivateTab}
        />
      </div>
    );
  }
});

React.render(<App tabs={data}/>, document.body);

