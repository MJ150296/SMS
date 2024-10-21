import React, { useState, useEffect } from "react";
import { Table, Modal } from "antd"; // Still using Ant Design for table and modal
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchAllUsers } from "../../../../Redux/slices/allUsersSlice.js";

const ManageUsers = () => {
  const dispatch = useDispatch();
  // dispatch(fetchAllUsers()); // To update the All user Info

  const [usersData, setUsersData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { users, isLoading, error } = useSelector((state) => state.allUsers);

  useEffect(() => {
    if (users) {
      console.log(users);
      setUsersData(users);
      setFilteredUsers(users); // Update filteredUsers when usersData is set
    }
  }, [users]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = usersData.filter((user) =>
      user.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleFilter = (value) => {
    setFilterRole(value);
    if (value === "All") {
      setFilteredUsers(usersData);
    } else {
      const filtered = usersData.filter((user) => user.role === value);
      setFilteredUsers(filtered);
    }
  };

  const showUserModal = (user) => {
    setSelectedUser(user);
    setUserModalVisible(true);
  };

  const closeUserModal = () => {
    setUserModalVisible(false);
    setSelectedUser(null);
  };

  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: (user) => (
        <button
          onClick={() => showUserModal(user)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="manage-users-dashboard p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <NavLink
          to="/dashboard/new_user_registration"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow-lg"
        >
          + Add New User
        </NavLink>
      </div>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg p-2 w-64"
        />
        <select
          className="border border-gray-300 rounded-lg p-2"
          value={filterRole}
          onChange={(e) => handleFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="superAdmin">Super Admin</option>
        </select>

        <button
          onClick={() => {
            console.log("clicked");

            dispatch(fetchAllUsers()); // To update the All user Info
          }}
        >
          Refresh
        </button>
      </div>

      <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />

      {/* User Modal */}
      <Modal
        title={selectedUser?.fullName}
        open={userModalVisible}
        onCancel={closeUserModal}
        footer={null}
      >
        {selectedUser && (
          <div>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedUser.isActive ? "Active" : "Inactive"}
            </p>
            <p>
              <strong>Contact:</strong> {selectedUser.contact}
            </p>
            <button
              onClick={() => console.log("Edit User")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
            >
              Edit User
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
