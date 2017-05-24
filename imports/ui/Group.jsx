import React, { Component, PropTypes } from 'react';

class User extends Component {
	render() {
		return (
			<div> listeners </div>
		);
	}
}

class GroupUsers extends Component {
    render() {
        return (
            <div> users
            </div>
        );
    }
}

class Invite extends Component {
  render() {
    return (
      <div className="invite-user-form">
        <button>Invite</button>
      </div>
    );
  }
}

// Group component for each of client groups
export default class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {showResults: false};

    this.onClick = this.onClick.bind(this);
  }

  onClick(){
    this.setState({ showResults: !this.state.showResults });
  }

  render() {
    return (
      <div className='thumbnail'>
        <div onClick={this.onClick}> {this.props.group.name}
          { this.state.showResults ? <GroupUsers /> : null }
        </div>
        <Invite />
      </div>
    );
  }
}




Group.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  group: PropTypes.object.isRequired,
};

