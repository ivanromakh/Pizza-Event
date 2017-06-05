import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class ItemCoupons extends Component {
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

ItemCoupons.propTypes = {
  name: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  groupOwner: PropTypes.string.isRequired,
};