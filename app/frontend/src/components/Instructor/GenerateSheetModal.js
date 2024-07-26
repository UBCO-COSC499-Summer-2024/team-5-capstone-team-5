// app/frontend/src/components/Instructor/GenerateSheetModal.js

import React, { useState } from 'react';
import Modal from 'react-modal';
import { useTheme } from '../../App';
import { generateDetailedOMRSheet } from '../../utils/generateOMRSheet';

Modal.setAppElement('#root'); // Replace with the root element ID

const GenerateSheetModal = ({ showModal, onClose }) => {
  const { theme } = useTheme();
  const [totalQuestions, setTotalQuestions] = useState('');
  const [options, setOptions] = useState('');

  const handleGenerateClick = async () => {
    if (totalQuestions < 1 || totalQuestions > 200) {
      alert('Total Questions should be between 1 and 200');
      return;
    }
    if (options < 1 || options > 4) {
      alert('Options should be between 1 and 4');
      return;
    }

    try {
      const pdfBytes = await generateDetailedOMRSheet(totalQuestions, options);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'OMR_Sheet.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onClose();
    } catch (error) {
      console.error('Error generating OMR sheet:', error);
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={onClose}
      contentLabel="Generate Sheet Modal"
      className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className={`p-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <h2 className="text-2xl font-bold mb-4">Generate OMR Sheet</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Total Questions (1-200):</label>
          <input
            type="number"
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(e.target.value)}
            className={`p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-200 text-black border-gray-300'}`}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Options per Question (1-4):</label>
          <input
            type="number"
            value={options}
            onChange={(e) => setOptions(e.target.value)}
            className={`p-2 border rounded w-full ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-gray-200 text-black border-gray-300'}`}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleGenerateClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Generate
          </button>
          <button
            onClick={onClose}
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateSheetModal;
