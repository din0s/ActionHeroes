import "./Authentication.scss";

import React, { Component } from "react";
import { clearErrors, signup } from "../../actions/auth";

import Input from "../../components/input/Input";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

const mapState = (state) => ({
  error: state.auth.error,
});

const mapDispatch = {
  signup,
  clearErrors,
};

export default connect(
  mapState,
  mapDispatch
)(
  withTranslation()(
    class Signup extends Component {
      state = {
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
        mismatch: false,
        usernameHighlight: false,
        emailHighlight: false,
        passwordHighlight: false,
        passwordConfirmHighlight: false,
      };

      componentDidMount() {
        this.props.clearErrors();
      }

      clearHighlights = async () => {
        this.setState({
          usernameHighlight: false,
          emailHighlight: false,
          passwordHighlight: false,
          passwordConfirmHighlight: false,
        });
      };

      checkPassword = async (pass, confirm) => {
        this.setState({ mismatch: pass !== confirm });
      };

      setPassword = async (e) => {
        const password = e.target.value.trim();
        const { passwordConfirm } = this.state;
        this.setState({ password });
        if (passwordConfirm !== "") {
          this.checkPassword(password, passwordConfirm);
        }
      };

      setPasswordConfirm = async (e) => {
        const { password } = this.state;
        const passwordConfirm = e.target.value.trim();
        this.setState({ passwordConfirm });
        this.checkPassword(password, passwordConfirm);
      };

      submit = async (event) => {
        event.preventDefault();
        this.props.clearErrors();
        const { username, email, password, passwordConfirm } = this.state;
        if (
          username !== "" &&
          email !== "" &&
          password !== "" &&
          passwordConfirm !== "" &&
          !this.state.mismatch
        ) {
          this.clearHighlights();
          this.props.signup(username, email, password);
        } else {
          this.setState({
            usernameHighlight: username === "",
            emailHighlight: email === "",
            passwordHighlight: password === "",
            passwordConfirmHighlight: passwordConfirm === "",
          });
        }
      };

      render() {
        const { t } = this.props;
        return (
          <div className="Auth-page">
            <form
              method="post"
              action="/auth/signup"
              className="Auth-panel"
              onSubmit={this.submit}
            >
              <div className="Auth-header">
                <h2 children={t("auth.signup.greeting")} />
                <p className="Auth-error" children={this.props.error} />
              </div>
              <Input
                autoComplete="username"
                type="text"
                name="username"
                placeholder={t("auth.username")}
                class="Username-field"
                shouldHighlight={this.state.usernameHighlight}
                onChange={(e) =>
                  this.setState({ username: e.target.value.trim() })
                }
              />
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
                autoComplete="new-password"
                type="password"
                name="password"
                placeholder={t("auth.password")}
                class="Password-field"
                shouldHighlight={this.state.passwordHighlight}
                onChange={this.setPassword}
              />
              <Input
                autoComplete="new-password"
                type="password"
                name="confirm_password"
                placeholder={t("auth.confirm_password")}
                class="Password-field"
                shouldHighlight={this.state.passwordHighlight}
                onChange={this.setPasswordConfirm}
              />
              <p
                className={`Password-mismatch${
                  this.state.mismatch ? "" : " hidden"
                }`}
                children={t("auth.signup.mismatch")}
              />
              <input
                type="submit"
                className="Submit-button"
                value={t("auth.signup.action")}
              />
              <span className="Alt-option">
                <p children={t("auth.signup.alt-call")} />
                <Link to="/login" children={t("auth.login.action")} />
              </span>
            </form>
          </div>
        );
      }
    }
  )
);
