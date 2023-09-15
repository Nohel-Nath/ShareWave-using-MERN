import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { UPDATE_USER_RESET } from "../../../Constants/UserConstants";
import {
  clearErrors,
  getUserDetailsAdmin,
  updateUser,
} from "../../../Actions/UserActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MailOutline, Person, VerifiedUser } from "@mui/icons-material";
import Loader from "../../Loader/Loader";
import Sidebar from "../Sidebar/Sidebar";
import { Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import "./updateUser.css";

function UpdateUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.userDetails);

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.roleUpdate);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { id: userId } = useParams();

  useEffect(() => {
    if (user && user._id !== userId) {
      dispatch(getUserDetailsAdmin(userId));
    } else {
      setName(user && user.name);
      setEmail(user && user.email);
      setRole(user && user.role);
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("User Updated Successfully");
      dispatch(getUserDetailsAdmin(userId));
      //navigate("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, navigate, error, isUpdated, updateError, user]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };

  return (
    <Fragment>
      <div className="dashboard">
        <Sidebar />
        <div className="newUserContainer">
          {loading ? (
            <Loader />
          ) : (
            <form className="createUserForm" onSubmit={updateUserSubmitHandler}>
              <h1>Update User</h1>

              <div>
                <Person />
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutline />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUser />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="createUserBtn"
                type="submit"
                disabled={
                  updateLoading ? true : false || role === "" ? true : false
                }
              >
                Update
              </Button>
            </form>
          )}
        </div>
        <ToastContainer />
      </div>
    </Fragment>
  );
}

export default UpdateUser;
