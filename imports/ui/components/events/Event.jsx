import React, { Component } from 'react';

export default class Event extends Component {
  constructor(props) {
  	super(props);

  	this.confirmEvent = this.confirmEvent.bind(this);
  	this.setActiveOrder = this.setActiveOrder.bind(this);
  }

  confirmEvent() {
  	var event = this.props.event;
    Meteor.call('events.confirmUser', event._id);
  }

  checkUser(user) {
    return Meteor.userId() == user._id;
  }

  setActiveOrder(user) {
    Meteor.call('user.setActiveEvent', this.props.event._id);
  }

  renderActions() {
  	var event = this.props.event;
  	if(event.users && event.users.find(this.checkUser)) {
  	  return (
  	      <button className="btn btn-primary btn-xs" onClick={this.setActiveOrder}> 
            See orders
          </button>
  	  );
  	} 

  	return (
  	  <button className="btn btn-primary btn-xs" onClick={this.confirmEvent}> 
        Confirm
      </button>
  	);
  }

  render() {
    var event = this.props.event;
    var time = new Date(event.date);

    return (
      <div className="event-row">
        <div className="event-date"> {time.toString()} </div>
        <div className="event-status"> {event.status} </div>
        <div className="event-actions">
          {this.renderActions()}
        </div>
      </div>
	  );
  }
}