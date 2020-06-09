import axios from "axios";
import { push } from "connected-react-router";

const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
  axios.defaults.headers.authorization = token ? `Bearer ${token}` : "";
};

const handleResponse = (dispatch, data) => {
  if (data.error) {
    dispatch({
      type: "ERROR",
      error: data.error,
    });
  } else {
    setToken(data.jwt);
    dispatch({
      type: "AUTH",
      user: data.user,
    });
    dispatch(push("/dashboard"));
  }
};

setToken(localStorage.getItem("token"));

export const handshake = () => {
  return (dispatch) => {
    if (localStorage.getItem("token")) {
      return axios
        .get("/api/users/me/profile")
        .then((res) => {
          dispatch({
            type: "HANDSHAKE",
            success: true,
            user: res.data.user,
          });
        })
        .catch(() => {
          localStorage.removeItem("token");
          dispatch({
            type: "HANDSHAKE",
            success: false,
            user: {},
          });
        });
    } else {
      dispatch({
        type: "HANDSHAKE",
        success: false,
        user: {},
      });
    }
  };
};

export const signup = (username, email, password) => {
  return (dispatch) => {
    return axios
      .post("/api/auth/signup", {
        username,
        email,
        password,
      })
      .then((res) => handleResponse(dispatch, res.data))
      .catch((err) => handleResponse(dispatch, err.response.data));
  };
};

export const login = (email, password) => {
  return (dispatch) => {
    return axios
      .post("/api/auth/login", {
        email,
        password,
      })
      .then((res) => handleResponse(dispatch, res.data))
      .catch((err) => handleResponse(dispatch, err.response.data));
  };
};

export const logout = () => {
  return (dispatch) => {
    setToken(undefined);
    dispatch({ type: "DEAUTH" });
    dispatch(push("/"));
  };
};

export const clearErrors = () => ({ type: "CLEAR" });
