import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import ItemCoupons from './ItemCoupons.jsx';


export default class Item extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
  }

  deleteItem() {
    let itemName = this.props.item.name;
    let groupId = this.props.groupId;
    Meteor.call('groups.removeMenuItem', groupId, itemName);
  }

  render() {
    var item = this.props.item;
    return (
      <div className="menu-item-row">
        <div className="menu-item-name"> { item.name } </div>
        <div className="menu-item-price"> { item.price } </div>
        <ItemCoupons 
          groupOwner={ this.props.groupOwner } 
          coupons={ item.coupons }
          name={ item.name } 
          groupId={ this.props.groupId } 
        />
        <div className="menu-item-action">
          <button className="btn btn-primary btn-xs" onClick={ this.deleteItem }>
            Delete Item
          </button>
        </div>
      </div>
    );
  }
}

