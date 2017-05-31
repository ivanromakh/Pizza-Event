import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import PizzaEvents from './events/PizzaEvents';
import MenuItems from './groupMenu/MenuItems';
import ShowClientGroups from './groups/ShowClientGroups';
import CreateGroupForm from './groups/CreateGroupForm';
import AccountUiWrapper from './AccountUiWrapper';

import { Groups } from '../../api/groups/groups'; 
import { Events } from '../../api/events/events'; 

// App component - represents the whole app
class App extends Component {
  render() {
    var group = this.props.group;
    var events = this.props.events;

    return (
      <div className="page">
        <div className='page--row'>
          <div className="col-md-7 page--column">
            <h1> Pizza Ordering </h1>
            <PizzaEvents group={ group } events={ events } />
            <MenuItems group={ group } />
  	      </div>
          <div className="col-md-4 page--column">
  	        <AccountUiWrapper />
  	        <CreateGroupForm />
  	        <ShowClientGroups />
  	      </div>
	      </div>
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('groups');
  Meteor.subscribe('events');

  if(Meteor.user() && Meteor.user().activeGroup) {
    var activeGroup = Meteor.user().activeGroup;

    return {
      group: Groups.findOne({ _id: activeGroup }),
      events: Events.find({ groupId: activeGroup }).fetch(),
    }
  }
  return {};
}, App);