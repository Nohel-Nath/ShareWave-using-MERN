import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  adminUsersReducer,
  allNotificatonReducer,
  allUserReducer,
  blockUserReducer,
  blockUsersReducer,
  profileReducer,
  roleUpdateReducer,
  searchReducer,
  userDetailsReducer,
  userFollowReducer,
  userProfileReducer,
  userReducer,
} from "./Reducers/UserReducer";
import {
  adminPostsReducer,
  createPostReducer,
  createStoryReducer,
  likeReducer,
  myPostReducer,
  postCommentReducer,
  postReducer,
  postUpdateOrDeleteReducer,
  storyReducer,
  userPostReducer,
} from "./Reducers/PostReducer";

const reducer = combineReducers({
  user: userReducer,
  posts: postReducer,
  allUsers: allUserReducer,
  like: likeReducer,
  addComment: postCommentReducer,
  myPosts: myPostReducer,
  newPost: createPostReducer,
  update: postUpdateOrDeleteReducer,
  profile: profileReducer,
  userPosts: userPostReducer,
  userProfile: userProfileReducer,
  follow: userFollowReducer,
  blockList: blockUserReducer,
  search: searchReducer,
  adminUser: adminUsersReducer,
  adminPost: adminPostsReducer,
  blocking: blockUsersReducer,
  roleUpdate: roleUpdateReducer,
  userDetails: userDetailsReducer,
  notifications: allNotificatonReducer,
  newStory: createStoryReducer,
  allStory: storyReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
