import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionView, Calendar } from 'react-date-picker';
import { createContainer } from 'meteor/react-meteor-data';
import 'react-date-picker/index.css';

import { Events } from '../../../api/events/events';

import EventOrdering from './EventOrdering.jsx';
import Event from './Event.jsx';

class PizzaEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleEventForm: false,
      timestamp: new Date().getTime(),
    };

    this.toggleCreateEventForm = this.toggleCreateEventForm.bind(this);
    this.onCalendarChange = this.onCalendarChange.bind(this);
    this.createPizzaEvent = this.createPizzaEvent.bind(this);
  }

  onCalendarChange(dateString, { timestamp }) {
    this.setState({ timestamp });
  }

  toggleCreateEventForm() {
    this.setState({ toggleEventForm: !this.state.toggleEventForm });
  }


  createPizzaEvent(event) {
    event.preventDefault();
    const groupId = this.props.group._id;
    Meteor.call('events.createEvent', groupId, this.state.timestamp);
    this.toggleCreateEventForm();
  }

  renderGroupEvents() {
    const events = this.props.events;
    return events.map((event) => (
      <Event
        key={event._id}
        event={event}
        owner={this.props.group.owner}
      />
    ));
  }

  renderEventCreateForm() {
    if (this.state.toggleEventForm) {
      const tTime = new Date().toLocaleString('en-GB');
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
              <button type="submit" className="btn btn-primary btn-xs"> Create </button>
            </span>
          </form>
        </div>
      );
    }
    return (
      <button
        className="btn btn-primary btn-xs create-event-date"
        onClick={this.toggleCreateEventForm}
      >
        Click to create event
      </button>
    );
  }

  render() {
    if (this.props.group && this.props.group._id) {
      return (
        <div className="events-column">
          { this.renderEventCreateForm() }
          <div className="events-table">
            <div className="events-row">
              <div className="events-head"> Name </div>
              <div className="events-head"> Price </div>
              <div className="events-head"> Actions </div>
            </div>
            { this.renderGroupEvents() }
          </div>
          <EventOrdering
            activeEvent={this.props.activeEvent}
            group={this.props.group}
            checkOrdering={this.props.checkOrdering}
          />
        </div>
      );
    }
    return null;
  }
}

PizzaEvents.defaultProps = {
  activeEvent: null,
};

PizzaEvents.propTypes = {
  events: PropTypes.array.isRequired,
  group: PropTypes.object.isRequired,
  checkOrdering: PropTypes.func.isRequired,
  activeEvent: PropTypes.object,
};

export default createContainer(() => {
  const activeGroup = Meteor.user().activeGroup;
  const handleEvents = Meteor.subscribe('events', activeGroup);

  return {
    handleEvents,
    events: Events.find().fetch(),
    activeEvent: Events.findOne({ _id: Meteor.user().activeEvent }),
  };
}, PizzaEvents);
