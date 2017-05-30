import { Groups } from './groups';

Meteor.methods({
  'groups.create'(name) {
    check(name, String);

    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Groups.insert({
        name,
        owner: Meteor.userId(),
        username: Meteor.user().username,
        users: [],
    });
  },

  'groups.acceptUser' (groupId, user) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // if user use google 
    if(user.profile) {
      Groups.update({
          _id: groupId
        }, {
          $addToSet: {users: {_id: user._id, username: profile.name}}
        }
      );
    }

    if(user.username) {
      Groups.update({
          _id: groupId
        }, {
          $addToSet: {users: {_id: user._id, username: user.username}}
        }
      );
    }
  },

  'groups.addMenuItem'(groupId, name, price) {
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Groups.update({
        _id: groupId
      }, {$addToSet: {menuItems: {name: name, price: price}}});
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
});