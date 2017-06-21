import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ItemCoupons extends Component {
  constructor(props) {
    super(props);

    this.state = { coupons: this.props.coupons };

    this.setCoupons = this.setCoupons.bind(this);
    this.handleCouponsChange = this.handleCouponsChange.bind(this);
  }

  setCoupons() {
    const groupId = this.props.groupId;
    const name = this.props.name;
    const coupons = this.state.coupons;

    Meteor.call('groups.setCoupons', groupId, name, coupons);
  }

  handleCouponsChange(event) {
    this.setState({ coupons: event.target.value });
  }

  render() {
    const isGroupOwner = Meteor.userId() === this.props.groupOwner;
    if (isGroupOwner) {
      return (
        <div className="menu-item-coupon">
          <input
            type="number"
            value={this.state.coupons}
            onChange={this.handleCouponsChange}
          />
          <button
            className="btn btn-primary btn-xs"
            onClick={this.setCoupons}
          >
            Set
          </button>
        </div>
      );
    }
    return <div className="menu-item-coupon"> { this.state.coupons } </div>;
  }
}

ItemCoupons.propTypes = {
  name: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  groupOwner: PropTypes.string.isRequired,
  coupons: PropTypes.number.isRequired,
};

export default ItemCoupons;
