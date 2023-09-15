import React, { Fragment, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataGrid } from "@mui/x-data-grid";
import "../User/user.css";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import {
  adminUserDetails,
  clearErrors,
  getBlockUsers,
} from "../../../Actions/UserActions";
import { CancelPresentation } from "@mui/icons-material";
import Sidebar from "../Sidebar/Sidebar";
import { Button } from "@mui/material";

function BlockList() {
  const dispatch = useDispatch();

  const { error, blockedUsers1 } = useSelector((state) => state.blocking);

  const handleUnblockAccount = async (id) => {
    try {
      const response = await axios.post(
        `https://sharewave.vercel.app/user/unblockUser/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(adminUserDetails());
        dispatch(getBlockUsers());
      } else {
        // Error occurred while blocking the user
        toast.error(error.response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(getBlockUsers());
  }, [dispatch, error]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.6 },

    {
      field: "email",
      headerName: "Email",
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
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        const role = params.row.role.toLowerCase();
        const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
        return capitalizedRole === "Admin" ? "greenColor" : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.6,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button onClick={() => handleUnblockAccount(params.id)}>
              <CancelPresentation />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  blockedUsers1 &&
    blockedUsers1.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });
  return (
    <Fragment>
      <div className="dashboard">
        <Sidebar />
        <div className="userListContainer">
          <h1 id="userListHeading">BLOCK USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="userListTable"
            autoHeight
          />
        </div>
        <ToastContainer />
      </div>
    </Fragment>
  );
}

export default BlockList;
