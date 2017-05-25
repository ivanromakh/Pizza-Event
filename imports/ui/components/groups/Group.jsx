import React, { Component, PropTypes } from 'react';

import InviteForm from './InviteForm';

class GroupUsers extends Component {
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
    };

    this.onClick = this.onClick.bind(this);
    this.onInviteForm = this.onInviteForm.bind(this);
    this.onAccepted = this.onAccepted.bind(this);
  }

  // Group owner open invite form
  onInviteForm() {
    this.setState({ showInviteForm: !this.state.showInviteForm });
  }

  // User accept group
  onAccepted(){
    console.log('user', this.props);
    Meteor.call('groups.acceptUser', this.props.group._id, this.props.user);
  }

  // Show users of this group
  onClick() {
    this.setState({ showUsers: !this.state.showUsers });
  }

  render() {
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
          </p>
          { this.state.showUsers ? <GroupUsers /> : null }
        </div>
      </div>
    );
  }
}

Group.propTypes = {
  group: PropTypes.object.isRequired,
};

