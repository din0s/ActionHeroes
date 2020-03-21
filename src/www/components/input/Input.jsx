import "./Input.scss";

import React, { Component } from "react";

export default class Input extends Component {
  state = {
    highlight: false,
    acceptHints: true
  };

  componentDidUpdate() {
    if (this.state.acceptHints && this.props.shouldHighlight) {
      this.setState({ highlight: true, acceptHints: false });
    }
  }

  // https://stackoverflow.com/a/41406907
  input = async event => {
    if (event.key === "Enter") {
      event.preventDefault();
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      const next = form.elements[index + 1];
      next.focus();
      if (next.type === "submit") {
        next.click();
      }
    }
  };

  validate = async event => {
    if (event.target.value === "") {
      this.setState({ highlight: true });
    }
  };

  render() {
    return (
      <input
        type={this.props.type}
        name={this.props.name}
        placeholder={this.props.placeholder}
        className={`${this.props.class}${
          this.state.highlight ? " highlight" : ""
        }`}
        onChange={event => {
          this.props.onChange(event);
          this.setState({ highlight: false });
        }}
        onKeyPress={this.input}
        onBlur={this.validate}
      />
    );
  }
}
