import React, { Fragment, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { adminUserDetails, clearErrors } from "../../../Actions/UserActions";
import { Block, Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import Sidebar from "../Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataGrid } from "@mui/x-data-grid";
import "./user.css";

function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, error } = useSelector((state) => state.adminUser);

  const handleBlockAccount = async (id) => {
    try {
      const response = await axios.post(
        `https://sharewave.vercel.app/user/blockUser/${id}`,
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
        navigate("/admin/users");
        dispatch(adminUserDetails());
      } else {
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

    dispatch(adminUserDetails());
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
      flex: 0.7,
      headerName: "Actions",
      minWidth: 50,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/updateUser/${params.id}`}>
              <Edit />
            </Link>

            <Button>
              <Block onClick={() => handleBlockAccount(params.id)} />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.users &&
    users.users.forEach((item) => {
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
          <h1 id="userListHeading">ALL USERS</h1>

          <DataGrid rows={rows} columns={columns} className="userListTable" />
        </div>
        <ToastContainer />
      </div>
    </Fragment>
  );
}

export default UserList;
