import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';

import { Groups } from '../../../api/groups.js';
import Group from './Group.jsx';
import ReferredGroups from './ReferredGroups.jsx';


class ShowClientGroups extends Component {
  constructor(props) {
    super(props);
  }

  renderClientGroups() {
    var groups = this.props.groupsData; 
    groups = groups ? groups : [];

    return groups.map((group) => (
      <Group key={group._id} group={group} 
        user={this.props.user} owner={false} />
    ));
  }

  renderOwnerGroups() {
    return this.props.ownerGroups.map((group) => (
      <Group key={group._id} group={group} 
        user={this.props.user} owner={true} />
    )); 
  }

  render() {
    console.log('123123', this.props);
    return (
      <div className="thumbnail">
        <p> Owner Groups </p>
        <ul>
          {this.renderOwnerGroups()}
        </ul>
        <p> Local Groups </p>
        <ul>
          {this.renderClientGroups()}
        </ul>
        <p> Groups which invited you </p>
        <ReferredGroups />
      </div>
    );
  }
}

ShowClientGroups.propTypes = {
  groups: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default createContainer(() => {
  Tracker.autorun(() => {
    Meteor.subscribe('groups');
    Meteor.subscribe('users');
  });
  var groupsData = null;
  if(Meteor.user()){
    if(Meteor.user().groups && Meteor.user().groups != []){
        groupsData = Groups.find({ $or : Meteor.user().groups }).fetch();
    }
  }

  return {
    user: Meteor.users.findOne({ _id: Meteor.userId() }) || { groups: [] },
    ownerGroups: Groups.find({ owner: Meteor.userId() }).fetch(),
    groups: Groups.find({ owner: { $ne: Meteor.userId() } }).fetch(),
    groupsData: groupsData,
  };
}, ShowClientGroups);