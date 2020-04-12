import "./ContactPage.scss"

import React, { Component } from "react";

import Input from "../../components/input/Input";
import axios from "axios";
import { push } from "connected-react-router";
import { withTranslation } from "react-i18next";

const top_img = '/img/top_img.png'; //Photo by Patrick Perkins on Unsplash
const form_img = '/img/form_img.png'; //Photo by LinkedIn Sales Navigator on Unsplash

const clearErrors = () => ({ type: "CLEAR" });

const handleResponse = (data) => {
  if (data.error) {
    console.log(data.error);
  } else {
    push("/");
  }
};

const contact = (firstName, lastName,  email, message) => {
  axios.post("/contact/submit", {
      firstName, lastName,
      email, message
    })
    .then(res => handleResponse(res.data))
    .catch(err => handleResponse(err.response.data));
};

export default ( withTranslation()(
class ContactPage extends Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
      firstΝameHighlight: false,
      lastNameHighlight: false,
      emailHighlight: false
    }
  }

  onChangemessage = (e) => {
    this.setState({ message: e.target.value.trim() })
  }

  clearHighlights = async () => {
    this.setState({ firstNameHighlight: false,
      lastNameHighlight: false,
      emailHighlight: false,});
  };

  componentDidMount() {
    clearErrors();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    clearErrors();

    const { firstName, lastName, email, message } = this.state;

    if (firstName !== "" && lastName !== "" && email !== "" && message !== "") {
      this.clearHighlights();
      contact(firstName, lastName, email, message);
    } else {
      this.setState({
        firstΝameHighlight: firstName === "",
        lastNameHighlight: lastName === "",
        emailHighlight: email === "",
      });
    }

  }

    render() {
      const { t } = this.props;
      return (
        <div className="container">    
            <img className="top-img" alt="top_img" src={top_img}/>
            <span className="contact-form-title1">{t("contactpage.title1")}</span>
            <span className="contact-form-title2">{t("contactpage.title2")}</span>
            <div className="contact-form-block">
                <img className="form-image" alt="form_img" src={form_img}/>
                <form onSubmit={this.handleSubmit} >
                   <Input
                      name="firstname" 
                      onChange={e => this.setState({ firstName: e.target.value.trim() })}
                      shouldHighlight={this.state.firstNameHighlight}
                      type='text'
                      placeholder={t("contactpage.firstname")} 
                  />
                  <Input
                      name="lastname" 
                      onChange={e => this.setState({ lastName: e.target.value.trim() })}
                      shouldHighlight={this.state.lastNameHighlight}
                      type='text'
                      placeholder={t("contactpage.lastname")} 
                  />
                  <Input
                      name="email" 
                      onChange={e => this.setState({ email: e.target.value.trim() })}
                      shouldHighlight={this.state.emailHighlight}
                      type='email'
                      placeholder={t("contactpage.email")}
                  />
                  <textarea
                      name="message"
                      onChange={this.onChangemessage}
                      required
                      type='text'
                      placeholder={t("contactpage.message")}
                  />
                  <input
                      className="submit-btn"
                      type="submit"
                      value={t("contactpage.submit")}
                  />
                </form>
            </div>
        </div>
        );
    }
}));