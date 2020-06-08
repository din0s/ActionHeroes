import axios from "axios";

export const fetchCategories = () => {
  return (dispatch) => {
    return axios.get("/api/categories").then((res) => {
      dispatch({
        type: "CATEGORIES",
        data: res.data.categories,
      });
    });
  };
};
