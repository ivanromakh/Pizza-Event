import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ItemCoupons from './ItemCoupons.jsx';


class Item extends Component {
  constructor(props) {
    super(props);

    this.deleteItem = this.deleteItem.bind(this);
  }

  deleteItem() {
    const itemName = this.props.item.name;
    const groupId = this.props.groupId;
    Meteor.call('groups.removeMenuItem', groupId, itemName);
  }

  render() {
    const item = this.props.item;
    return (
      <div className="menu-item-row">
        <div className="menu-item-name"> { item.name } </div>
        <div className="menu-item-price"> { item.price } </div>
        <ItemCoupons
          groupOwner={this.props.groupOwner}
          coupons={item.coupons}
          name={item.name}
          groupId={this.props.groupId}
        />
        <div className="menu-item-action">
          <button className="btn btn-primary btn-xs" onClick={this.deleteItem}>
            Delete Item
          </button>
        </div>
      </div>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  groupOwner: PropTypes.string.isRequired,
};

export default Item;
