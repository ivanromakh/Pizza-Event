import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class Order extends Component {
  render() {
  	var order = this.props.order;
  	console.log('dddd', this.props.order);
  	return (
  	  <div className="menu-item-name">{order.name}</div>
  	  <div className="menu-item-name">{order.price}</div>
  	  <div className="menu-item-name">{order.count}</div>
  	);
  }
}