import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { Events } from '../../../api/events/events'; 
import Order from './Order';

class EventOrdering extends Component {
  constructor(props){
    super(props);

    this.state = {selectValue: '', count: '', price: '', disabled: false};

    this.createOrder = this.createOrder.bind(this);
    this.handleCountChange = this.handleCountChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.ConfirmOrder = this.ConfirmOrder.bind(this);
  }

  createOrder(event) {
    event.preventDefault();
    var eventId = this.props.event._id;
    var count = this.state.count;
    var selectValue = this.state.selectValue;
    Meteor.call('events.createOrder', 
      eventId, selectValue.value, selectValue.price, count);
  }

  handleCountChange(event) {
    this.setState({ count: event.target.value });
  }

  findElement(item) {
    if(item._nameId == this[0]){
      return item;
    }
  }

  handleSelectChange(newValue) {
    this.setState({
      selectValue: newValue
    });
  }

  ConfirmOrder() {
    var eventId = this.props.event._id;
    Meteor.call('events.confirmOrder', eventId);
  }

  render() {
  	if(Meteor.user().activeEvent && this.props.event) {
  	  var time = new Date(this.props.event.date).toString();
  	  var menuItems = this.props.group.menuItems;

      if(!menuItems){
        menuItems = [];
      }

      var options = menuItems.map(function(item){ 
        var x = {};
        x.label = item.name + ' ' + item.price + '$';
        x.value = item.name;
        x.price = item.price;
        return x;
      });

      var user = this.props.event.users.find(
        function(user) {
          if(user._id == Meteor.userId()) 
            return user.orders
        }
      );

      if(!user){
        user = {orders: []};
      }
      
      if(!user.orders){
        user.orders = [];
      }

      return (
  	  	<div>
  	  	  <h1> Event {time} orders </h1>
          <div className="events-table">
            <div className="events-row">
              <div className="events-head"> Name </div>
              <div className="events-head"> Price </div>
              <div className="events-head"> Count </div>
            </div>
            {
              user.orders.map((order)=> <Order order={ order } />)
            }
          </div>
          {
            this.props.event.status == 'ordering' ? (
              <div className="create-order">
                <h3> Make your order </h3>
                <form onSubmit={ this.createOrder } >
                  <Select 
                    className="select-order"
                    autofocus 
                    options={ options }
                    name="selected-order"
                    disabled={ this.state.disabled }
                    value={ this.state.selectValue }
                    onChange={ this.handleSelectChange } 
                    searchable={ this.state.searchable }
                  />
                  <label>
                    Count:
                    <input
                      type="number" 
                      value={ this.state.count }
                      onChange={ this.handleCountChange }
                    />
                  </label>
                  <button
                    className="btn btn-primary btn-xs" 
                    type="submit"> 
                    Add to order
                  </button>
                </form>
              <button 
                className="btn btn-primary btn-xs" 
                onClick={ this.ConfirmOrder } >
                Cofirm order
              </button>
            </div>
          ) : null
        }
        </div>
  	  );
    }
    return <h1> Pleasure click "see orders" button on Event to see orders </h1>;
  }
}

export default createContainer(() => {
  Meteor.subscribe('events');
  
  if(Meteor.user() && Meteor.user().activeEvent) {
    var activeEvent = Meteor.user().activeEvent;
    return {
      event: Events.findOne({_id: activeEvent}),
    }
  }
  return {};
}, EventOrdering);
