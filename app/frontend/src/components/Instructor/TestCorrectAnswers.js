import React, { useState, useEffect } from 'react';
import { useTheme } from '../../App';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EditBubble from '../BubbleSheet/EditableBubbles';

const TestCorrectAnswers = (props) => {
  const userId = props.id;
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { test } = location.state || {};
  const { courseId, testId } = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answerKeyUploaded, setAnswerKeyUploaded] = useState(1);
  const [fileUploaded, setFileUploaded] = useState(1);
  const [numQuestions, setNumQuestions] = useState(100);
  const [showingScan, setShowingScan] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [testId]);

  const fetchData = async () => {
    const data = await fetch(`http://localhost/api/users/questions/answers/${testId}`);
    const results = await data.json();
    setQuestions(results);
    console.log(questions)
    console.log(results);
    setLoading(false);
  }

  const handleFileUpload = async (event) => {
    setFileUploaded(2);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('http://localhost/api/users/tests/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'testid': test.id,
          'numquestions': numQuestions
        },
      });
      console.log('File uploaded:', file);
      setFileUploaded(3);
      setTimeout(fetchData, 500);
    }
  };

  const handleAnswerKeyUpload = async (event) => {
    setAnswerKeyUploaded(2);
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost/api/users/tests/answers', {
        method: 'POST',
        body: formData,
        headers: {
          'testid': test.id,
          'numquestions': numQuestions,
          'userid': userId,
        },
      });
      const data = await response.json();
      console.log('File uploaded:', file);
      console.log('userid in headers:',userId);
      test.correctAnswers = data.correctAnswers;
      setAnswerKeyUploaded(3);
      setTimeout(fetchData, 500);
    }
  };

  const fetchImageUrl = async (examId, userId) => {
    const response = await fetch(`http://localhost/api/users/scans/${examId}/${userId}`);
    const data = await response.json();
    console.log(data.path);
    return data.path
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
  }

  const handleScanClick = () => {
    setShowingScan(true);
    fetchImageUrl(test.id, props.id).then(path => displayImage(path))
  }
  const handleScanClose = () => {
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = '';
    setShowingScan(false);
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredQuestions = questions.filter(question =>
    question.question_num.toString().includes(searchQuery)
  );

  return (
    <div className={`p-4 flex flex-col min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <button
        onClick={() => navigate(-1)}
        className={`px-4 py-2 rounded transition duration-200 mb-4 ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-gray-300 text-black hover:bg-blue-400'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7M21 12H3" />
        </svg>
        Back
      </button>
      <div className="flex-grow">
        <div className={`rounded-lg p-6 shadow-lg mb-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h2 className="text-2xl font-bold mb-4">{test?.name} - Correct Answers</h2>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="100q" className="mr-2">100 Questions</label>
              <input type="radio" id="100q" name="numquestions" defaultChecked onClick={() => setNumQuestions(100)} />
              <label htmlFor="200q" className="mr-2 ml-4">200 Questions</label>
              <input type="radio" id="200q" name="numquestions" onClick={() => setNumQuestions(200)} />
            </div>
            <div className="flex items-center">
              <label className="block text-sm font-medium mb-2 mr-4">Upload Answer Key</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleAnswerKeyUpload}
                className={`block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:cursor-pointer
                  ${theme === 'dark' ? 'file:bg-gray-700 file:text-white' : 'file:bg-gray-300 file:text-black'}
                `}
              />
              {answerKeyUploaded === 2 && (
                <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
                  File upload in progress!
                </p>
              )}
            </div>
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
            <div>
              {!showingScan && <button onClick={handleScanClick}>Show Scan</button>}
              {showingScan && <button onClick={handleScanClose}>Close Scan</button>}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <input
          type="text"
          placeholder="Search by question #"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 rounded border text-black"
        />
        {!showingScan && <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider">Question Number</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider">Correct Answer</th>
              <th className="px-6 py-2 text-left text-xs font-medium uppercase tracking-wider">Weight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredQuestions.map((question, index) => (
              <tr key={index}>
                <td className="px-6 py-2 whitespace-nowrap">{question.question_num}</td>
                <td className="px-6 py-2 whitespace-nowrap"><EditBubble question={question} /></td>
                <td className="px-6 py-2 whitespace-nowrap">{question.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>}
        <div id='imageContainer' className='mt-4'>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TestCorrectAnswers;
