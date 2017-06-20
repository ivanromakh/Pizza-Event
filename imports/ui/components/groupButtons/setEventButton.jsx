import React, { Component } from 'react';


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
    return (
      <button
        className="btn btn-primary btn-xs btn-block"
        onClick={this.onAccepted}>Accept</button>
    );
  }
}

export default AcceptButton;