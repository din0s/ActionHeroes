import axios from "axios";
import { push } from "connected-react-router";

const handleResponse = (dispatch, data) => {
  console.log(data);
  if (data.error) {
    console.log(data.error);
    dispatch({
      type: "ERROR",
      error: data.error
    });
  } else {
    dispatch({
      type: "CONTACT",
      user: data.user
    });
    dispatch(push("/contact"));
  }
};

export const contact = (first_name, last_name,  email, question) => {
  return dispatch => {
    return axios
      .post("/contact", {
        first_name,
        last_name,
        email,
        question
      })
      .then(res => handleResponse(dispatch, res.data))
      .catch(err => handleResponse(dispatch, err.response.data));
  };
};

export const clearErrors = () => ({ type: "CLEAR" });
