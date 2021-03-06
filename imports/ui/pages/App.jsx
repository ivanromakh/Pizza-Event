import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import PizzaEvents from '../components/events/PizzaEvents.jsx';
import MenuItems from '../components/groupMenu/MenuItems.jsx';
import ShowClientGroups from '../components/groups/ShowClientGroups.jsx';

import { Groups } from '../../api/groups/groups';


class App extends Component {
  constructor() {
    super();
    this.state = { show: false };
  }

  componentWillUnmount() {
    const subsciptions = this.props.subsciptions();

    subsciptions.handleGroup.stop();
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <ShowClientGroups />
          </div>
          <div className="col-sm-9 col-sm-offset-3 thumbnail page-content">
            <h1 className="page--header"> Pizza Ordering </h1>
            {this.renderColumnContent()}
          </div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  subsciptions: {},
  group: {},
  activeElement: '',
};

App.propTypes = {
  subsciptions: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
  activeElement: PropTypes.string,
};

export default createContainer(() => {
  const handleUsers = Meteor.subscribe('users');

  if (!Meteor.user()) {
    return {};
  }

  let activeGroup = Meteor.user().activeGroup;

  if (!activeGroup) {
    activeGroup = '';
  }

  const handleActiveGroup = Meteor.subscribe('getGroupById', activeGroup);

  return {
    subsciptions: { handleUsers, handleActiveGroup },
    group: Groups.findOne({ _id: activeGroup }),
    activeElement: Meteor.user().elemType,
  };
}, App);
