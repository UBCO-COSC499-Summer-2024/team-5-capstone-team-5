import React from 'react';
import { NavLink } from 'react-router-dom';

const Course = (props) => {
    const test = props.test;
    return(
    <div className="p-4 mb-4 rounded-lg bg-gray-700 text-white">
        <NavLink to={`../../student/exam/${test.id}`}>
          <h3 className="text-xl font-bold">{test.name}</h3>
          {test.date_marked && <p className="text-lg">Date Marked: {test.date_marked.slice(0,10)}</p> }        </NavLink> 
    </div>
    );
}

export default Course;