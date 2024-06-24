import React, { useState } from 'react';
import { useTheme } from '../../App';

const InstructorTest = ({ setState, test }) => {
    const { theme } = useTheme();


    return(
        <tr
          className={`cursor-pointer ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'}`}
          onClick={() => setState(test)}
        >
          <td className="p-4">{test.name}</td>
          <td className="p-4">{test.mean_score || 'N/A'}</td>
        </tr>
    )
}

export default InstructorTest;