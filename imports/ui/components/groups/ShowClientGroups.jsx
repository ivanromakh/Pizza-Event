import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../../../api/groups.js';
import Group from './Group.jsx';
import ReferredGroups from './ReferredGroups.jsx';


class ShowClientGroups extends Component {
  renderGroups(){ 
    return this.props.groups.map((group) => (
      <Group key={group._id} group={group} owner={false}/>
    )); 
  }

  renderOwnerGroups(){
    return this.props.ownerGroups.map((group) => (
        <Group key={group._id} group={group} owner={true} />
    )); 
  }

  render() {
    console.log(this.props);
    return (
      <div className="thumbnail">
        <p> Owner Groups </p>
        <ul>
          {this.renderOwnerGroups()}
        </ul>
        <p> Local Groups </p>
        <ul>
          {this.renderGroups()}
        </ul>
        <p> Groups which invited you </p>
        <ReferredGroups />
      </div>
    );
  }
}

ShowClientGroups.propTypes = {
  groups: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('groups');
  Meteor.subscribe('users');

  return {
    user: Meteor.users.findOne({ _id: Meteor.userId() }),
    ownerGroups: Groups.find({ owner: Meteor.userId() }).fetch(),
    groups: Groups.find({ owner: { $ne: Meteor.userId() } }).fetch(),
  };
}, ShowClientGroups);