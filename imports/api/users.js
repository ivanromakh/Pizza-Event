if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('users', function groupsPublication() {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, username: 1, invitations: 3}});
  });
}

Meteor.methods({
  'user.inviteGroup'(userId, groupId) {

    // Make sure the user is logged in before inviting
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({_id: userId}, {$addToSet: {invitations: {_id:groupId}}});
  },
});