import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


export default class CreateGroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {showForm: false, groupName: '', file: '', imagePreviewUrl: ''};

    this.handleChange = this.handleChange.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  handleChange(event) {
    this.setState({groupName: event.target.value});
  }

  toggleForm() {
    this.setState({showForm: !this.state.showForm});
    console.log(this.state.showForm);
  }

  createGroup(event) {
    event.preventDefault();
    var name = this.state.groupName;
    if (Meteor.userId()) {
      Meteor.call('groups.create', name);
    }
    this.setState({groupName: ''});
    this.toggleForm();
  }

  handleImageChange(event) {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];
    
    console.log(file, reader.result);
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file);
  }

  render() {
    if(Meteor.userId()){
      if(this.state.showForm){
        let imagePreviewUrl = this.state.imagePreviewUrl;
        let $imagePreview = null;
 
        if (imagePreviewUrl) {
          $imagePreview = (<img className="preview-group-logo" src={imagePreviewUrl} />);
        } else {
          $imagePreview = (<div className="preview-group-logo">Please select an Image for Preview</div>);
        }
 
        return (
          <div className="create-group-form">
            <form onSubmit={this.createGroup}>
              <h4> Create group </h4>
              <input type="file" onChange={this.handleImageChange} />
              {$imagePreview}
              <label>
                Name:
                <input type="text" value={this.state.groupName} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Create" />
            </form>
            <button className="btn btn-primary btn-xs" onClick={this.toggleForm} value> Save group </button>;
          </div>
        );
      } else {
        return (
          <div className="create-group-form"> 
            <button className="btn btn-primary btn-xs" onClick={this.toggleForm} value> Show creation group </button>
          </div>
        );
      }
    } else {
      return <p> Pleasure sign in if you want to see groups </p>;
    }
  }
}