import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Event extends Component {
  constructor(props) {
    super(props);

    this.setActiveOrder = this.setActiveOrder.bind(this);
    this.confirmEvent = this.confirmEvent.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  setActiveOrder() {
    Meteor.call('user.setActiveEvent', this.props.event._id);
  }

  confirmEvent() {
    const event = this.props.event;
    Meteor.call('events.confirmUser', event._id);
  }

  changeStatus() {
    const event = this.props.event;
    Meteor.call('events.changeStatus', event._id);
  }

  checkUser(user) {
    return Meteor.userId() === user._id;
  }

  showOrdersButton() {
    return (
      <button className="btn btn-primary btn-xs" onClick={this.setActiveOrder}>
        See orders
      </button>
    );
  }

  changeStatusButton() {
    return (
      <button className="btn btn-primary btn-xs" onClick={this.changeStatus}>
        Change status
      </button>
    );
  }

  confirmButton() {
    return (
      <button className="btn btn-primary btn-xs" onClick={this.confirmEvent}>
        Confirm
      </button>
    );
  }

  renderActions() {
    const event = this.props.event;
    const userId = Meteor.userId();

    if (event.users && event.users.find((user) => userId === user._id)) {
      if (this.props.owner === userId) {
        return (
          <div>
            { this.showOrdersButton() }
            { this.changeStatusButton() }
          </div>
        );
      }
      return (
        <div>
          { this.showOrdersButton() }
        </div>
      );
    }

    return (
      <div>
        { this.confirmButton() }
      </div>
    );
  }

  render() {
    const event = this.props.event;
    const time = new Date(event.date);

    return (
      <div className="event-row">
        <div className="event-date"> { time.toUTCString() } </div>
        <div className="event-status"> { event.status } </div>
        <div className="event-actions">
          { this.renderActions() }
        </div>
      </div>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired,
  owner: PropTypes.string.isRequired,
};

export default Event;
