import { Tabs, Card, Table } from "antd";
import { useSelector } from "react-redux";
import { useState } from "react";
import SearchWithSuggestions from "../Total Students/SearchWithSuggestions";

const AdminDetails = () => {
  const { users } = useSelector((state) => state.allUsers);
  const { admins } = useSelector((state) => state.allAdmins);
  // const { schools } = useSelector((state) => state.allSchools);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminSchoolDetails, setAdminSchoolDetails] = useState(null);

  const handleUserSelect = (user) => {

    const admin = admins?.find((admin) => admin.userId === user._id);
    setSelectedAdmin(admin || null);

    // Get school assigned to this admin
    // const assignedSchool = schools?.find(
    //   (school) => school._id === admin?.schoolId
    // );
    // setAdminSchoolDetails(assignedSchool);

    setSelectedUser(user || null);
  };

  const adminInfo =
    selectedUser && selectedAdmin
      ? [
          { key: 1, field: "Admin Name", value: selectedUser.fullName },
          { key: 2, field: "Admin ID", value: selectedAdmin.adminId },
          {
            key: 3,
            field: "Assigned School",
            value: "1",
          },
          {
            key: 4,
            field: "Employment Date",
            value: new Date(selectedAdmin.employmentDate).toLocaleDateString(),
          },
        ]
      : [];

  const columns = [
    { title: "Field", dataIndex: "field", key: "field" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  const items = [
    {
      label: "Basic Information",
      key: "1",
      children: (
        <Card
          title={
            <SearchWithSuggestions
              onUserSelect={handleUserSelect}
              role="admin"
            />
          }
        >
          <Table
            dataSource={adminInfo}
            columns={columns}
            pagination={false}
          />
        </Card>
      ),
    },
    {
      label: "Assigned School",
      key: "2",
      children: (
        <Card title="School Assignment">
          {true ? (
            <p>KVM</p>
          ) : (
            <p>No school assigned to this admin.</p>
          )}
        </Card>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

export default AdminDetails;
