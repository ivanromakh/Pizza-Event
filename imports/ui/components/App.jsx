import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import PizzaEvents from './events/PizzaEvents.jsx';
import MenuItems from './groupMenu/MenuItems.jsx';
import ShowClientGroups from './groups/ShowClientGroups.jsx';
import CreateGroupForm from './groups/CreateGroupForm.jsx';
import AccountUiWrapper from './AccountUiWrapper.jsx';

import { Groups } from '../../api/groups/groups';
import { Events } from '../../api/events/events';


class App extends Component {
  componentWillUnmount() {
    const subsciptions = this.props.subsciptions();

    subsciptions.handleGroup.stop();
    subsciptions.handleEvents.stop();
    subsciptions.handleUsers.stop();
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

App.defaultProps = {
  subsciptions: {},
  group: {},
  events: [],
  activeElement: '',
};

App.propTypes = {
  subsciptions: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  activeElement: PropTypes.string,
};

export default createContainer(() => {
  const handleUsers = Meteor.subscribe('users');

  if (!Meteor.user()) {
    return {};
  }

  const activeGroup = Meteor.user().activeGroup;

  const handleActiveGroup = Meteor.subscribe('getGroupById', activeGroup);
  const handleEvents = Meteor.subscribe('events', activeGroup);

  return {
    subsciptions: { handleUsers, handleActiveGroup, handleEvents },
    group: Groups.findOne(),
    events: Events.find().fetch(),
    activeElement: Meteor.user().elemType,
  };
}, App);
