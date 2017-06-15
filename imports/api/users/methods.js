import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  'user.inviteGroup'(userId, groupId) {
    check(userId, String);
    check(groupId, String);

    // Make sure the user is logged in before inviting
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({ _id: userId }, { $addToSet: { invitations: { _id: groupId } } });
  },

  'user.acceptedGroup'(groupId) {
    check(groupId, String);

    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({ _id: userId }, { $pull: { invitations: { _id: groupId } } });
    Meteor.users.update({ _id: userId }, { $addToSet: { groups: { _id: groupId } } });
  },

  'user.setActiveGroup'(groupId) {
    check(groupId, String);

    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({ _id: userId }, { $set: { activeGroup: groupId } });
  },

  'user.setActiveEvent'(eventId) {
    check(eventId, String);

    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    Meteor.users.update({ _id: userId }, { $set: { activeEvent: eventId } });
  },
});
