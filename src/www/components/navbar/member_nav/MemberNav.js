import "./MemberNav.scss";

import React, { Component } from "react";

import { NavLink } from "react-router-dom";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { logout } from "../../../actions/auth";
import { withTranslation } from "react-i18next";

const mapDispatch = { logout };

export default connect(
  undefined,
  mapDispatch
)(
  withTranslation()(
    class MemberNav extends Component {
      state = {
        hiddenOptions: true,
      };

      toggleOptions = async () => {
        this.setState({
          hiddenOptions: !this.state.hiddenOptions,
        });
      };

      hideOptions = async () => {
        if (!this.state.hiddenOptions) {
          this.setState({ hiddenOptions: true });
        }
      };

      componentDidMount() {
        document.addEventListener("click", this.onClickOut, true);
      }

      componentWillUnmount() {
        document.removeEventListener("click", this.onClickOut, true);
      }

      // https://stackoverflow.com/a/45323523/7412859
      onClickOut = (event) => {
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode || !domNode.contains(event.target)) {
          this.hideOptions();
        }
      };

      render() {
        const { t, user } = this.props;

        return (
          <div className="User-info">
            <p className="User-greet" onClick={this.toggleOptions}>
              {`${t("nav.user.greet")}, ${user.username}`}
              <img className="Arrow" src="/img/icons/arrow.svg" alt="Arrow" />
            </p>

            <ul
              className={`User-options${
                this.state.hiddenOptions ? " Options-hidden" : ""
              }`}
              onClick={this.hideOptions}
            >
              <li className="Page-link">
                <NavLink to="/profile" children={t("nav.user.profile")} />
              </li>
              <li className="Page-link">
                <NavLink to="/user/preferences" children={t("nav.user.pref")} />
              </li>
              <li className="Page-link">
                <p children={t("nav.user.exit")} onClick={this.props.logout} />
              </li>
            </ul>
          </div>
        );
      }
    }
  )
);
