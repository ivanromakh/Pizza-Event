import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
    this.onAccepted = this.onAccepted.bind(this);
    this.openMenuItems = this.openMenuItems.bind(this);
  }

  renderUser(user) {
    return (<p key={ user._id }> { user.username } </p>);
  }

  // Group owner open invite form
  onInviteForm() {
    this.setState({ showInviteForm: !this.state.showInviteForm });
  }

  openMenuItems() {
    Meteor.call('user.setActiveGroup', this.props.group._id);
  }

  // User accept group
  onAccepted() {
    Meteor.call('groups.acceptUser', this.props.group._id, this.props.user);
    Meteor.call('user.acceptedGroup', this.props.group._id, this.props.user);
  }

  // Show users of this group
  onClick() {
    this.setState({ showUsers: !this.state.showUsers });
  }

  render() {
    var group = this.props.group;
    var logo = group.logo ? group.logo : 'profile-group.png';
    return (
      <div className='thumbnail'>
        <div>
          { 
            this.state.showInviteForm 
              ? <InviteForm 
                  key={ group._id }
                  groupId={ group._id }
                /> 
              : null 
          }
          <p>
            <img src={ logo } height="42" width="42" />
            { this.props.group.name }
            {
              this.props.referedGroup ? (<button className="btn btn-primary btn-xs pull-right"
                onClick={ this.onAccepted }> Accept</button>) : null
            }
            {
              this.props.owner ? (<button className="btn btn-primary btn-xs pull-right"
                onClick={ this.onInviteForm }> Invite user </button>) : null
            }
            <button 
              className="btn btn-primary btn-xs pull-right"
              onClick={ this.onClick }> 
              Show users 
            </button>
            {
              !this.props.referedGroup ? (
                <button 
                  className="btn btn-primary btn-xs pull-right"
                  onClick={ this.openMenuItems }> 
                  MenuItems 
                </button>
              ) : null
            }
          </p>
          <p>Users list</p>
          { 
            this.state.showUsers ? group.users.map((user)=>this.renderUser(user)) : null 
          }
        </div>
      </div>
    );
  }
}

Group.propTypes = {
  group: PropTypes.object.isRequired,
};

