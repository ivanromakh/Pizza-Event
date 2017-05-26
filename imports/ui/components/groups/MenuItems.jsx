import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';

import { Groups } from '../../../api/groups.js';


class MenuItems extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="thumbnail">
       <p> Menu List </p>
      </div>
    );
  }
}

MenuItems.propTypes = {
  groups: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('groups');

  return {
    groups: Groups.find().fetch(),
  }
}, MenuItems);