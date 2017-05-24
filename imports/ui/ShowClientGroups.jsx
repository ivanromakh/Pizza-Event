import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Groups } from '../api/groups.js'
import Group from './Group.jsx';

class ShowClientGroups extends Component {
  renderGroup(){ 
    return this.props.groups.map((group) => (
      <Group key={group._id} group={group} />
    )); 
  }

  render() {
    return (
      <div className="thumbnail">
        <p> Local Groups </p>
        <ul>
          {this.renderGroup()}
        </ul>
      </div>
    );
  }
}

ShowClientGroups.propTypes = {
  groups: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    groups: Groups.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, ShowClientGroups);