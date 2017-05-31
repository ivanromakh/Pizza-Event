
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

  'user.setActiveGroup' (groupId) {
    var userId = Meteor.userId();

    if (! userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({_id: userId}, {$set: {activeGroup: groupId}});
  },

  'user.setActiveEvent' (eventId) {
    var userId = Meteor.userId();

    if (! userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({_id: userId}, {$set: {activeEvent: eventId}});
  }
});