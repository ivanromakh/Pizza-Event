import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

export default class Event extends Component {
  constructor(props) {
    super(props);

    this.confirmEvent = this.confirmEvent.bind(this);
    this.setActiveOrder = this.setActiveOrder.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  confirmEvent() {
    var event = this.props.event;
    Meteor.call('events.confirmUser', event._id);
  }

  checkUser(user) {
    return Meteor.userId() == user._id;
  }

  setActiveOrder() {
    Meteor.call('user.setActiveEvent', this.props.event._id);
  }

  changeStatus() {
    var event = this.props.event;
    Meteor.call('events.changeStatus', event._id)
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
    var event = this.props.event;

    if(event.users && event.users.find(this.checkUser)) {
      if(this.props.owner == Meteor.userId()) {
        return (
          <div>
            { this.showOrdersButton() }
            { this.changeStatusButton() }
          </div>
        );
      } else {
        return (
          <div>
            { this.showOrdersButton() }
          </div>
        );
      }
    }

    return <div>{ this.confirmButton() }</div>; 
  }

  render() {
    var event = this.props.event;
    var time = new Date(event.date);

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