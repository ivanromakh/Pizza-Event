import React, { Component, PropTypes } from 'react';

import InviteForm from './InviteForm';

class User extends Component {
  render() {
    return (
      <div> users </div>
    );
  }
}

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
    this.openMenuItems = this.onAccepted.bind(this);
  }

  renderUser(user) {
    return <p key={user._id}> {user.username} </p>
  }

  // Group owner open invite form
  onInviteForm() {
    this.setState({ showInviteForm: !this.state.showInviteForm });
  }

  openMenuItems() {
    console.log('open menu');
  }

  // User accept group
  onAccepted(){
    Meteor.call('groups.acceptUser', this.props.group._id, this.props.user);
    Meteor.call('user.acceptedGroup', this.props.group._id, this.props.user);
  }

  // Show users of this group
  onClick() {
    console.log('user', this.props.group);
    this.setState({ showUsers: !this.state.showUsers });
  }

  render() {
    console.log(this.props);
    return (
      <div className='thumbnail'>
        <div>
          { this.state.showInviteForm ? <InviteForm key={this.props.group._id}
            groupId={this.props.group._id}/> : null }
          <p>
            {this.props.group.name}
            {
              this.props.referedGroup ? (<button className="btn btn-primary btn-xs pull-right"
                onClick={this.onAccepted}> Accept</button>) : null
            }
            {
              this.props.owner ? (<button className="btn btn-primary btn-xs pull-right"
                onClick={this.onInviteForm}> Invite user </button>) : null
            }
            <button className="btn btn-primary btn-xs pull-right"
              onClick={this.onClick}> Show users </button>
            {
              !this.props.referedGroup ? (<button className="btn btn-primary btn-xs pull-right"
                onClick={this.openMenuItems}> MenuItems </button>) : null
            }

          </p>
          { 
            this.state.showUsers ? this.props.group.users.map((user)=>this.renderUser(user)) : null 
          }
        </div>
      </div>
    );
  }
}

Group.propTypes = {
  group: PropTypes.object.isRequired,
};

