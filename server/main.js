import { Meteor } from 'meteor/meteor';
import '../imports/api/events/events';
import '../imports/api/events/publications';
import '../imports/api/events/methods';
import '../imports/api/groups/groups';
import '../imports/api/groups/publications';
import '../imports/api/groups/methods';
import '../imports/api/users/users';
import '../imports/api/users/publications';
import '../imports/api/users/methods';


Meteor.startup(() => {
  // code to run on server at startup
});
