import "./Authentication.scss";

import React, { Component } from "react";
import { clearErrors, login } from "../../actions/auth";

import Input from "../../components/input/Input";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

const mapState = (state) => ({
  error: state.auth.error,
});

const mapDispatch = {
  login,
  clearErrors,
};

export default connect(
  mapState,
  mapDispatch
)(
  withTranslation()(
    class Login extends Component {
      state = {
        email: "",
        password: "",
        emailHighlight: false,
        passwordHighlight: false,
      };

      componentDidMount() {
        this.props.clearErrors();
      }

      clearHighlights = async () => {
        this.setState({ emailHighlight: false, passwordHighlight: false });
      };

      submit = async (event) => {
        event.preventDefault();
        this.props.clearErrors();
        const { email, password } = this.state;
        if (email !== "" && password !== "") {
          this.clearHighlights();
          this.props.login(email, password);
        } else {
          this.setState({
            emailHighlight: email === "",
            passwordHighlight: password === "",
          });
        }
      };

      render() {
        const { t } = this.props;
        return (
          <div className="Auth-page">
            <form
              method="post"
              action="/auth/login"
              className="Auth-panel"
              onSubmit={this.submit}
            >
              <div className="Auth-header">
                <h2 children={t("auth.login.greeting")} />
                <p className="Auth-error" children={this.props.error} />
              </div>
              <Input
                autoComplete="email"
                type="email"
                name="email"
                placeholder={t("auth.email")}
                class="Email-field"
                shouldHighlight={this.state.emailHighlight}
                onChange={(e) =>
                  this.setState({ email: e.target.value.trim() })
                }
              />
              <Input
                autoComplete="current-password"
                type="password"
                name="password"
                placeholder={t("auth.password")}
                class="Password-field"
                shouldHighlight={this.state.passwordHighlight}
                onChange={(e) =>
                  this.setState({ password: e.target.value.trim() })
                }
              />
              <input
                type="submit"
                className="Submit-button"
                value={t("auth.login.action")}
              />
              <span className="Alt-option">
                <p children={t("auth.login.alt-call")} />
                <Link to="/signup" children={t("auth.signup.action")} />
              </span>
            </form>
          </div>
        );
      }
    }
  )
);
