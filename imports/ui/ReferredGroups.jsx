import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../api/groups.js';
import { Users } from '../api/users.js';

class ReferredGroups extends Component {
  render() {
    console.log(this.props);
    return (
      <p> sdf </p>
    );
  }
}


export default createContainer(() => {
  Meteor.subscribe('users');

  var user = Meteor.users.findOne({ _id: Meteor.userId() });
  var result = {};
  result.group = {};
  result.invitations = {};

  // sometimes user is underfined
  if(!user) {
    return {};
  }

  if(user.invitations) {
    console.log(user.invitations.map((group)=> group._id));
    result.invitations = user.invitations;
    result.group = Groups.find({ _id: {$in: user.invitations.map((group)=> group._id)}}).fetch();
  }
  return result
}, ReferredGroups);