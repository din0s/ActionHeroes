import "./MemberNav.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { withTranslation } from "react-i18next";

export default withTranslation()(
  class MemberNav extends Component {
    state = {
      hiddenOptions: true
    };

    toggleOptions = async () => {
      this.setState({
        hiddenOptions: !this.state.hiddenOptions
      });
    };

    hideOptions = async () => {
      this.setState({ hiddenOptions: true });
    };

    componentDidMount() {
      document.addEventListener("click", this.onClickOut, true);
    }

    componentWillUnmount() {
      document.removeEventListener("click", this.onClickOut, true);
    }

    // https://stackoverflow.com/a/45323523/7412859
    onClickOut = event => {
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
            {`${t("nav.user.greet")}, ${user.email}`}
          </p>

          <ul
            className={`User-options${
              this.state.hiddenOptions ? " Options-hidden" : ""
            }`}
            onClick={this.hideOptions}
          >
            <li className="Page-link">
              <Link to="/user/profile" children={t("nav.user.profile")} />
            </li>
            <li className="Page-link">
              <Link to="/user/preferences" children={t("nav.user.pref")} />
            </li>
            <li className="Page-link">
              <Link to="/logout" children={t("nav.user.exit")} />
            </li>
          </ul>
        </div>
      );
    }
  }
);
