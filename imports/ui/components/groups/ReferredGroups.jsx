import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../../../api/groups/groups';
import Group from './Group.jsx';

class ReferredGroups extends Component {
  
  renderGroups() {
    var groups = this.props.groups;
    if(groups) {
      return groups.map((group) => (
        <Group 
          key={ group._id } 
          group={ group } 
          user={ this.props.user } 
          owner={ false } 
          referedGroup={ true }
        />
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

ReferredGroups.propTypes = {
  user: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('users');

  var user = Meteor.users.findOne({ _id: Meteor.userId() });
  var groups = [];

  // sometimes user is underfined
  if(!user) {
    user = {};
  }

  if(user.invitations) {
    var userInvitations = user.invitations.map((group)=> group._id);
    groups = Groups.find({ _id: {$in: userInvitations}}).fetch();
  }

  return {
    user: user,
    groups: groups,
  }
}, ReferredGroups);