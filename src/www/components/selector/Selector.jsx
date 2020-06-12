import React from "react";
import Select from "react-select";

export default ({ centered, value, onChange, options }) => (
  <Select
    className="Selector"
    components={{
      ValueContainer: () => value,
    }}
    styles={{
      control: () => ({
        border: "none",
        display: "flex",
        justifyContent: centered ? "center" : "",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
    }}
    onChange={onChange}
    options={options}
  />
);
