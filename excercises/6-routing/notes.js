localhost:3000/#foo
location.hash.substr(1) returns 'foo'

//when the a link is clicked, the page will rerender
<a href = "#foo"> Foo </a>
window.addEventListener('hashchange', function(){
  React.render(<App route={location.hash.substr(1)}/>, document.body);
})
--------------------------------

//React Router keeps your UI in sync with the URL. 
var Router = require('react-router');

var {
  Route,
  DefaultRoute,
  NotFoundRoute,
  RouteHandler,
  Link
} = Router;


--------------------------------
ANALYZING THE APP COMPONENT
var App = React.createClass({
  getInitialState: function () {
    return {
      contacts: ContactStore.getContacts(),
      loading: true
    };
  },

  componentWillMount: function () {
    ContactStore.init();
  },

  componentDidMount: function () {
    ContactStore.addChangeListener(this.updateContacts);
  },

  componentWillUnmount: function () {
    ContactStore.removeChangeListener(this.updateContacts);
  },

  updateContacts: function () {
    this.setState({
      contacts: ContactStore.getContacts(),
      loading: false
    });
  },

  render: function () {
    //returns an array of <li> with contact links set with params={contact}
    //Link to="contact" will reference the Router.run(routes, callback) to see which <Route name="contact"> it is
    var contacts = this.state.contacts.map(function (contact) {
      return <li key={contact.id}><Link to="contact" params={contact}>{contact.first}</Link></li>;
    });
    return (
      <div className="App">
        <div className="ContactList">
          <Link to="new">New Contact</Link>
          <ul>
            {contacts}
          </ul>
          <Link to="about">About</Link>
        </div>
        <div className="Content">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});


THE ROUTES::
var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Index}/>
    <Route name="new" path="contact/new" handler={NewContact}/>
    <Route name="contact" path="contact/:id" handler={Contact}/>
    <Route name="about" path="about" handler={About}/>
  </Route>
);

//the handler corresponding with the right route name gets rendered. also, the path gets updated 
Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

