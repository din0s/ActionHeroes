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

const handleProfilePicture = (dispatch, data, photo) => {
  if (photo) {
    axios
      .put("api/users/me/photo", { photo })
      .then(() => handleUpdate(dispatch, data))
      .catch((err) => handleError(dispatch, err.response.data));
  } else {
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
    return axios
      .patch("api/users/me/profile", {
        username,
        categories,
        bio,
        coordinates,
      })
      .then((res) => handleProfilePicture(dispatch, res.data, photo))
      .catch((err) => handleError(dispatch, err.response.data));
  };
};

export const clearErrors = () => ({ type: "CLEAR" });

export const idle = () => ({ type: "IDLE" });
