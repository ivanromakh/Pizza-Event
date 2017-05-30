import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import { Users } from '../../../api/users/users';


class InviteForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUser: '',
      disabled: false
    };

    this.sendInvitation = this.sendInvitation.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(newValue) {
    this.setState({
      selectedUser: newValue
    });
  }

  sendInvitation(event) {
    event.preventDefault();

    Meteor.call('user.inviteGroup', this.state.selectedUser.value, this.props.groupId);
  }

  render() {
    var options = this.props.users.map(function(user){
      option = {};
      option.value = user._id;
      option.label = user.profile ? user.profile.name : user.username;
    });

    return (
      <div>
        <form onSubmit={this.sendInvitation}>
          <Select autofocus options={options}
            name="selected-order"
            disabled={this.state.disabled}
            value={this.state.selectedUser} onChange={this.handleSelectChange} 
            searchable={this.state.searchable}
          />
          <button type="submit" className>Invite</button>
        </form>
      </div>
    );
  }
}

InviteForm.propTypes = {
  users: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('users');
  
  return {
    users: Meteor.users.find({_id: { $ne: Meteor.userId() }}).fetch(),
  };
}, InviteForm);