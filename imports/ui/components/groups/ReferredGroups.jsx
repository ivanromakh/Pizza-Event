import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../../../api/groups/groups';
import Group from './Group.jsx';

class ReferredGroups extends Component {
  
  renderGroups() {
    if(this.props.group) {
      return this.props.group.map((group) => (
        <Group key={group._id} group={group} user={this.props.user} owner={false} referedGroup={true}/>
      ));
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderGroups()}
      </div>
    );
  }
}

export default createContainer(() => {
  Meteor.subscribe('users');

  var user = Meteor.users.findOne({ _id: Meteor.userId() });
  var result = {};
  result.invitations = {};

  // sometimes user is underfined
  if(!user) {
    return result;
  }

  if(user.invitations) {
    result.user = user,
    result.invitations = user.invitations;
    result.group = Groups.find({ _id: {$in: user.invitations.map((group)=> group._id)}}).fetch();
  }
  return result
}, ReferredGroups);