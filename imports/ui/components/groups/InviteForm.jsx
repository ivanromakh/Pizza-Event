import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


class InviteForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUser: '',
      disabled: false,
    };

    this.sendInvitation = this.sendInvitation.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(newValue) {
    this.setState({
      selectedUser: newValue,
    });
  }

  sendInvitation(event) {
    event.preventDefault();
    Meteor.call('groups.inviteUser', this.props.groupId, this.state.selectedUser.value);
    Meteor.call('user.inviteGroup', this.state.selectedUser.value, this.props.groupId);
  }

  render() {
    let options = this.props.users.map((user) => {
      const option = {};
      option.value = user._id;
      option.label = user.profile ? user.profile.name : user.username;
      return option;
    });

    if (!options) {
      options = [];
    }

    return (
      <div className="thumbnail">
        <p className="text-center"> Users invitation </p>
        <form onSubmit={this.sendInvitation}>
          <Select
            autofocus
            options={options}
            name="selected-order"
            disabled={this.state.disabled}
            value={this.state.selectedUser}
            onChange={this.handleSelectChange}
            searchable={this.state.searchable}
          />
          <button type="submit" className="btn btn-primary btn-xs pull-center">Invite</button>
        </form>
      </div>
    );
  }
}

InviteForm.propTypes = {
  users: PropTypes.array.isRequired,
  groupId: PropTypes.string.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('users');

  return {
    users: Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch(),
  };
}, InviteForm);
