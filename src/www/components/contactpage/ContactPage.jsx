import "./ContactPage.scss"

import React, { Component } from "react";
import { clearErrors, contact } from "../../actions/contact";

import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

//import axios from "axios";



const top_img = '/img/keyboard.png';
const form_img = '/img/inner.png'

const mapState = state => ({
  error: state.auth.error
});

const mapDispatch = {
  contact,
  clearErrors
};

export default connect(
  mapState,
  mapDispatch
)( withTranslation()(
class ContactPage extends Component {
  constructor() {
    super();
    this.state = {
      fisrt_name: '',
      last_name: '',
      email: '',
      question: ''
  }
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeQuestion = this.onChangeQuestion.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChangeFirstName(e) {
    this.setState({ first_name: e.target.value })
  }

  onChangeLastName(e) {
    this.setState({ last_name: e.target.value })
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value })
  }

  onChangeQuestion(e) {
    this.setState({ question: e.target.value })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.clearErrors();
    const data = new FormData(event.target);
    //console.log(stringifyFormData(data))

    this.props.contact(data.get('first_name'), data.get('last_name'), data.get('email'), data.get('question'));
    this.setState({ first_name: '', last_name: '', email: '', question: '' })
  }

    render() {
      const { t } = this.props;
      return (
        <div className="container">    
            <img className="top-img" alt="img1" src={top_img}/>
            <span className="contact-form-title1">{t("contactpage.title1")}</span>
            <span className="contact-form-title2">{t("contactpage.title2")}</span>
            <div className="contact-form-block">
                <img className="form-image" alt="img2" src={form_img}/>
                <form onSubmit={this.handleSubmit} >
                    <input
                        name="first_name" 
                        type='text'
                        value={this.state.first_name}
                        onChange={this.onChangeFirstName}
                        required
                        placeholder={t("contactpage.first_name")} 
                    />
                    <input
                        name="last_name" 
                        type='text'
                        value={this.state.last_name}
                        onChange={this.onChangeLastName}
                        required
                        placeholder={t("contactpage.last_name")} 
                    />
                    <input
                        name="email" 
                        type='email'
                        value={this.state.email}
                        onChange={this.onChangeEmail}
                        required
                        placeholder={t("contactpage.email")}
                    />
                    <textarea 
                        name="question"
                        type='text'
                        value={this.state.question}
                        onChange={this.onChangeQuestion}
                        required
                        placeholder={t("contactpage.question")}
                    />
                    <input
                        type="submit"
                        className="submit-btn"
                        value={t("contactpage.submit")}
                    />
                </form>
            </div>
        </div>
        );
    }
}));

function stringifyFormData(fd) {
  const data = {};
	for (let key of fd.keys()) {
  	data[key] = fd.get(key);
  }
  return JSON.stringify(data, null, 2);
}