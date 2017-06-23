import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';

import MainMenu from '../components/MainMenu.jsx';

class AppLayout extends Component {
  componentWillUnmount() {
    this.props.handleUsers.stop();
  }

  render() {
    return (
      <div>
        <Alert stack={{limit: 3}} />
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
