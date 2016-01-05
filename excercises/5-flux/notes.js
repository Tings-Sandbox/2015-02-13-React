Flux
* sets the action handling to the side
* dispatcher sends message to every store
* VIEWS --> USER INTERACTION --> ACTION CREATORS --> WEB API UTILS --> WEB API --> BACK TO ACTION CREATORS 
--> ACTIONS --> DISPATCHER --> CALLBACKS --> STORES --> CHANGE EVENTS/ STORE QUERIES --> VIEWS
* goes from the views to the actions to the dispatcher to the stores and then back to the views

//is handleStoreChange in App.js a fn we defined or does it come with flux?

-----------------------------------------------------
FNs FOUND IN APP.js

//note that it gets its state from ContactsStore
var App = React.createClass({
  getInitialState () {
    return ContactsStore.getState();
  },

  //we attach a listener + event change handler to this store
  //we also call the actionCreators here, which will...?
  //the change handler will call the getState function from the store
  componentDidMount () {
    ContactsStore.addChangeListener(this.handleStoreChange);
    ViewActionCreators.loadContacts();
  },

  componentWillUnmount () {
    ContactsStore.removeChangeListener(this.handleStoreChange);
  },

  handleStoreChange () {
    this.setState(ContactsStore.getState());
  },

//to add a button to delete a contact, we do not simply do this
  deleteContact (contact) {
    var oldState = ContactsStore.getState();
    oldState[contact].remove();
    ContactsStore.setState(oldState);
  }

//do it the flux way
  //call the actionCreators object (app.js)
  deleteContact (contact) {
    ViewActionCreators.deleteContact(contact);
  }

  //call the AppDispatcher to handle the view action, indicating the action type and the contact to delete
  //then call the ApiUtil to actually delete it from the API (viewActionCreators.js)
  var ViewActionCreators = {
    deleteContact (contact) {
      AppDispatcher.handleViewAction({
        type: ActionTypes.CONTACT_DELETED,
        contact: contact
      });
      ApiUtil.deleteContact(contact);
    }
  };

  //the AppDispatcher handles the Action and dispatches the payload? (AppDispatcher.js)
  var AppDispatcher = assign(new Dispatcher(), {
    handleViewAction (action) {
      var payload = {
        source: PayloadSources.VIEW_ACTION,
        action: action
      };
      this.dispatch(payload);
    }
  });

  //this talks to the xhr (ApiUtil.js), the callback provided then calls the ServerActionCreators
  deleteContact (contact) {
    xhr.deleteJSON(`${API}/contacts/${contact.id}`, (err, res) => {
      ServerActionCreators.deletedContact(contact);
    });
  }

  //(xhr.js) which makes a httprequest 
  exports.deleteJSON = (url, cb) => {
    var req = new XMLHttpRequest();
    req.onload = cb;
    req.open('DELETE', url);
    setToken(req);
    req.send();
  };

  //(ServerActionCreators.js) which tells the dispatcher that the contact has been deleted
  deletedContact (contact) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.CONTACT_DELETED,
      contact: contact
    });
  }

  //the store is registered to the AppDispatcher and is set up to handle ActionTypes.CONTACT_DELETED
  ContactsStore.dispatchToken = AppDispatcher.register((payload) => {
    var { action } = payload;

    if (action.type === ActionTypes.CONTACT_DELETED) {
      var newContacts = state.contacts.filter((contact) => {
        return contact.id !== action.contact.id;
      });
      setState({ contacts: newContacts });
    }

  });


------------------------------------------------------------------

FNs FOUND IN ACTIONCREATORS:
//who calls these? the components themselves via UI
var ViewActionCreators = {
  loadContacts () {
    AppDispatcher.handleViewAction({
      type: ActionTypes.LOAD_CONTACTS
    });
    ApiUtil.loadContacts();
  }
};
----------------------------------------------------------------
FNs FOUND IN APPDISPATCHER:
//? what is the action being passed into our handleServerAction?
//assign is a function like extend
var AppDispatcher = assign(new Dispatcher(), {

  handleServerAction (action) {
    var payload = {
      /* PayloadSources object is stored in Constants File
        //keyMirror returns an object with values mirroring the keys
      PayloadSources: keyMirror({
        SERVER_ACTION: null,
        VIEW_ACTION: null
      })
      */
      source: PayloadSources.SERVER_ACTION,
      action: action
    };
    this.dispatch(payload);
  },

  handleViewAction (action) {
    var payload = {
      source: PayloadSources.VIEW_ACTION,
      action: action
    };
    this.dispatch(payload);
  }
});
----------------------------------------------------------------
FNs FOUND IN STORES:
//the variables needed
var events = new EventEmitter();
var CHANGE_EVENT = 'CHANGE';

//to set new states
var setState = (newState) => {
  assign(state, newState);
  events.emit(CHANGE_EVENT);
};

//to set up Stores, add listeners to them and to return the states
var ContactsStore = {
  addChangeListener (fn) {
    events.addListener(CHANGE_EVENT, fn);
  },

  removeChangeListener (fn) {
    events.removeListener(CHANGE_EVENT, fn);
  },

  getState () {
    return state;
  }
};

//when CONTACTS_LOADED action type is fired, then we'll set the state
ContactsStore.dispatchToken = AppDispatcher.register((payload) => {
  var { action } = payload;
  console.log(action.type);
  if (action.type === ActionTypes.CONTACTS_LOADED) {
    setState({
      loaded: true,
      contacts: action.contacts
    });
  }
});

