import "./SpinnerPage.scss";

import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

export default () => (
  <div className="SpinnerPage">
    <ScaleLoader color={"#3480eb"} />
    <h1>Action Heroes</h1>
  </div>
);
