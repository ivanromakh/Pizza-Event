import React, { Component, PropTypes } from 'react';

export default class Order extends Component {
  render() {
  	var order = this.props.order;
  	return (
  	  <div className="events-row">
  	    <div className="menu-item-name">{order.name}</div>
  	    <div className="menu-item-name">{order.price}</div>
  	    <div className="menu-item-name">{order.count}</div>
  	  </div>
  	);
  }
}