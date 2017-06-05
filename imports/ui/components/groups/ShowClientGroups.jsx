import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';

import {Images} from '../../../api/images/images';
import { Groups } from '../../../api/groups/groups';
import Group from './Group';
import ReferredGroups from './ReferredGroups';


class ShowClientGroups extends Component {
  renderClientGroups() {
    var groups = this.props.groupsData;

    return groups.map((group) => (
      <Group 
        key={ group._id } 
        group={ group } 
        user={ this.props.user } 
        owner={ false } 
      />
    ));
  }

  renderOwnerGroups() {
    return this.props.ownerGroups.map((group) => (
      <Group 
        key={ group._id } 
        group={ group } 
        user={ this.props.user } 
        owner={ true } 
      />
    )); 
  }

  render() {
    return (
      <div className="thumbnail">
        <p> Owner Groups </p>
        <ul>
          { this.renderOwnerGroups() }
        </ul>
        <p> Local Groups </p>
        <ul>
          { this.renderClientGroups() }
        </ul>
        <p> Groups which invited you </p>
        <ReferredGroups />
      </div>
    );
  }
}

ShowClientGroups.propTypes = {
  groupsData: PropTypes.array.isRequired,
  ownerGroups: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default createContainer(() => {
  Tracker.autorun(() => {
    Meteor.subscribe('groups');
    Meteor.subscribe('users');
    Meteor.subscribe('images');
  });

  var groupsData = [];
  var ownerGroups = Groups.find({ owner: Meteor.userId() }).fetch();

  if(!ownerGroups){
    ownerGroups = [];
  }

  if(Meteor.user()){
    if(Meteor.user().groups && Meteor.user().groups != []){
      groupsData = Groups.find({ $or : Meteor.user().groups }).fetch();
    }
  }

  groupsData.map(function(group) {
    var image = Images.findOne({ groupId: group._id });
    if(image) {
      group.logo = image.url();
    }
  }, {Images: Images});
  
  ownerGroups.map(function(group) {
    var image = Images.findOne({ groupId: group._id });
    console.log('image', image);
    if(image){
      group.logo = image.url();
    }
  }, {Images: Images});

  return {
    user: Meteor.users.findOne({ _id: Meteor.userId() }) || { groups: [] },
    ownerGroups: ownerGroups,
    groupsData: groupsData,
  };
}, ShowClientGroups);