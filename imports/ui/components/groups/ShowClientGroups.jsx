import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';

import { Images } from '../../../api/images/images';
import { Groups } from '../../../api/groups/groups';
import Group from './Group';
import ReferredGroups from './ReferredGroups';


class ShowClientGroups extends Component {
  componentWillUnmount() {
    this.props.user.stop();
    this.props.ownerGroups.stop();
    this.props.groupsData.stop();
  }

  renderClientGroups() {
    const groups = this.props.groupsData;

    return groups.map((group) => (
      <Group
        key={group._id}
        group={group}
        user={this.props.user}
        owner={false}
      />
    ));
  }

  renderOwnerGroups() {
    return this.props.ownerGroups.map((group) => (
      <Group
        key={group._id}
        group={group}
        user={this.props.user}
        owner
      />
    ));
  }

  render() {
    return (
      <div className="thumbnail">
        <p> Owner Groups </p>
        <ul>
          { this.renderOwnerGroups() }
        </ul>
        <p> Local Groups </p>
        <ul>
          { this.renderClientGroups() }
        </ul>
        <p> Groups which invited you </p>
        <ReferredGroups />
      </div>
    );
  }
}

ShowClientGroups.propTypes = {
  groupsData: PropTypes.array.isRequired,
  ownerGroups: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const handle = Meteor.subscribe('groups');
  Meteor.subscribe('users');
  Meteor.subscribe('images');

  let groupsData = [];
  const ownerGroups = Groups.find({ owner: Meteor.userId() }).fetch();

  if (Meteor.user()) {
    if (Meteor.user().groups && Meteor.user().groups != []) {
      groupsData = Groups.find({ $or: Meteor.user().groups }).fetch();
    }
  }

  groupsData.map((group) => {
    const image = Images.findOne({ groupId: group._id });
    if (image) {
      group.logo = image.url();
    }
  }, { Images });

  ownerGroups.map((group) => {
    const image = Images.findOne({ groupId: group._id });

    if (image) {
      group.logo = image.url();
    }
  }, { Images });

  console.log(groupsData, ownerGroups);

  return {
    user: Meteor.users.findOne({ _id: Meteor.userId() }) || { groups: [] },
    ownerGroups: ownerGroups || [],
    groupsData,
  };
}, ShowClientGroups);
