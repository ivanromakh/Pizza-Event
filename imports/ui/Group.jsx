import React, { Component, PropTypes } from 'react';

import InviteForm from './InviteForm';

class GroupUsers extends Component {
  render() {
    return (
      <div> users
      </div>
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
  }

  onInviteForm() {
    this.setState({ showInviteForm: !this.state.showInviteForm });
  }

  onClick() {
    this.setState({ showUsers: !this.state.showUsers });
  }

  render() {
    return (
      <div className='thumbnail'>
        <div>
          { this.state.showInviteForm ? <InviteForm key={this.props.group._id} groupId={this.props.group._id}/> : null } 
          <p>
            {this.props.group.name}
            { 
              this.props.owner ? (<button onClick={this.onInviteForm}> Invite user </button>) : null
            }
            <button onClick={this.onClick}> Show users </button>
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

