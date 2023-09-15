import axios from "axios";
import {
  ADMIN_POSTS_REQUEST,
  CLEAR_ERRORS,
  CLEAR_MESSAGE,
  CREATE_MY_POSTS_FAILURE,
  CREATE_MY_POSTS_REQUEST,
  CREATE_MY_POSTS_SUCCESS,
  DELETE_MY_POSTS_FAILURE,
  DELETE_MY_POSTS_REQUEST,
  DELETE_MY_POSTS_SUCCESS,
  FETCH_ALL_POSTS_FAILURE,
  FETCH_ALL_POSTS_REQUEST,
  FETCH_ALL_POSTS_SUCCESS,
  FETCH_MY_POSTS_FAILURE,
  FETCH_MY_POSTS_REQUEST,
  FETCH_MY_POSTS_SUCCESS,
  FETCH_USER_POSTS_FAILURE,
  FETCH_USER_POSTS_REQUEST,
  FETCH_USER_POSTS_SUCCESS,
  LIKE_FAILURE,
  LIKE_REQUEST,
  LIKE_SUCCESS,
  POST_COMMENT_FAIL,
  POST_COMMENT_REQUEST,
  POST_COMMENT_SUCCESS,
  UPDATE_MY_POSTS_FAILURE,
  UPDATE_MY_POSTS_REQUEST,
  UPDATE_MY_POSTS_SUCCESS,
  ADMIN_POSTS_SUCCESS,
  ADMIN_POSTS_FAILURE,
  CREATE_MY_STORY_REQUEST,
  CREATE_MY_STORY_SUCCESS,
  CREATE_MY_STORY_FAILURE,
  FETCH_ALL_STORY_REQUEST,
  FETCH_ALL_STORY_SUCCESS,
  FETCH_ALL_STORY_FAILURE,
} from "../Constants/PostConstants";

export const fetchAllPosts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ALL_POSTS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      "https://share-wave.vercel.app/post/allPosts",
      config
    );

    dispatch({
      type: FETCH_ALL_POSTS_SUCCESS,
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ALL_POSTS_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const fetchAdminPosts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_POSTS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/post/postsAdmin`,
      config
    );

    dispatch({
      type: ADMIN_POSTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_POSTS_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const fetchUSERPosts = (id) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_USER_POSTS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/post/userPosts/${id}`,
      config
    );

    dispatch({
      type: FETCH_USER_POSTS_SUCCESS,
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_POSTS_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const likePosts = (id) => async (dispatch) => {
  try {
    dispatch({ type: LIKE_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `https://share-wave.vercel.app/post/${id}/like`,
      config
    );

    dispatch({
      type: LIKE_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: LIKE_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const postComment = (postId, comment) => async (dispatch) => {
  try {
    dispatch({ type: POST_COMMENT_REQUEST });
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `https://share-wave.vercel.app/post/postComment/${postId}`,
      { comment },
      config
    );

    dispatch({
      type: POST_COMMENT_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: POST_COMMENT_FAIL,
      payload: error.response
        ? error.response.data.message
        : "An error occurred",
    });
  }
};

export const fetchMyPosts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_MY_POSTS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.get(
      "https://share-wave.vercel.app/post/myPosts",
      config
    );

    dispatch({
      type: FETCH_MY_POSTS_SUCCESS,
      payload: data.posts,
    });
  } catch (error) {
    dispatch({
      type: FETCH_MY_POSTS_FAILURE,
      payload: error.response.data.error,
    });
  }
};
export const createNewPost =
  (caption, image, tags, feeling, location) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_MY_POSTS_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `https://share-wave.vercel.app/post/upload`,
        {
          caption,
          image,
          tags,
          feeling,
          location,
        },
        config
      );
      dispatch({
        type: CREATE_MY_POSTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_MY_POSTS_FAILURE,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

// Update Product
export const updatePost =
  (id, caption, tags, feeling, location) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_MY_POSTS_REQUEST });

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.put(
        `https://share-wave.vercel.app/post/update/${id}`,
        { caption, tags, feeling, location },
        config
      );

      dispatch({
        type: UPDATE_MY_POSTS_SUCCESS,
        payload: data.success,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_MY_POSTS_FAILURE,
        payload: error.response ? error.response.data.message : error.message,
      });
    }
  };

// Delete Product
export const deletePost = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_MY_POSTS_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.delete(
      `https://share-wave.vercel.app/post/${id}/delete`,
      config
    );

    dispatch({
      type: DELETE_MY_POSTS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_MY_POSTS_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const createNewStory = (content, image) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_MY_STORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      "https://share-wave.vercel.app/story/create",
      {
        content,
        image,
      },
      config
    );
    dispatch({
      type: CREATE_MY_STORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_MY_STORY_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const fetchStoryPosts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_ALL_STORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    const { data } = await axios.get(
      "https://share-wave.vercel.app/story/all",
      config
    );

    dispatch({
      type: FETCH_ALL_STORY_SUCCESS,
      payload: data.stories,
    });
  } catch (error) {
    dispatch({
      type: FETCH_ALL_STORY_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
export const clearMessage = () => async (dispatch) => {
  dispatch({ type: CLEAR_MESSAGE });
};
