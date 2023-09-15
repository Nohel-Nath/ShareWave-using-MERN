import axios from "axios";
import Cookies from "js-cookie";
import {
  ALL_USERS_FAILURE,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  CLEAR_ERRORS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_USER_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  UPDATE_USERS_FAILURE,
  UPDATE_USERS_REQUEST,
  UPDATE_USERS_SUCCESS,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
  USER_FOLLOW_REQUEST,
  USER_FOLLOW_SUCCESS,
  USER_FOLLOW_FAILURE,
  USER_BLOCK_LIST_REQUEST,
  USER_BLOCK_LIST_FAILURE,
  USER_BLOCK_LIST_SUCCESS,
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  ADMIN_USERS_REQUEST,
  ADMIN_USERS_SUCCESS,
  ADMIN_USERS_FAILURE,
  BLOCK_USERS_REQUEST,
  BLOCK_USERS_SUCCESS,
  BLOCK_USERS_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  NOTIFICATION_DETAILS_REQUEST,
  NOTIFICATION_DETAILS_SUCCESS,
  NOTIFICATION_DETAILS_FAIL,
} from "../Constants/UserConstants";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `https://share-wave.vercel.app/user/login`,
      { email, password },
      config
    );
    const token = data.token;
    localStorage.setItem("token", token);
    Cookies.set("token", token, { expires: 100 });

    dispatch({ type: LOGIN_SUCCESS, payload: { user: data.user, token } });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.error,
    });
  }
};

export const registerAUser =
  (name, email, password, website, avatar) => async (dispatch) => {
    try {
      dispatch({ type: REGISTER_USER_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `https://share-wave.vercel.app/user/registration`,
        { name, email, password, website, avatar },
        config
      );
      const token = data.token;
      localStorage.setItem("token", token);
      Cookies.set("token", data.token, { expires: 100 });

      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user: data, token },
      });
    } catch (error) {
      dispatch({
        type: REGISTER_USER_FAIL,
        payload: error.response.data.error,
      });
    }
  };

export const getUserDetails = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST });
    //const token = localStorage.getItem("token");
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/profile`,
      config
    );

    dispatch({ type: LOAD_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const allUserDetails = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_USERS_REQUEST });
    //const token = localStorage.getItem("token");
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/usersAll`,
      config
    );

    dispatch({ type: ALL_USERS_SUCCESS, payload: data.sanitizedUsers });
  } catch (error) {
    dispatch({
      type: ALL_USERS_FAILURE,
      payload: error.response ? error.response.data.error : error.message,
    });
  }
};

export const adminUserDetails = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_USERS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/allUsers`,
      config
    );

    dispatch({ type: ADMIN_USERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADMIN_USERS_FAILURE,
      payload: error.response ? error.response.data.error : error.message,
    });
  }
};

export const searchAction = (tags, name) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/post/search?tags=${tags || ""}&name=${
        name || ""
      }`,
      config
    );

    dispatch({ type: SEARCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEARCH_FAILURE,
      payload: error.response ? error.response.data.error : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT_SUCCESS });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/logout`,
      config
    );
    const token = data.token;
    localStorage.removeItem("token", token);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response.data.error,
    });
  }
};

export const updateProfile =
  (name, email, website, avatar) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_USERS_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `https://share-wave.vercel.app/user/profileUpdate`,
        { name, email, website, avatar },
        config
      );

      dispatch({ type: UPDATE_USERS_SUCCESS, payload: data.success });
    } catch (error) {
      dispatch({
        type: UPDATE_USERS_FAILURE,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

// Update Password
export const updatePassword =
  (oldPassword, newPassword) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_PASSWORD_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `https://share-wave.vercel.app/user/passwordUpdate`,
        { oldPassword, newPassword },
        config
      );

      dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
    } catch (error) {
      dispatch({
        type: UPDATE_PASSWORD_FAIL,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

export const fetchUSERProfile = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/userProfile/${id}`,
      config
    );

    dispatch({
      type: USER_PROFILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const followUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: USER_FOLLOW_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/follow/${id}`,
      config
    );

    dispatch({
      type: USER_FOLLOW_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: USER_FOLLOW_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const blockList = () => async (dispatch) => {
  try {
    dispatch({ type: USER_BLOCK_LIST_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/blockList`,
      config
    );

    dispatch({ type: USER_BLOCK_LIST_SUCCESS, payload: data.blockedUsers });
  } catch (error) {
    dispatch({
      type: USER_BLOCK_LIST_FAILURE,
      payload: error.response ? error.response.data.error : error.message,
    });
  }
};

export const getBlockUsers = () => async (dispatch) => {
  try {
    dispatch({ type: BLOCK_USERS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/blockByAdmin`,
      config
    );

    dispatch({
      type: BLOCK_USERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BLOCK_USERS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// get  User Details
export const getUserDetailsAdmin = (userId) => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.get(
      `https://share-wave.vercel.app/user/details/${userId}`,
      config
    );

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `https://share-wave.vercel.app/user/updateRole/${id}`,
      userData,
      config
    );

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const allNotificationDetails = () => async (dispatch) => {
  try {
    dispatch({ type: NOTIFICATION_DETAILS_REQUEST });
    //const token = localStorage.getItem("token");
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/notification/all`,
      config
    );

    dispatch({ type: NOTIFICATION_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_DETAILS_FAIL,
      payload: error.response ? error.response.data.error : error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
