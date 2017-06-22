import React from 'react';

import { Meteor } from 'meteor/meteor';
import { handleResult } from '../../utils/client-utils';

class SignInPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleEmailChange(event) {
   this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();

    const email = this.state.email;
    const password = this.state.password;
    const redirectUrl = '/';
    
    const userData = Meteor.loginWithPassword({ email }, password, handleResult());

    console.log(userData);


  }

  render() {
    return (
      <div className="container">
        <div className="card card-container">
          <h1 className="text-center">Sign In</h1>
          <form className="form-signin" onSubmit={this.onSubmit}>
            <input 
              type="email"
              className="form-control"
              placeholder="Email address"
              value={this.state.email}
              onChange={this.handleEmailChange}
              required />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              required 
            />
            <div id="remember" className="checkbox">
            <label>
              <input type="checkbox" value="remember-me" />
            </label>
            </div>
            <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Sign in</button>
          </form>
        </div>
      </div>
    );
  }
}

export default SignInPage;