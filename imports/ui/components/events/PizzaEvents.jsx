import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { TransitionView, Calendar } from 'react-date-picker';
import 'react-date-picker/index.css';

import EventOrdering from './EventOrdering'

class Event extends Component {
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

export default class PizzaEvents extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		toggleEventForm: false,
  		timestamp: new Date().getTime(),
  	}
    
    this.toggleCreateEventForm = this.toggleCreateEventForm.bind(this);
    this.onCalendarChange = this.onCalendarChange.bind(this);
    this.createPizzaEvent = this.createPizzaEvent.bind(this);
  }

  onCalendarChange(dateString, { dateMoment, timestamp }) {
    this.setState({timestamp: timestamp});
  }

  toggleCreateEventForm() {
    this.setState({toggleEventForm: !this.state.toggleEventForm}); 
  }

  
  createPizzaEvent(event) {
  	event.preventDefault();
  	var groupId = this.props.group._id;
    Meteor.call("events.createEvent", groupId, this.state.timestamp);
    this.toggleCreateEventForm();
  }

  renderGroupEvents() {
  	var events = this.props.events;
    return events.map((event)=>(
      <Event key={event._id} event={event} />
    ));  
  }

  renderEventCreateForm() {
  	if(this.state.toggleEventForm){
      var tTime = new Date().toLocaleString("en-GB");
  	  return (
        <div className="create-event">
          <form className="clock" onSubmit={this.createPizzaEvent}>
            <h3> Create “Pizza day” event </h3>
       	    <TransitionView>
              <Calendar
                dateFormat="DD/MM/YYYY HH:mm:ss"
                defaultDate={tTime}
                onChange={this.onCalendarChange}
              />
            </TransitionView>
            <span>
            <button type='submit' className="btn btn-primary btn-xs"> Create </button>
            </span>
          </form>
        </div>
      );
    }
    return <button className="btn btn-primary btn-xs" onClick={this.toggleCreateEventForm}> Click to to create event </button>;
  }

  render() {
  	if(this.props.group && this.props.group._id) {
      return (
        <div className="events-column">
          {this.renderEventCreateForm()}
          <div className="events-table">
            <div className="events-row">
              <div className="events-head"> Name </div>
              <div className="events-head"> Price </div>
              <div className="events-head"> Actions </div>
            </div>
            {this.renderGroupEvents()}
          </div>
          <EventOrdering group={this.props.group}/>
        </div>
      );
    } else {
      return null;
    }
  }
}