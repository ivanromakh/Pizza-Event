import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ShowMenuButton extends Component {
  constructor(props) {
    super(props);

    this.openMenuItems = this.openMenuItems.bind(this);
  }

  openMenuItems() {
    Meteor.call('user.setActiveGroup', this.props.groupId, 'menuItems');
    Meteor.call('user.unsetActiveEvent');
  }

  render() {
    return (
      <button className="btn btn-primary btn-xs btn-block" onClick={this.openMenuItems}>
        Menu
      </button>
    );
  }
}

ShowMenuButton.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default ShowMenuButton;
