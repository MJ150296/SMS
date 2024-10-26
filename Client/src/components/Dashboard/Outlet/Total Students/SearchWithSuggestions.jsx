import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SearchWithSuggestions = ({ onUserSelect, role }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);
  const [hoveredUser, setHoveredUser] = useState(null); // State for hovered user
  const [userInfo, setUserInfo] = useState([]); // Filtered users based on role

  const { users } = useSelector((state) => state.allUsers);
  const { students } = useSelector((state) => state.allStudents);
  const { teachers } = useSelector((state) => state.allTeachers);
  const { admins } = useSelector((state) => state.allAdmins); // Add admin info

  useEffect(() => {
    if (role === "student") {
      setUserInfo(users.filter((user) => user.role === "student"));
    } else if (role === "teacher") {
      setUserInfo(users.filter((user) => user.role === "teacher"));
    } else if (role === "admin") {
      setUserInfo(users.filter((user) => user.role === "admin"));
    }
  }, [students, teachers, users, admins, role]);

  const searchSuggestion = (value) => {
    const filteredSuggestions = userInfo.filter((user) =>
      user.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestionList(filteredSuggestions);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value.length > 2) {
      searchSuggestion(value);
      setSuggestionsVisible(true);
    } else {
      setSuggestionsVisible(false);
      setSuggestionList([]);
      setHoveredUser(null);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSuggestionsVisible(false);
    setSuggestionList([]);
    setHoveredUser(null);
  };

  const handleUserClick = (user) => {
    setSearchText(user.fullName);
    setSuggestionsVisible(false);
    setHoveredUser(null);
    onUserSelect(user);
  };

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder={`Search ${role}...`}
          className="w-full border rounded-lg px-4 py-2"
        />

        {searchText && (
          <button
            onClick={clearSearch}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
          >
            &#x2715;
          </button>
        )}
      </div>

      {suggestionsVisible && suggestionList.length > 0 && (
        <div className="absolute mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-96 max-h-40 overflow-y-auto z-50">
          {suggestionList.map((user, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleUserClick(user)}
              onMouseEnter={() => setHoveredUser(user)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              {user.fullName}
            </div>
          ))}
        </div>
      )}

      {hoveredUser && (
        <div className="absolute left-96 top-14 bg-white border border-gray-300 rounded-lg shadow-lg w-80 p-4 z-50">
          <h3 className="font-bold text-lg">{hoveredUser.fullName}</h3>
          <p>
            <strong>Email:</strong> {hoveredUser.email}
          </p>
          <p>
            <strong>Is Active:</strong> {hoveredUser.isActive ? "Active" : "Inactive"}
          </p>
          {role === "student" && (
            <>
              <p>
                <strong>Student ID:</strong> {hoveredUser.studentId}
              </p>
              <p>
                <strong>Class:</strong> {hoveredUser.classEnrolled}
              </p>
            </>
          )}
          {role === "teacher" && (
            <>
              <p>
                <strong>Teacher ID:</strong> {hoveredUser.teacherId}
              </p>
              <p>
                <strong>Subject Specialization:</strong> {hoveredUser.subjectSpecialization}
              </p>
            </>
          )}
          {role === "admin" && (
            <>
              <p>
                <strong>Admin ID:</strong> {hoveredUser.adminId}
              </p>
              <p>
                <strong>School:</strong> {hoveredUser.schoolName}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithSuggestions;
