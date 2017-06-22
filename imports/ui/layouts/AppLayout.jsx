import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import MainMenu from '../components/MainMenu.jsx';

class AppLayout extends Component {
  componentWillUnmount() {
    this.props.handleUsers.stop();
  }

  render() {
    return (
      <div>
        <MainMenu user={this.props.user} />
        {this.props.children}
      </div>
    );
  }
}

AppLayout.propTypes = {
  handleUsers: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default createContainer(() => {
  const handleUsers = Meteor.subscribe('users');

  return {
    handleUsers: { handleUsers },
    user: Meteor.user() || {},
  };
}, AppLayout);
