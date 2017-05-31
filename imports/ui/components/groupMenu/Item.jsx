import React, { Component, PropTypes } from 'react';


class ItemCoupons extends Component {
  constructor(props) {
    super(props);

    this.state = {coupons: this.props.coupons};

    this.setCoupons = this.setCoupons.bind(this);
    this.handleCouponsChange = this.handleCouponsChange.bind(this);
  }

  setCoupons() {
    var groupId = this.props.groupId;
    var name = this.props.name;
    var coupons = this.state.coupons;

    Meteor.call('groups.setCoupons', groupId, name, coupons)
  }

  handleCouponsChange(event) {
    this.setState({coupons: event.target.value});
    console.log(this.state.coupons);
  }

  render() {
    var isGroupOwner = Meteor.userId() == this.props.groupOwner;
    if(isGroupOwner){
      return (
        <div className="menu-item-coupon"> 
          <input type="number" value={this.state.coupons}
            onChange={this.handleCouponsChange} />
          <button className="btn btn-primary btn-xs" onClick={this.setCoupons}> 
            Set 
          </button> 
        </div>
        );
    }
    return <div className="menu-item-coupon"> {this.state.coupons} </div>;
  }
}


export default class MenuItem extends Component {
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
        <div className="menu-item-name"> {item.name} </div>
        <div className="menu-item-price"> {item.price} </div>
        <ItemCoupons groupOwner={this.props.groupOwner} coupons={item.coupons}
          name={item.name} groupId={this.props.groupId} />
        <div className="menu-item-action">
          <button className="btn btn-primary btn-xs" onClick={this.deleteItem}> 
            Delete Item
          </button>
        </div>
      </div>
    );
  }
}