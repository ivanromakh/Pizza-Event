import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { Groups } from '../../../api/groups.js';
import Group from './Group.jsx';


class ClientGroups extends Component {
  constructor(props) {
    super(props);
  }

  renderGroups(group) {
    return this.props.groupsData.map((group) => (
      <Group key={group._id} group={group} user={this.props.user} owner={false}/>
    ));
  }

  render() {
    var groups = this.props.groupsData;
    if(groups) {
      return <div>{this.renderGroups()}</div>;
    } else {
      return null;
    }
  }
}

export default createContainer(() => {
  Meteor.subscribe('groups');

  var userGroups = [];
  if(Meteor.user()){
    if(Meteor.user().groups && Meteor.user().groups != []){
      return {
        groupsData: Groups.find({ $or : Meteor.user().groups }).fetch(),  
      };
    }
  }
  
  return {};
  
}, ClientGroups);