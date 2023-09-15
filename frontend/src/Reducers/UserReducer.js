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
  UPDATE_USERS_RESET,
  UPDATE_USERS_SUCCESS,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_RESET,
  UPDATE_PASSWORD_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
  USER_FOLLOW_REQUEST,
  USER_FOLLOW_SUCCESS,
  USER_FOLLOW_FAILURE,
  USER_BLOCK_LIST_REQUEST,
  USER_BLOCK_LIST_SUCCESS,
  USER_BLOCK_LIST_FAILURE,
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
  UPDATE_USER_RESET,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  NOTIFICATION_DETAILS_REQUEST,
  NOTIFICATION_DETAILS_SUCCESS,
  NOTIFICATION_DETAILS_FAIL,
} from "../Constants/UserConstants";

const token = localStorage.getItem("token");

export const userReducer = (
  state = {
    token: token ? token : null,
    loading: false,
    isAuthenticated: token ? true : false,
    user: null,
  },
  action
) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_USER_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
      };
    case LOAD_USER_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
      };
    case LOGIN_SUCCESS:
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload, // Use action.payload.user
        token: action.payload.token, // Use action.payload.token
      };
    case LOGOUT_SUCCESS:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case LOGIN_FAIL:
    case REGISTER_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
        token: null,
      };
    case LOAD_USER_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const allUserReducer = (
  state = { sanitizedUsers: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case ALL_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ALL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        sanitizedUsers: action.payload,
      };
    case ALL_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const adminUsersReducer = (
  state = { loading: false, users: [], error: null },
  action
) => {
  switch (action.type) {
    case ADMIN_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null,
      };
    case ADMIN_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const searchReducer = (
  state = { posts: [], users: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case SEARCH_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload.posts,
        users: action.payload.users,
      };
    case SEARCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const blockUserReducer = (
  state = { blockedUsers: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case USER_BLOCK_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case USER_BLOCK_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        blockedUsers: action.payload,
      };
    case USER_BLOCK_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const profileReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_USERS_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_USERS_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case UPDATE_USERS_FAILURE:
    case UPDATE_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_USERS_RESET:
    case UPDATE_PASSWORD_RESET:
      return {
        ...state,
        isUpdated: false,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const userProfileReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };
    case USER_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const userFollowReducer = (
  state = { loading: false, success: null, error: null },
  action
) => {
  switch (action.type) {
    case USER_FOLLOW_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_FOLLOW_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    case USER_FOLLOW_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const blockUsersReducer = (state = { blockedUsers1: [] }, action) => {
  switch (action.type) {
    case BLOCK_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case BLOCK_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        blockedUsers1: action.payload,
      };

    case BLOCK_USERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case USER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case USER_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const roleUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case UPDATE_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_USER_RESET:
      return {
        ...state,
        isUpdated: false,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const allNotificatonReducer = (
  state = { notifications: [], loading: false, error: null },
  action
) => {
  switch (action.type) {
    case NOTIFICATION_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case NOTIFICATION_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };
    case NOTIFICATION_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
