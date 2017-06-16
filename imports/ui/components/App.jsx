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
  // this function calling in EventOrdering.jsx 
  checkOrdering(eventId) {
    var isAllOrdered = Meteor.call("isAllMakeOrders", eventId, (error, result) => {
      console.log(result)
    });
    if(isAllOrdered) {
      Meteor.call("isAllMakeOrders", eventId);
    }
  }

  renderColumnContent() {
    if (this.props.activeElement === "events") {
      return (<PizzaEvents 
        checkOrdering={ this.checkOrdering.bind(this) }
        group={ this.props.group }
        events={ this.props.events }
      />);
    }

    if (this.props.activeElement === "menuItems") {
      return <MenuItems group={ this.props.group } />
    }
  }

  render() {
    return (
      <div className="page">
        <div className='page--row'>
          <div className="col-md-7 page--column">
            <h1 className='page--header'> Pizza Ordering </h1>
            { this.renderColumnContent() }
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
  var activeElement = {};

  if(Meteor.user() && Meteor.user().activeGroup) {
    activeElement = Meteor.user().elemType;
    var activeGroup = Meteor.user().activeGroup;
    group = Groups.findOne({ _id: activeGroup });
    events = Events.find({ groupId: activeGroup }).fetch();
  }

  return {
    group: group,
    events: events,
    activeElement: activeElement,
  };
}, App);