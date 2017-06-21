import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ShowEventsButton extends Component {
  constructor(props) {
    super(props);

    this.openEvents = this.openEvents.bind(this);
  }

  openEvents() {
    Meteor.call('user.setActiveGroup', this.props.groupId, 'events');
    Meteor.call('user.unsetActiveEvent');
  }

  render() {
    return (
      <button className="btn btn-primary btn-xs btn-block" onClick={this.openEvents}>
        Accept
      </button>
    );
  }
}

ShowEventsButton.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default ShowEventsButton;
