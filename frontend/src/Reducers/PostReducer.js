import {
  CLEAR_ERRORS,
  CLEAR_MESSAGE,
  FETCH_ALL_POSTS_FAILURE,
  FETCH_ALL_POSTS_REQUEST,
  FETCH_ALL_POSTS_SUCCESS,
  LIKE_FAILURE,
  LIKE_REQUEST,
  LIKE_SUCCESS,
  POST_COMMENT_FAIL,
  POST_COMMENT_REQUEST,
  POST_COMMENT_SUCCESS,
  FETCH_MY_POSTS_FAILURE,
  FETCH_MY_POSTS_REQUEST,
  FETCH_MY_POSTS_SUCCESS,
  CREATE_MY_POSTS_FAILURE,
  CREATE_MY_POSTS_SUCCESS,
  CREATE_MY_POSTS_REQUEST,
  CREATE_MY_POSTS_RESET,
  UPDATE_MY_POSTS_REQUEST,
  UPDATE_MY_POSTS_SUCCESS,
  UPDATE_MY_POSTS_FAILURE,
  UPDATE_MY_POSTS_RESET,
  DELETE_MY_POSTS_REQUEST,
  DELETE_MY_POSTS_SUCCESS,
  DELETE_MY_POSTS_FAILURE,
  DELETE_MY_POSTS_RESET,
  FETCH_USER_POSTS_REQUEST,
  FETCH_USER_POSTS_SUCCESS,
  FETCH_USER_POSTS_FAILURE,
  ADMIN_POSTS_REQUEST,
  ADMIN_POSTS_SUCCESS,
  ADMIN_POSTS_FAILURE,
  CREATE_MY_STORY_REQUEST,
  CREATE_MY_STORY_SUCCESS,
  CREATE_MY_STORY_FAILURE,
  CREATE_MY_STORY_RESET,
  FETCH_ALL_STORY_REQUEST,
  FETCH_ALL_STORY_SUCCESS,
  FETCH_ALL_STORY_FAILURE,
} from "../Constants/PostConstants";

const initialState = {
  loading: false,
  posts: [],
  error: null,
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_ALL_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case FETCH_ALL_POSTS_FAILURE:
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

export const userPostReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USER_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case FETCH_USER_POSTS_FAILURE:
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

const initialState1 = {};

export const likeReducer = (state = initialState1, action) => {
  switch (action.type) {
    case LIKE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LIKE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case LIKE_FAILURE:
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
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: null,
      };

    default:
      return state;
  }
};

const initialState2 = {
  loading: false,
  success: "",
};

export const postCommentReducer = (state = initialState2, action) => {
  switch (action.type) {
    case POST_COMMENT_REQUEST:
      return {
        ...state,
        loading: true,
        success: "",
      };
    case POST_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    case POST_COMMENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const initialState3 = {
  loading: false,
  posts: [],
  error: null,
};

export const myPostReducer = (state = initialState3, action) => {
  switch (action.type) {
    case FETCH_MY_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MY_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case FETCH_MY_POSTS_FAILURE:
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

export const createPostReducer = (state = { post: {} }, action) => {
  switch (action.type) {
    case CREATE_MY_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_MY_POSTS_SUCCESS:
      return {
        loading: false,
        post: action.payload,
        success: action.payload,
      };
    case CREATE_MY_POSTS_FAILURE:
      return {
        ...state,
        loading: false,

        error: action.payload,
      };

    case CREATE_MY_POSTS_RESET:
      return {
        ...state,
        success: false,
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

export const postUpdateOrDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_MY_POSTS_REQUEST:
    case UPDATE_MY_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_MY_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_MY_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_MY_POSTS_FAILURE:
    case UPDATE_MY_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_MY_POSTS_RESET:
      return {
        ...state,
        isDeleted: false,
        error: null,
      };

    case UPDATE_MY_POSTS_RESET:
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

export const adminPostsReducer = (
  state = { loading: false, posts: [], error: null },
  action
) => {
  switch (action.type) {
    case ADMIN_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADMIN_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
        error: null,
      };
    case ADMIN_POSTS_FAILURE:
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

export const createStoryReducer = (state = { story: {} }, action) => {
  switch (action.type) {
    case CREATE_MY_STORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_MY_STORY_SUCCESS:
      return {
        loading: false,
        story: action.payload,
        success: action.payload,
      };
    case CREATE_MY_STORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_MY_STORY_RESET:
      return {
        ...state,
        success: false,
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

export const storyReducer = (state = { stories: [] }, action) => {
  switch (action.type) {
    case FETCH_ALL_STORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_ALL_STORY_SUCCESS:
      return {
        ...state,
        loading: false,
        stories: action.payload,
      };
    case FETCH_ALL_STORY_FAILURE:
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
