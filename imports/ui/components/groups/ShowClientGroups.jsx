import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../../../api/groups/groups';
import { Images } from '../../../api/images/images';
import Group from './Group.jsx';
import ReferredGroups from './ReferredGroups.jsx';


class ShowClientGroups extends Component {
  componentWillUnmount() {
    const subscriptions = this.props.subscriptions;

    subscriptions.handleGroups.stop();
    subscriptions.handleImages.stop();
    subscriptions.handleUsers.stop();
  }

  renderLocalGroups() {
    const groups = this.props.userGroups;
    const userId = Meteor.userId();

    const localGroups = groups.filter((group) => group.owner !== userId);

    return localGroups.map((group) => (
      <Group
        key={group._id}
        group={group}
        user={this.props.user}
        owner={false}
      />
    ));
  }

  renderOwnerGroups() {
    const groups = this.props.userGroups;
    const userId = Meteor.userId();

    const ownerGroups = groups.filter((group) => group.owner === userId);

    return ownerGroups.map((group) => (
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
          { this.renderLocalGroups() }
        </ul>
        <p> Groups which invited you </p>
        <ReferredGroups
          referredGroups={this.props.referredGroups}
          user={this.props.user}
        />
      </div>
    );
  }
}

ShowClientGroups.defaultProps = {
  user: { groups: [] },
  userGroups: [],
};

ShowClientGroups.propTypes = {
  subscriptions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userGroups: PropTypes.array.isRequired,
  referredGroups: PropTypes.array.isRequired,
};

export default createContainer(() => {
  const handleGroups = Meteor.subscribe('userGroups');
  const handleUsers = Meteor.subscribe('users');
  const handleImages = Meteor.subscribe('images');


  const user = Meteor.user();
  const userId = Meteor.userId();

  return {
    subscriptions: { handleGroups, handleUsers, handleImages },
    user,
    referredGroups: Groups.find({ invitations: { $elemMatch: { _id: userId } } }).fetch(),
    userGroups: Groups.find({ users: { $elemMatch: { _id: userId } } })
      .fetch()
      .map((group) => {
        const image = Images.findOne({ groupId: group._id });
        const groupWithLogo = Object.create(group);
        if (image) {
          groupWithLogo.logo = image.url();
        }
        return groupWithLogo;
      },
    ),
  };
}, ShowClientGroups);
