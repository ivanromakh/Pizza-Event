import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../../../api/groups/groups';
import { Images } from '../../../api/images/images';
import Group from './Group';
import ReferredGroups from './ReferredGroups';


class ShowClientGroups extends Component {
  componentWillUnmount() {
    this.props.userGroups.stop();
  }

  renderLocalGroups() {
    const groups = this.props.userGroups;
    const userId = Meteor.userId();

    const localGroups = groups.filter((group) => {
      return group.owner !== userId;      
    });
    
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

    const ownerGroups = groups.filter((group) => {
      return group.owner === userId;
    });

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

ShowClientGroups.defaultProps  = {
  user: { groups: [] },
  userGroups: [],
};

ShowClientGroups.propTypes = {
  user: PropTypes.object.isRequired,
  userGroups: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('userGroups');
  Meteor.subscribe('images');

  let user = Meteor.user();

  if (!user) {
    return {};
  }

  let { _id: userId, groups: userGroups = [NaN] } = user;

  return {
    user: user,
    referredGroups: Groups.find({ invitations: { $elemMatch: { _id: userId } } }).fetch(),
    userGroups: Groups.find({ $or: userGroups })
      .fetch()
      .map((group) => {
        let image = Images.findOne({ groupId: group._id });
        if (image) {
          group.logo = image.url();
        }
        return group;
      }
    ),
  };
}, ShowClientGroups);
