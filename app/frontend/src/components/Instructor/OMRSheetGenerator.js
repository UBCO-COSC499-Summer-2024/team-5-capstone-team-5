// app/frontend/src/components/Instructor/OMRSheetGenerator.js
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { generateDetailedOMRSheet } from '../../utils/generateOMRSheet';

const OMRSheetGenerator = () => {
  const [totalQuestions, setTotalQuestions] = useState(100);
  const [optionsCount, setOptionsCount] = useState(4);

  const handleGenerateClick = async () => {
    const pdfBytes = await generateDetailedOMRSheet(totalQuestions, optionsCount);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'OMR_Sheet.pdf');
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Generate OMR Sheet</h2>
      <label className="block mb-2">Total Questions (1-200):</label>
      <input
        type="number"
        value={totalQuestions}
        onChange={(e) => setTotalQuestions(Number(e.target.value))}
        min={1}
        max={200}
        className="input mb-4"
      />
      <label className="block mb-2">Options (1-4):</label>
      <input
        type="number"
        value={optionsCount}
        onChange={(e) => setOptionsCount(Number(e.target.value))}
        min={1}
        max={4}
        className="input mb-4"
      />
      <button onClick={handleGenerateClick} className="btn btn-primary mr-2">Generate</button>
    </div>
  );
};

export default OMRSheetGenerator;
