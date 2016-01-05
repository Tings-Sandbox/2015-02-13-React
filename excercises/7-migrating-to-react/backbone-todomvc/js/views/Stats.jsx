var app = app || {};

app.Stats = React.createClass({
  var remaining = this.props.remaining;
  var completed = this.props.completed;
  render: function(){
    return (
      <div>
        <span id="todo-count"><strong>{remaining}</strong>{remaining === 1 ? 'item' : 'items'} left</span>
        <ul id="filters">
          <li>
            <a class="selected" href="#/">All</a>
          </li>
          <li>
            <a href="#/active">Active</a>
          </li>
          <li>
            <a href="#/completed">Completed</a>
          </li>
        </ul>
        {completed && ( 
          <button id="clear-completed">Clear ({completed})</button>
        )}
      </div>
    )
  }
})