import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { FS } from 'meteor/cfs:base-package';

import { Groups } from './groups';
import { Images } from '../images/images';

import { getUserName } from '../../utils/client-utils';


Meteor.methods({
  'groups.create'(name, url) {
    check(name, String);
    check(url, String);

    const userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    const user = Meteor.user();
    const username = getUserName(user);

    const groupId = Groups.insert({
      name,
      owner: userId,
      users: [{ _id: userId, username }],
    });

    Meteor.users.update({ _id: userId }, {
      $addToSet: { groups: { _id: groupId } },
    });

    const groupLogo = new FS.File();
    groupLogo.groupId = groupId;
    if (url) {
      groupLogo.attachData(url, (error) => {
        if (error) throw new Meteor.Error('not-save-group-logo');
        groupLogo.name('groupLogo');
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
      $addToSet: { users: { _id: user._id, username } },
    }, false, true);
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
