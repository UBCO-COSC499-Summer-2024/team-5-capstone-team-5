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
  const [fileUploaded, setFileUploaded] = useState(1);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
  }, [scanViewInfo]);

  useEffect(() => {
    fetchData();
  }, [scanViewInfo.exam]);

  const fetchData = async () => {
    const data = await fetch(`http://localhost/api/questions/answers/${scanViewInfo.exam}`);
    const results = await data.json();
    //setQuestions(results);
    //console.log(questions)
  }

  const fetchImageUrl = async (examId, userId) => {
    const response = await fetch(`http://localhost/api/users/scans/${examId}/${userId}`);
    const data = await response.json();
    console.log(data.path);
    return data.path;
  }

  const displayImage = (path) => {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';
    const imgElement = document.createElement('img');
    imgElement.src = 'http://localhost'+path;
    imgElement.alt = 'Scan Image';
    imgElement.className = 'rounded-lg';
    console.log("Displaying image from:"+imgElement.src);
    imageContainer.appendChild(imgElement);
    setLoading(false);
  }

  const handleFileUpload = async (event) => {
    setFileUploaded(2);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('http://localhost/api/tests/upload/responses', {
        method: 'POST',
        body: formData,
        headers: {
          'testid': scanViewInfo.exam,
          'numquestions': 100 //FOR NOW
        },
      });
      console.log('File uploaded:', file);
      setFileUploaded(3);
      setTimeout(fetchData, 500);
    }
  };

  if (scanViewInfo.isOpen && responseData.length > 0) {

    fetchImageUrl(scanViewInfo.exam, scanViewInfo.student).then(path => displayImage(path));
    if(loading) {
      
    }

    const registerStudent = async (userId, courseId) => {
      console.log("registering student!");
      try {const response = await fetch(`HTTP://localhost/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
        },
        body: JSON.stringify({
          courseId: courseId,
          studentId: userId,
        }),
      });
    } catch {
        console.error(
          `Error registering user: ${userId} in course: ${courseId}`
        );
      }
    props.onClose();
    }

    const deleteResponses = async (userId, examId) => {
      try {const response = await fetch(`HTTP://localhost/api/responses/delete`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if needed
        },
        body: JSON.stringify({
          userId: userId,
          examId: examId
        }),
      });
    } catch {
        console.error(
          `Error deleting responses for user: ${userId} on exam: ${examId}`
        );
      }
    props.onClose();
    }

    return (
      <div className="bg-[rgba(0,_0,_0,_0.6)] fixed top-[0%] left-[0%] w-[100%] h-[100%]">
        <div className="bg-gray-800 fixed top-[5%] left-[5%] w-[90%] h-[90%] text-left border-[2px] border-[solid] border-gray-500">
          <button onClick={props.onClose} className="float-right m-4">
            Close
          </button>
          <div className="flex space-x-2 flex-right">
            <h3 className="mx-5 my-1 text-[24px]">
              Editing grades for {scanViewInfo.firstName}{" "}
              {scanViewInfo.lastName} on {scanViewInfo.examName}
            </h3>
            {
              //<h3 className = "my-1 text-[24px]">
              //Score: {scanViewInfo.score}</h3>
            }
          </div>
          <div className = "text-red-400"> {!scanViewInfo.isRegistered ? <>
            <h3>Warning: {scanViewInfo.firstName} {scanViewInfo.lastName} is not registered in {scanViewInfo.courseName}, yet has responses recorded for this course.</h3>
            <div className="flex space-x-24 mx-12">
              <button className= "hover:text-red-500 bg-gray-900 p-2 rounded-lg" onClick = { () => registerStudent(scanViewInfo.student, scanViewInfo.course)}>Register student</button>
              <button className= "hover:text-red-500 bg-gray-900 p-2 rounded-lg" onClick = { () => deleteResponses(scanViewInfo.student, scanViewInfo.exam)}>Delete responses</button>
            </div>
            </>
          : null }
          </div>
          <InstResponseBubbles
            responseData={responseData}
            student={scanViewInfo.student}
            exam={scanViewInfo.exam}
            setScanViewInfo={props.setScanViewInfo}
            onClose = {props.onClose}
          />
          <div id='imageContainer' className='mt-4 w-1/2 mx-12 h-[75%] overflow-auto rounded-lg'>
          </div>
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

          <div className="flex items-center">
              <label className="block text-sm font-medium mb-2 mr-4">Upload Student Tests</label>
              {fileUploaded === 3 ? (
                <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  Student tests uploaded successfully!
                </p>
              ) : (
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className={`block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:cursor-pointer
                    ${theme === 'dark' ? 'file:bg-gray-700 file:text-white' : 'file:bg-gray-300 file:text-black'}
                  `}
                />
              )}
              {fileUploaded === 2 && (
                <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  File upload in progress!
                </p>
              )}
            </div>


        </div>
      </div>
    );
  }
}

const getResponses = async (userId, examId) => {
  const response = await fetch(
    `HTTP://localhost/api/questions/responses/${examId}&${userId}`
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
