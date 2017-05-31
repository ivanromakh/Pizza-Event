import { Groups } from './groups';
import { check } from 'meteor/check';

import { Images} from '../images/images';

Meteor.methods({
  'groups.create'(name, url) {
    check(name, String);
    var userId = Meteor.userId();
    var user = Meteor.user();

    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }
    var username = (user.profile) ? user.profile.name : user.username;

    var id = Groups.insert({
        name,
        owner: userId,
        username: Meteor.user().username,
        users: [{_id: userId, username: username}],
    });

    var groupLogo = new FS.File();
    groupLogo.groupId = id;

    groupLogo.attachData(url, function (error) {
      if (error) throw new Meteor.Error('not-save-group-logo');
      groupLogo.name("newImage.png");
      Images.insert(groupLogo);
    });
  },
  'groups.inviteUser' (groupId, userId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Groups.update({
        _id: groupId
      }, {
        $addToSet: {invitations: {_id: userId}}
      }
    );
  },

  'groups.acceptUser' (groupId, user) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    var username = user.profile ? user.profile.name : user.username;

    Groups.update({ 
        _id: groupId, "invitations._id": {$exists: true}
      }, { 
        $pull: {invitations: {_id: user._id}}
      }, false, true
    );

    Groups.update({
        _id: groupId
      }, {
        $addToSet: {users: {_id: user._id, username: username}}
      }
    );
  },

  'groups.addMenuItem'(groupId, name, price) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Groups.update({
        _id: groupId
      }, {$addToSet: {menuItems: {name: name, price: price, coupons: 0}}});
  },

  'groups.removeMenuItem'(groupId, itemName) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Groups.update({ 
        _id: groupId, "menuItems.name": {$exists: true}
      }, { 
        $pull: {menuItems: {name: itemName}}
      }, false, true);
  },

  'groups.setCoupons'(groupId, itemName, coupons) {
    var userId = Meteor.userId();
    if (! userId) {
      throw new Meteor.Error('not-authorized');
    }

    var group = Groups.findOne({_id: groupId});

    if(group.owner != userId){
      throw new Meteor.Error('only-group-owner-can-change-coupons');
    }

    Groups.update({_id: groupId, "menuItems.name": itemName}, 
      {$set: {"menuItems.$.coupons": coupons}}
    );
  }
});