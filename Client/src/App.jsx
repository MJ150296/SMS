import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { fetchSchoolProfile } from "./Redux/slices/schoolProfileDataSlice.js";
import Loading from "./components/Loading.jsx";
import "animate.css";
import "../src/assets/Chart JS imports/ChartJS.register.js"


function App() {
  const [welcomeScreenEnds, setWelcomeScreenEnds] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { schoolProfile, isLoading, error } = useSelector(
    (state) => state.schoolProfile
  );

  // Local state to store the fetched profile
  const [profileData, setProfileData] = useState(null);

  const [logoUrl, setLogoUrl] = useState(
    "https://res.cloudinary.com/dzmjjm2kn/image/upload/v1729203068/smsLogo_xnewfo.jpg"
  );

  // Fetch the school profile when the app starts
  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchSchoolProfile());
    };
    fetchData();
  }, []);

  // Update local state when schoolProfile changes
  useEffect(() => {
    if (schoolProfile) {
      const data = schoolProfile.schoolProfile;
      setProfileData(data);
      setTimeout(() => {
        setWelcomeScreenEnds(true);
      }, 3000);
    }
  }, [schoolProfile]);

  useEffect(() => {
    if (profileData) {
      console.log(profileData);
    }
  }, [profileData]);

  return (
    <div className="w-screen min-h-screen">
      {welcomeScreenEnds ? (
        <Outlet />
      ) : (
        // **************** WELCOME SCREEN BELOW ********************//
        <>
          <div className="w-full min-h-screen overflow-hidden flex flex-col gap-y-5 justify-center items-center">
            <img
              src={profileData?.logoUrl || logoUrl}
              alt=""
              className="w-60"
            />
            <h1 className="text-4xl font-medium">
              {profileData?.name || "School Management System"}
            </h1>
            <p className="text-2xl">{profileData?.address?.city || ""}</p>
            {/* <p>{profileData.contact}</p> */}
            {/* Add more fields as needed */}
          </div>
          {isLoading && <Loading />} {/* Loading state */}
          {error && error} {/* Error state */}
        </>
      )}
    </div>
  );
}

export default App;
