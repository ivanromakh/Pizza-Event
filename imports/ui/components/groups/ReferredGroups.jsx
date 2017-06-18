import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../../../api/groups/groups';

import Group from './Group.jsx';

class ReferredGroups extends Component {
  componentWillUnmount() {

  }

  renderGroups() {
    const groups = this.props.groups;
    if (groups) {
      return groups.map((group) => (
        <Group
          key={group._id}
          group={group}
          user={this.props.user}
          owner={false}
          referedGroup
        />
      ));
    }
    return null;
  }

  render() {
    return (
      <div>
        { this.renderGroups() }
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
  Meteor.subscribe('groups');

  const user = Meteor.users.findOne({ _id: Meteor.userId() });
  let groups = [];

  if (user && user.invitations) {
    const userInvitations = user.invitations.map((group) => group._id);
    groups = Groups.find({ _id: { $in: userInvitations } }).fetch();
  }

  return {
    user: user || {},
    groups,
  };
}, ReferredGroups);
