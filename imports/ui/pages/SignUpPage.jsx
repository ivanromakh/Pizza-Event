import React from 'react';

import { Meteor } from 'meteor/meteor';


class SignUpPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      repPassword: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleRepPassChange = this.handleRepPassChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleEmailChange(event) {
   this.setState({email: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleRepPassChange(event) {
  	this.setState({repPassword: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();

    const email = this.state.email;
    const password = this.state.password;

    Accounts.createUser({ email, password });
    console.log(email, password, this.state.repPassword);
  }

  render() {
  	return (
      <div className="container">
       <div className="row">
         <div className="col-md-4 col-md-offset-4 well well-sm">
           <legend><a><i className="glyphicon glyphicon-globe"></i></a> Sign up!</legend>
            <form className="form" onSubmit={this.onSubmit}>
              <input 
                className="form-control"
                placeholder="Your Email" 
                type="email" 
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
              <input
                className="form-control"
                placeholder="Password" 
                type="password" 
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <br />
              <br />
              <button className="btn btn-lg btn-primary btn-block" type="submit"> Sign up</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUpPage;
