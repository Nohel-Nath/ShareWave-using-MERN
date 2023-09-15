import React, { Fragment, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import Sidebar from "../Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataGrid } from "@mui/x-data-grid";
import "../User/user.css";
import { clearErrors } from "../../../Actions/UserActions";
import { fetchStoryPosts } from "../../../Actions/PostActions";

function AllStories() {
  const dispatch = useDispatch();

  const { stories, error } = useSelector((state) => state.allStory);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(fetchStoryPosts());
  }, [dispatch, error]);

  const columns = [
    { field: "id", headerName: "Story ID", minWidth: 180, flex: 0.6 },

    {
      field: "id1",
      headerName: "User ID",
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "avatar",
      headerName: "Avatar",
      minWidth: 150,
      flex: 0.3,
      renderCell: (params) => {
        // Extract the avatar URL from the avatar object
        const avatarUrl = params.row.avatar.url;

        return (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{ width: "45px", height: "45px", borderRadius: "50%" }}
          />
        );
      },
    },
  ];

  const rows = [];

  stories &&
    stories.forEach((item) => {
      rows.push({
        id: item._id,
        id1: item.user._id,
        name: item.user.name,
        avatar: item.user.avatar,
      });
    });

  return (
    <Fragment>
      <div className="dashboard">
        <Sidebar />
        <div className="userListContainer">
          <h1 id="userListHeading">ALL STORIES</h1>

          <DataGrid rows={rows} columns={columns} className="userListTable" />
        </div>
        <ToastContainer />
      </div>
    </Fragment>
  );
}

export default AllStories;
