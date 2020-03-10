function authenticate(endpoint, email, password) {
  return dispatch => {
    return fetch(endpoint, {
      method: "POST",
      body: {
        email,
        password
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
        } else {
          localStorage.setItem("token", data.jwt);
          dispatch({
            type: "AUTH",
            user: data.user
          });
        }
      });
  };
}

export const signup = (email, password) => authenticate("", email, password);

export const login = (email, password) => authenticate("", email, password);

export const logout = () => ({
  type: "DEAUTH"
});
