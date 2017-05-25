import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Users } from '../api/users.js';


class User extends Component {
  constructor(props) {
    super(props);
    this.sendInvitation = this.sendInvitation.bind(this);
  }
  sendInvitation() {
    Meteor.call('user.inviteGroup', this.props.user._id, this.props.groupId);
  }

  render() {
    var username = this.props.user.profile ? 
      this.props.user.profile.name : this.props.user.username;
    return (
      <div>
        <p> 
          {username}
          <button onClick={this.sendInvitation}>Invite</button>
        </p>
      </div>
    );
  }
}

class InviteForm extends Component {
  // this is not very good 
  // I send all users becouse I think there isn`t many users
  // If there is very many users, this must be updated
  renderAllUsers() {
    return this.props.users.map((user) => (
        <User key={user._id} user={user} groupId={this.props.groupId}  />
    ));
  }

  render() {
    console.log(this.props.users, this.props);
    return (
      <div className="invite">
        {this.renderAllUsers()}
      </div>
    );
  }
}

InviteForm.propTypes = {
  users: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('users');
  
  return {
    users: Meteor.users.find({_id: { $ne: Meteor.userId() }}).fetch(),
  };
}, InviteForm);