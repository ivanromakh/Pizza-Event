import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class AcceptButton extends Component {
  constructor(props) {
    super(props);

    this.onAccepted = this.onAccepted.bind(this);
  }

  onAccepted() {
    Meteor.call('groups.acceptUser', this.props.groupId, this.props.user);
    Meteor.call('user.acceptedGroup', this.props.groupId, this.props.user);
  }

  render() {
    return <li><a className="fullsize" onClick={this.onAccepted} >Accept</a></li>;
  }
}

AcceptButton.propTypes = {
  groupId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default AcceptButton;
