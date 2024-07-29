import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from '../../App';

const InviteStudentModal = ({ isOpen, onClose, onInvite, courseId }) => {
  const [studentEmail, setStudentEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const { theme } = useTheme();

  const handleInvite = () => {
    onInvite(studentEmail, studentNumber);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-300 text-black'}`}>
        <h3 className="text-xl font-semibold mb-4">Invite Student</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Student Email</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Student Number</label>
          <input
            type="text"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="mr-2 p-2 rounded bg-gray-500 text-white hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-400"
            onClick={handleInvite}
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Invite
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default InviteStudentModal;
