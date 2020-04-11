import "./ContactPage.scss"

import React, { Component } from "react";
import { clearErrors, contact } from "../../actions/contact";

import Input from "../../components/input/Input";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

const top_img = '/img/top_img.png'; //Photo by Patrick Perkins on Unsplash
const form_img = '/img/form_img.png'; //Photo by LinkedIn Sales Navigator on Unsplash

const mapState = state => ({
  undefined
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
      first_name: '',
      last_name: '',
      email: '',
      question: '',
      first_nameHighlight: false,
      last_nameHighlight: false,
      emailHighlight: false
    }
  }

  onChangeQuestion = (e) => {
    this.setState({ question: e.target.value.trim() })
  }

  clearHighlights = async () => {
    this.setState({ first_nameHighlight: false,
      last_nameHighlight: false,
      emailHighlight: false,});
  };

  componentDidMount() {
    this.props.clearErrors();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.clearErrors();
    const data = new FormData(event.target);

    const { first_name, last_name, email, question } = this.state;

    if (first_name !== "" && last_name !== "" && email !== "" && question !== "") {
      this.clearHighlights();
      this.props.contact(first_name, last_name, email, question);
      console.log(stringifyFormData(data));
    } else {
      console.log("ELSE")
      this.setState({
        first_nameHighlight: first_name === "",
        last_nameHighlight: last_name === "",
        emailHighlight: email === "",
      });
    }

    if(!alert('Thank you!')){window.location.reload();}
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
                      name="first_name" 
                      onChange={e => this.setState({ first_name: e.target.value.trim() })}
                      shouldHighlight={this.state.first_nameHighlight}
                      type='text'
                      placeholder={t("contactpage.first_name")} 
                  />
                  <Input
                      name="last_name" 
                      onChange={e => this.setState({ last_name: e.target.value.trim() })}
                      shouldHighlight={this.state.last_nameHighlight}
                      type='text'
                      placeholder={t("contactpage.last_name")} 
                  />
                  <Input
                      name="email" 
                      onChange={e => this.setState({ email: e.target.value.trim() })}
                      shouldHighlight={this.state.emailHighlight}
                      type='email'
                      placeholder={t("contactpage.email")}
                  />
                  <textarea
                      name="question"
                      onChange={this.onChangeQuestion}
                      required
                      type='text'
                      placeholder={t("contactpage.question")}
                  />
                  <input
                      className="submit-btn"
                      type="submit"
                      placeholder={t("contactpage.submit")}
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