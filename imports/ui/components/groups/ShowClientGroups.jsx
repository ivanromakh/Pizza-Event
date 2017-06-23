import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../../../api/groups/groups';
import { Images } from '../../../api/images/images';

import Group from './Group.jsx';
import ReferredGroups from './ReferredGroups.jsx';
import CreateGroupForm from './CreateGroupForm.jsx';


class ShowClientGroups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showOwnerGroups: false,
      showLocalGroups: false,
      showInvitations: false,
    };

    this.toggleOwnerGroups = this.toggleOwnerGroups.bind(this);
    this.toggleLocalGroups = this.toggleLocalGroups.bind(this);
    this.toggleInvitations = this.toggleInvitations.bind(this);
  }

  componentWillUnmount() {
    const subscriptions = this.props.subscriptions;

    subscriptions.handleGroups.stop();
    subscriptions.handleImages.stop();
  }

  toggleOwnerGroups() {
    this.setState({ showOwnerGroups: !this.state.showOwnerGroups });
  }

  toggleLocalGroups() {
    this.setState({ showLocalGroups: !this.state.toggleLocalGroups });
  }

  toggleInvitations() {
    this.setState({ showInvitations: !this.state.toggleInvitations });
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
      <div className="nav-side-menu">
        <div className="brand">Groups</div>
        <div className="menu-list">
          <ul className="menu-content">
            <CreateGroupForm />
            <li> 
              <a onClick={this.toggleOwnerGroups}> Owner Groups <span className="arrow"></span></a>
            </li>
            <ul>
              { this.state.showOwnerGroups ? this.renderOwnerGroups() : null }
            </ul>
          </ul>
          <ul className="menu-content">
            <li> 
              <a onClick={this.toggleLocalGroups}> Local Groups <span className="arrow"></span></a>
            </li>
            <ul>
              { this.state.showLocalGroups ? this.renderLocalGroups() : null }
            </ul>
          </ul>
          <ul className="menu-content">
            <li> 
              <a onClick={this.toggleInvitations}> Invitations <span className="arrow"></span></a>
            </li>
            <ul>
              { this.state.showInvitations 
                ? <ReferredGroups 
                  referredGroups={this.props.referredGroups}
                  user={this.props.user}
                /> : null
              }
            </ul>
          </ul>
        </div>
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
  const handleImages = Meteor.subscribe('images');

  const user = Meteor.user();
  const userId = Meteor.userId();

  return {
    subscriptions: { handleGroups, handleImages },
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
