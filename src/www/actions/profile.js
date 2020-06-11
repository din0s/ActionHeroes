import axios from "axios";

const handleError = (dispatch, data) => {
  dispatch({
    type: "ERROR",
    error: data.error,
  });
};

const handleUpdate = (dispatch, data) => {
  dispatch({
    type: "UPDATE",
    user: data.user,
  });
};

const handlePasswordResponse = (dispatch, data) => {
  if (data.error) {
    handleError(dispatch, data);
  } else {
    const { jwt } = data;
    localStorage.setItem("token", jwt);
    axios.defaults.headers.authorization = `Bearer ${jwt}`;
    handleUpdate(dispatch, data);
  }
};

export const updatePassword = (previousPassword, newPassword) => {
  return (dispatch) => {
    return axios
      .patch("api/users/me/change_password", {
        previousPassword,
        newPassword,
      })
      .then((res) => handlePasswordResponse(dispatch, res.data))
      .catch((err) => handlePasswordResponse(dispatch, err.response.data));
  };
};

export const updateProfile = (
  username,
  categories,
  bio,
  coordinates,
  photo
) => {
  return (dispatch) => {
    const fd = new FormData();
    fd.set("username", username);
    fd.set("categories", JSON.stringify(categories));
    fd.set("coordinates", JSON.stringify(coordinates));
    if (bio !== "") {
      fd.set("bio", bio);
    }
    if (photo) {
      fd.set("photo", photo);
    }
    return axios
      .patch("api/users/me/profile", fd)
      .then((res) => handleUpdate(dispatch, res.data))
      .catch((err) => handleError(dispatch, err.response.data));
  };
};

export const clearErrors = () => ({ type: "CLEAR" });

export const idle = () => ({ type: "IDLE" });
