import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AcceptButton from '../groupButtons/acceptedButton';
import InviteForm from './InviteForm';


// Group component for each of client groups
export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUsers: false,
      showInviteForm: false,
      activeGroup: false,
    };

    this.onClick = this.onClick.bind(this);
    this.onInviteForm = this.onInviteForm.bind(this);
    this.openMenuItems = this.openMenuItems.bind(this);
    this.openEvents = this.openEvents.bind(this);
  }

  onInviteForm() {
    this.setState({ showInviteForm: !this.state.showInviteForm });
  }

  openMenuItems() {
    Meteor.call('user.setActiveGroup', this.props.group._id, 'menuItems');
    Meteor.call('user.unsetActiveEvent');
  }

  openEvents() {
    Meteor.call('user.setActiveGroup', this.props.group._id, 'events');
    Meteor.call('user.unsetActiveEvent');
  }

  onClick() {
    this.setState({ showUsers: !this.state.showUsers });
  }

  renderInviteForm(group) {
    if (this.state.showInviteForm) {
      return (
        <InviteForm key={group._id} groupId={group._id} />
      );
    }
    return null;
  }

  renderAcceptButton() {
    if (this.props.referedGroup) {
      return (
        <AcceptButton groupId = {this.props.group._id} user = {this.props.user} />
      );
    }
    return null;
  }

  renderInviteButton() {
    if (this.props.owner) {
      return (
        <button className="btn btn-primary btn-xs btn-block" onClick={this.onInviteForm}>
          Invite user
        </button>
      );
    }
    return null;
  }

  renderUsersButton() {
    return (
      <button
        className="btn btn-primary btn-xs btn-block"
        onClick={this.onClick}
      >
          Show users
      </button>
    );
  }

  renderMenuItemsButton() {
    if (!this.props.referedGroup) {
      return (
        <button className="btn btn-primary btn-xs btn-block" onClick={this.openMenuItems}>
          MenuItems
        </button>
      );
    }
    return null;
  }

  renderEventsButton() {
    if (!this.props.referedGroup) {
      return (
        <button className="btn btn-primary btn-xs btn-block" onClick={this.openEvents}>
          events
        </button>
      );
    }
    return null;
  }

  renderUser(user) {
    return (<li className="list-group-item" key={user._id}> { user.username } </li>);
  }

  renderUsersList(group) {
    if (this.state.showUsers) {
      return (
        <div>
          <p>Users list</p>
          <ul className="list-group">
            { group.users.map((user) => this.renderUser(user)) }
          </ul>
        </div>
      );
    }
    return null;
  }

  render() {
    const group = this.props.group;
    const logo = group.logo ? group.logo : 'profile-group.png';
    return (
      <div className="thumbnail">
        <div>
          { this.renderInviteForm(group) }
          <div className="row">
            <div className="col-md-7">
              <img src={logo} height="42" width="42" />
              { group.name }
            </div>
            <div className="col-md-4">
              { this.renderAcceptButton() }
              { this.renderInviteButton() }
              { this.renderUsersButton() }
              { this.renderMenuItemsButton() }
              { this.renderEventsButton() }
            </div>
          </div>
          { this.renderUsersList(group) }
        </div>
      </div>
    );
  }
}

Group.propTypes = {
  group: PropTypes.object.isRequired,
};

