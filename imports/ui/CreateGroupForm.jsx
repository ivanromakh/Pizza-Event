import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Groups } from '../api/groups.js'

export default class CreateGroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {groupName: ''};

    this.handleChange = this.handleChange.bind(this);
    this.createGroup = this.createGroup.bind(this);
  }

  handleChange(event) {
    this.setState({groupName: event.target.value});
  }

  createGroup(event) {
    event.preventDefault();
    var name = this.state.groupName;
    if (Meteor.userId()) {
      Meteor.call('groups.create', name);
    }
    this.setState({groupName: ''});
  }

  render() {
    return (
      <form onSubmit={this.createGroup}>
        <p> Create group </p>
        <label>
          Name:
          <input type="text" value={this.state.groupName} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Create" />
      </form>
    );
  }
}