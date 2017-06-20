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
  componentWillUnmount() {
    this.props.user.stop();
    this.props.events.stop();
    this.props.activeElement.stop();
  }

  // this function calling in EventOrdering.jsx
  checkOrdering(eventId) {
    Meteor.call('isAllMakeOrders', eventId);
  }

  renderColumnContent() {
    if (this.props.activeElement === 'events') {
      return (
        <PizzaEvents
          checkOrdering={this.checkOrdering}
          group={this.props.group}
          events={this.props.events}
        />
      );
    }

    if (this.props.activeElement === 'menuItems') {
      return <MenuItems group={this.props.group} />;
    }
    return (
      <p> Pleasure select group by clicking <b>events</b> or <b>menuItems</b> buttons </p>
    );
  }

  render() {
    return (
      <div className="page">
        <div className="page--row">
          <div className="col-md-7 page--column">
            <h1 className="page--header"> Pizza Ordering </h1>
            {this.renderColumnContent()}
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

App.defaultProps  = {
  group: {},
  events: [],
  activeElement: '',
};

App.propTypes = {
  group: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  activeElement: PropTypes.string,
};

export default createContainer(() => {
  Meteor.subscribe('groups');
  Meteor.subscribe('events');

  let group = {};
  let events = [];
  let activeElement = '';

  if (Meteor.user() && Meteor.user().activeGroup) {
    const activeGroup = Meteor.user().activeGroup;
    group = Groups.findOne({ _id: activeGroup });
    events = Events.find({ groupId: activeGroup }).fetch();
    activeElement = Meteor.user().elemType;
  }

  return { group, events, activeElement };
}, App);
