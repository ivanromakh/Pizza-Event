import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import Order from './Order.jsx';

class EventOrdering extends Component {
  constructor(props) {
    super(props);

    this.state = { selectValue: '', count: 0, price: 0, disabled: false };

    this.createOrder = this.createOrder.bind(this);
    this.handleCountChange = this.handleCountChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.ConfirmOrder = this.ConfirmOrder.bind(this);
  }

  createOrder(event) {
    event.preventDefault();
    const eventId = this.props.activeEvent._id;
    const count = Number(this.state.count);
    const selectValue = this.state.selectValue;
    Meteor.call('events.createOrder',
      eventId, selectValue.value, selectValue.price, count);
  }

  handleCountChange(event) {
    this.setState({ count: event.target.value });
  }

  handleSelectChange(newValue) {
    this.setState({
      selectValue: newValue,
    });
  }

  ConfirmOrder() {
    const eventId = this.props.activeEvent._id;
    Meteor.call('events.confirmOrder', eventId);
    this.props.checkOrdering(eventId);
  }

  render() {
    if (Meteor.user().activeEvent && this.props.activeEvent) {
      const time = new Date(this.props.activeEvent.date);
      let menuItems = this.props.group.menuItems;

      if (!menuItems) {
        menuItems = [];
      }

      const options = menuItems.map((item) => {
        const x = {};
        x.label = `${item.name} ${item.price}$`;
        x.value = item.name;
        x.price = item.price;
        return x;
      });

      const userId = Meteor.userId();
      const userData = this.props.activeEvent.users.find((user) => user._id === userId);

      if (!userData) {
        return null;
      }

      if (!userData.orders) {
        userData.orders = [];
      }

      return (
        <div>
          <h1 className="centered"> Event { time.toUTCString() } orders </h1>
          <div className="events-table">
            <div className="events-row">
              <div className="events-head"> Name </div>
              <div className="events-head"> Price </div>
              <div className="events-head"> Count </div>
            </div>
            {
              userData.orders.map((order) => <Order order={order} />)
            }
          </div>
          <button
            className="btn btn-primary btn-xs"
            onClick={this.ConfirmOrder}
          >
            Cofirm order
          </button>
          {
            this.props.activeEvent.status === 'ordering' ? (
              <div className="create-order">
                <h3> Make your order </h3>
                <form onSubmit={this.createOrder} >
                  <Select
                    className="select-order"
                    autofocus
                    options={options}
                    name="selected-order"
                    disabled={this.state.disabled}
                    value={this.state.selectValue}
                    onChange={this.handleSelectChange}
                    searchable={this.state.searchable}
                  />
                  <label>
                    Count:
                    <input
                      type="number"
                      value={this.state.count}
                      onChange={this.handleCountChange}
                    />
                  </label>
                  <button className="btn btn-primary btn-xs" type="submit">
                    Add to order
                  </button>
                </form>
              </div>
            ) : null
          }
        </div>
      );
    }
    return (
      <p> Pleasure click <b>see orders</b> button on Event to see orders </p>
    );
  }
}

EventOrdering.defaultProps = {
  activeEvent: null,
};

EventOrdering.propTypes = {
  activeEvent: PropTypes.object,
  group: PropTypes.object.isRequired,
  checkOrdering: PropTypes.func.isRequired,
};

export default EventOrdering;
