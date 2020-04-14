import "./ContactPage.scss";

import React, { Component } from "react";

import Input from "../../components/input/Input";
import axios from "axios";
import { withAlert } from "react-alert";
import { withTranslation } from "react-i18next";

const form_img = "/img/form_img.png"; //Photo by LinkedIn Sales Navigator on Unsplash

export default withAlert()(
  withTranslation()(
    class ContactPage extends Component {
      state = {
        firstName: "",
        lastName: "",
        email: "",
        message: "",
        serverMessage: "",
        check_success: false,
        firstΝameHighlight: false,
        lastNameHighlight: false,
        emailHighlight: false
      };

      clearHighlights = async () => {
        this.setState({
          firstNameHighlight: false,
          lastNameHighlight: false,
          emailHighlight: false
        });
      };

      handleResponse = (data, target) => {
        const { t, alert } = this.props;
        if (data.error) {
          alert.error(data.error);
        } else {
          alert.success(t("contactpage.thanks"));
          target.reset();
        }
      };

      contact = (firstName, lastName, email, message, target) => {
        axios
          .post("/contact/submit", {
            firstName,
            lastName,
            email,
            message
          })
          .then(res => this.handleResponse(res.data, target))
          .catch(err => this.handleResponse(err.response.data, target));
      };

      handleSubmit = event => {
        event.preventDefault();

        const { firstName, lastName, email, message } = this.state;

        if (
          firstName !== "" &&
          lastName !== "" &&
          email !== "" &&
          message !== ""
        ) {
          this.clearHighlights();
          this.contact(firstName, lastName, email, message, event.target);
        } else {
          this.setState({
            firstΝameHighlight: firstName === "",
            lastNameHighlight: lastName === "",
            emailHighlight: email === ""
          });
        }
      };

      render() {
        const { t } = this.props;
        return (
          <div className="container">
            <span className="contact-form-title1">
              {t("contactpage.title1")}
            </span>
            <span className="contact-form-title2">
              {t("contactpage.title2")}
            </span>
            <div className="contact-form-block">
              <img className="form-image" alt="form_img" src={form_img} />
              <form onSubmit={this.handleSubmit}>
                <Input
                  name="firstname"
                  onChange={e =>
                    this.setState({ firstName: e.target.value.trim() })
                  }
                  shouldHighlight={this.state.firstΝameHighlight}
                  type="text"
                  placeholder={t("contactpage.firstname")}
                />
                <Input
                  name="lastname"
                  onChange={e =>
                    this.setState({ lastName: e.target.value.trim() })
                  }
                  shouldHighlight={this.state.lastNameHighlight}
                  type="text"
                  placeholder={t("contactpage.lastname")}
                />
                <Input
                  name="email"
                  onChange={e =>
                    this.setState({ email: e.target.value.trim() })
                  }
                  shouldHighlight={this.state.emailHighlight}
                  type="email"
                  placeholder={t("contactpage.email")}
                />
                <textarea
                  name="message"
                  onChange={e =>
                    this.setState({ message: e.target.value.trim() })
                  }
                  required
                  type="text"
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
    }
  )
);
