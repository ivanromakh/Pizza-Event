import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AcceptButton from '../groupButtons/AcceptButton.jsx';
import ShowEventsButton from '../groupButtons/ShowEventsButton.jsx';
import ShowMenuButton from '../groupButtons/ShowMenuButton.jsx';
import InviteForm from './InviteForm.jsx';

import { getUserName } from '../../../utils/client-utils';

// Group component for each of client groups
export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showActions: false,
      showUsers: false,
      showInviteForm: false,
      activeGroup: false,
    };

    this.toggleUsers = this.toggleUsers.bind(this);
    this.onInviteForm = this.onInviteForm.bind(this);
    this.toggleActions = this.toggleActions.bind(this);
  }

  onInviteForm() {
    this.setState({ showInviteForm: !this.state.showInviteForm });
  }

  toggleUsers() {
    this.setState({ showUsers: !this.state.showUsers });
  }

  toggleActions() {
    this.setState({ showActions: !this.state.showActions });
  }

  renderInviteForm(group) {
    if (this.props.owner && this.state.showInviteForm) {
      return (
        <InviteForm key={group._id} groupId={group._id} />
      );
    }
    return null;
  }

  renderAcceptButton(group) {
    if (this.props.referedGroup) {
      return (
        <AcceptButton groupId={group._id} user={this.props.user} />
      );
    }
    return null;
  }

  renderInviteButton() {
    if (this.props.owner) {
      return <li><a onClick={this.onInviteForm}> Invite user </a></li>;
    }
    return null;
  }

  renderUser(user) {
    const username = getUserName(user);
    return <li className="list-group-item" key={user._id}> { username } </li>;
  }

  renderUsersList(group) {
    return (
      <ul className="list-users">
        { group.users.map((user) => this.renderUser(user)) }
      </ul>
    );
  }

  renderActions(group) {
    return (
      <ul className="child-nav">
        { this.renderInviteForm(group) }
        { this.renderAcceptButton(group) }
        { this.renderInviteButton() }
        { !this.props.referedGroup ? <ShowEventsButton groupId={group._id} /> : null }
        { !this.props.referedGroup ? <ShowMenuButton groupId={group._id} /> : null }
        <li><a onClick={this.toggleUsers}> Show users </a></li>
        { this.state.showUsers ? this.renderUsersList(group) : null }
      </ul>
    );
  }

  render() {
    const group = this.props.group;
    const logo = group.logo ? group.logo : 'profile-group.png';
    return (
      <ul>
        <li>
          <img className="img-circle" src={logo} alt="group-logo" height="42" width="42" />
          <a onClick={this.toggleActions}>
            { group.name }
            <span className="arrow"></span>
          </a>
        </li>
        { this.state.showActions ? this.renderActions(group) : null }
      </ul>
    );
  }
}

Group.defaultProps = {
  referedGroup: false,
};

Group.propTypes = {
  owner: PropTypes.bool.isRequired,
  referedGroup: PropTypes.bool,
  user: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
};
