import React, { useEffect, useState, useCallback } from "react";
import getStudentData from "../../hooks/getStudentData";
import { useTheme } from "../../App";
import validateUser from "../../hooks/validateUser";
import { NavLink, useNavigate } from "react-router-dom";
import getUserInfo from "../../hooks/getUserInfo";
import InstResponseBubbles from "../BubbleSheet/InstResponsesBubble";

function ScanView(props) {
  const scanViewInfo = props.scanViewInfo;
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();
  //Stores information for the instructor which is currently signed in.
  const [userInfo, setUserInfo] = useState({
    name: "",
    id: 0,
  });
  const { theme } = useTheme();
  useEffect(() => {
    const checkSession = async () => {
      const session = await validateUser();
      if (!session) {
        navigate("/login");
      } else {
        const info = await getUserInfo();
        setUserInfo({
          name: info.name,
          id: info.userId,
        });
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const setResponses = async () => {
      setResponseData(
        await getResponses(scanViewInfo.student, scanViewInfo.exam)
      );
    };
    setResponses();
  }, [scanViewInfo]);

  if (scanViewInfo.isOpen && responseData.length > 0) {
    return (
      <div className="bg-[rgba(0,_0,_0,_0.6)] fixed top-[0%] left-[0%] w-[100%] h-[100%]">
        <div className="bg-gray-800 fixed top-[5%] left-[5%] w-[90%] h-[90%] text-left">
          <button onClick={props.onClose} className="float-right mx-2">
            Close
          </button>
          <div className="flex space-x-2 flex-right">
            <h3 className="mx-5 my-1 text-[24px]">
              Viewing grades for {scanViewInfo.firstName}{" "}
              {scanViewInfo.lastName} on {scanViewInfo.examName}
            </h3>
            {
              //<h3 className = "my-1 text-[24px]">
              //Score: {scanViewInfo.score}</h3>
            }
          </div>
          <InstResponseBubbles responseData={responseData} />
        </div>
      </div>
    );
  } else if (scanViewInfo.isOpen && scanViewInfo.student !== "undefined") {
    return (
      <div className="bg-[rgba(0,_0,_0,_0.6)] fixed top-[0%] left-[0%] w-[100%] h-[100%]">
        <div className="bg-gray-800 fixed top-[5%] left-[5%] w-[90%] h-[90%] text-left">
          <button onClick={props.onClose} className="float-right mx-2">
            Close
          </button>
          <p>No Responses!</p>
        </div>
      </div>
    );
  }
}

const getResponses = async (userId, examId) => {
  const response = await fetch(
    `HTTP://localhost/api/users/questions/${examId}&${userId}`
  );
  if (response.ok) {
    const selectedResponses = await response.json();
    return selectedResponses;
  } else {
    console.log(
      `Error retrieving responses for user: ${userId} on exam: ${examId}`
    );
    return null;
  }
};

export default ScanView;
