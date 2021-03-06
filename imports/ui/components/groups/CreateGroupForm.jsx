import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';


/* global FileReader */

export default class CreateGroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = { showForm: false, groupName: '', file: '', imagePreviewUrl: '' };

    this.handleChange = this.handleChange.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  handleChange(event) {
    this.setState({ groupName: event.target.value });
  }

  toggleForm() {
    this.setState({ showForm: !this.state.showForm });
  }

  createGroup(event) {
    event.preventDefault();
    const name = this.state.groupName;

    if (Meteor.userId()) {
      Meteor.call('groups.create', name, this.state.imagePreviewUrl);
      this.toggleForm();
    }
    this.setState({ groupName: '' });
  }

  handleImageChange(event) {
    event.preventDefault();

    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  renderCreateGroupForm() {
    const imagePreviewUrl = this.state.imagePreviewUrl;
    let $imagePreview = null;

    if (imagePreviewUrl) {
      $imagePreview = (
        <img className="preview-group-logo" alt="preview" src={imagePreviewUrl} />
      );
    } else {
      $imagePreview = (
        <img className="preview-group-logo" alt="preview" src="/profile-group.png" />
      );
    }

    return (
      <div className="clearfix create-group-form">
        <form className="form-horizontal" onSubmit={this.createGroup}>
          <h4> Create group </h4>
          <div className="form-group">
            <label className="control-label col-sm-3" htmlFor="email">Name:</label>
            <div className="col-sm-7">
              <input
                className="form-control"
                type="text"
                value={this.state.groupName}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-3" htmlFor="email">Group logo:</label>
            <div className="col-sm-7">
              { $imagePreview }
              <input
                className="form-control"
                type="file"
                onChange={this.handleImageChange}
              />
            </div>
          </div>
          <button className="btn btn-primary btn-xs pull-right" onClick={this.toggleForm}>
            Cancel
          </button>
          <button className="btn btn-primary btn-xs pull-right" type="submit">
            Create
          </button>
        </form>
      </div>
    );
  }

  render() {
    if (Meteor.userId()) {
      return (
        <ul>
          <li>
            <a onClick={this.toggleForm}> Create group <span className="arrow"></span></a>
          </li>
          <li>
            {this.state.showForm ? this.renderCreateGroupForm() : null}
          </li>
        </ul>
      );
    }
    return <p> Pleasure sign in if you want to see groups </p>;
  }
}
