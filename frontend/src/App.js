import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Components/User/Login/Login";
import ConditionalHeader from "./ConditionalHeader";
import Register from "./Components/User/Registration/Register";
import { useEffect } from "react";
import { getUserDetails } from "./Actions/UserActions";
import Home from "./Components/Home/Home";
import Account from "./Components/User/Account/Account";
import CreatePost from "./Components/Post/CreatePost/CreatePost";

import UpdateProfile from "./Components/User/UpdateProfile/UpdateProfile";
import UpdatePassword from "./Components/User/UpdatePassword/UpdatePassword";
import ForgetPassword from "./Components/User/ForgetPassword/ForgetPassword";
import ResetPassword from "./Components/User/ResetPassword/ResetPassword";
import UserProfile from "./Components/User/UserProfile/UserProfile";
import Search from "./Components/Post/Search/Search";
import Dashboard from "./Components/Admin/Dashboard/Dashboard";
import UserList from "./Components/Admin/User/UserList";
import BlockList from "./Components/Admin/Blocking/BlockList";
import AllPosts from "./Components/Admin/AllPosts/AllPosts";
import UpdateUser from "./Components/Admin/User/UpdateUser";
import Notification from "./Components/User/Notification/Notification";
import AllStories from "./Components/Admin/AllStories/AllStories";
import Error from "./Components/Error/Error";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserDetails());
  }, [dispatch]);
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <Router>
      {isAuthenticated && <ConditionalHeader />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/newpost" element={<CreatePost />} />
        <Route path="/update/profile" element={<UpdateProfile />} />
        <Route path="/update/password" element={<UpdatePassword />} />
        <Route path="/forgot/password" element={<ForgetPassword />} />
        <Route path="/user/password-reset/:token" element={<ResetPassword />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/blockList" element={<BlockList />} />
        <Route path="/admin/posts" element={<AllPosts />} />
        <Route path="/admin/stories" element={<AllStories />} />
        <Route path="/admin/updateUser/:id" element={<UpdateUser />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
