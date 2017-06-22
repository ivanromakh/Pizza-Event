import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';


class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    Meteor.logout();
  }

  renderRightNav() {
    if (!Meteor.userId()) {
      return (
        <ul className="nav navbar-nav navbar-right">
          <li><a href="/sign-in">SignIn</a></li>
          <li><a href="/sign-up">SignUp</a></li>
        </ul>
      );
    }
    if (!Meteor.user()) {
      return null;
    }
    return (
      <ul className="nav navbar-nav navbar-right">
        <li><a>{this.props.user.username}</a></li>
        <li><a onClick={this.handleLogout}>Logout</a></li>
      </ul>
    );
  }

  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className="active"><a href="/">Home</a></li>
              <li><a href="/pizza">Pizza</a></li>
            </ul>
            {this.renderRightNav()}
          </div>
        </div>
      </nav>
    );
  }
}

MainMenu.propTypes = {
  user: PropTypes.object.isRequired,
};

export default MainMenu;
