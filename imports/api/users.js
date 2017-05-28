if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function groupsPublication() {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, 
      username: 1, invitations: 1, groups: 1, activeGroup: 1}});
  });
}

Meteor.methods({
  'user.inviteGroup'(userId, groupId) {

    // Make sure the user is logged in before inviting
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({_id: userId}, {$addToSet: {invitations: {_id: groupId}}});
  },

  'user.acceptedGroup'(groupId) {
    var userId = Meteor.userId();

    if (! userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({_id: userId}, {$pull: {"invitations": {_id: groupId}}});
    Meteor.users.update({_id: userId}, {$addToSet: {groups: {_id: groupId}}});
  },

  'user.setActiveGroup' (groupId){
    var userId = Meteor.userId();

    if (! userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    Meteor.users.update({_id: userId}, {$set: {activeGroup: groupId}});
  }
});