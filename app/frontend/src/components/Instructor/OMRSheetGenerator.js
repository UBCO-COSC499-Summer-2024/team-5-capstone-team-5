// app/frontend/src/components/Instructor/OMRSheetGenerator.js

import React from 'react';
import { useParams } from 'react-router-dom';
import { saveAs } from 'file-saver';

const OMRSheetGenerator = () => {
  const { type } = useParams();

  const downloadFile = () => {
    const fileUrl = type === '100' ? '/100bubble.pdf' : '/200bubble.pdf';
    saveAs(process.env.PUBLIC_URL + fileUrl, fileUrl.split('/').pop());
  };

  React.useEffect(() => {
    downloadFile();
  }, [type]);

  return <div>Downloading {type} Bubble Sheet...</div>;
};

export default OMRSheetGenerator;
