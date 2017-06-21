import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Group from './Group.jsx';


class ReferredGroups extends Component {
  renderGroups() {
    const groups = this.props.referredGroups;
    if (groups) {
      return groups.map((group) => (
        <Group
          key={group._id}
          group={group}
          user={this.props.user}
          owner={false}
          referedGroup
        />
      ));
    }
    return null;
  }

  render() {
    return (
      <div>
        { this.renderGroups() }
      </div>
    );
  }
}

ReferredGroups.propTypes = {
  user: PropTypes.object.isRequired,
  referredGroups: PropTypes.array.isRequired,
};

export default ReferredGroups;
