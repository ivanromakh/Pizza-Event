import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { FS } from 'meteor/cfs:base-package';

import { Groups } from './groups';
import { Images } from '../images/images';


Meteor.methods({
  'groups.create'(name, url) {
    check(name, String);
    check(url, String);

    const userId = Meteor.userId();
    const user = Meteor.user();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }
    const username = (user.profile) ? user.profile.name : user.username;

    const id = Groups.insert({
      name,
      owner: userId,
      username: Meteor.user().username,
      users: [{ _id: userId, username }],
    });

    const groupLogo = new FS.File();
    groupLogo.groupId = id;
    if (url) {
      groupLogo.attachData(url, function insertLogo(error) {
        if (error) throw new Meteor.Error('not-save-group-logo');
        groupLogo.name('newImage.png');
        Images.insert(groupLogo);
      });
    }
  },
  'groups.inviteUser'(groupId, userId) {
    check(groupId, String);
    check(userId, String);
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Groups.update({
      _id: groupId,
    }, {
      $addToSet: { invitations: { _id: userId } },
    });
  },

  'groups.acceptUser'(groupId, user) {
    check(groupId, String);
    check(user, Object);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const username = user.profile ? user.profile.name : user.username;

    Groups.update({
      _id: groupId, 'invitations._id': { $exists: true },
    }, {
      $pull: { invitations: { _id: user._id } },
    }, false, true);

    Groups.update({
      _id: groupId,
    }, {
      $addToSet: { users: { _id: user._id, username } },
    });
  },

  'groups.addMenuItem'(groupId, name, price) {
    check(groupId, String);
    check(name, String);
    check(price, Number);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Groups.update({
      _id: groupId,
    }, {
      $addToSet: { menuItems: { name, price, coupons: 0 } },
    });
  },

  'groups.removeMenuItem'(groupId, itemName) {
    check(groupId, String);
    check(itemName, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Groups.update({
      _id: groupId, 'menuItems.name': { $exists: true },
    }, {
      $pull: { menuItems: { name: itemName } },
    }, false, true);
  },

  'groups.setCoupons'(groupId, itemName, coupons) {
    check(groupId, String);
    check(itemName, String);
    check(coupons, String);

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    const group = Groups.findOne({ _id: groupId });

    if (group.owner !== userId) {
      throw new Meteor.Error('only-group-owner-can-change-coupons');
    }

    Groups.update({ _id: groupId, 'menuItems.name': itemName },
      { $set: { 'menuItems.$.coupons': coupons } },
    );
  },
});
