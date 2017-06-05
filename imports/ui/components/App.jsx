import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import PizzaEvents from './events/PizzaEvents';
import MenuItems from './groupMenu/MenuItems';
import ShowClientGroups from './groups/ShowClientGroups';
import CreateGroupForm from './groups/CreateGroupForm';
import AccountUiWrapper from './AccountUiWrapper';

import { Groups } from '../../api/groups/groups'; 
import { Events } from '../../api/events/events'; 


class App extends Component {
  render() {
    var group = this.props.group;
    var events = this.props.events;

    return (
      <div className="page">
        <div className='page--row'>
          <div className="col-md-7 page--column">
            <h1 className='page--header'> Pizza Ordering </h1>
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

App.propTypes = {
  group: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,  
};

export default createContainer(() => {
  Meteor.subscribe('groups');
  Meteor.subscribe('events');

  var group = {};
  var events = [];

  if(Meteor.user() && Meteor.user().activeGroup) {
    var activeGroup = Meteor.user().activeGroup;
    group = Groups.findOne({ _id: activeGroup });
    events = Events.find({ groupId: activeGroup }).fetch();
  }
  
  return {
    group: group,
    events: events,
  };
}, App);