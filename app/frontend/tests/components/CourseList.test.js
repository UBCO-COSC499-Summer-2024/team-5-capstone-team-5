// app/frontend/tests/components/CourseList.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CourseList from '../../../src/components/CourseList';

describe('CourseList Component', () => {
  it('renders without crashing and displays the course list', () => {
    render(<CourseList />);

    // Check if the heading is rendered
    expect(screen.getByText('Courses')).toBeInTheDocument();

    // Check if the course names are rendered
    const courseNames = ["Math 101", "Math 102", "Math 201", "Math 202", "Math 301", "Math 302", "Math 401", "Math 402"];
    courseNames.forEach(courseName => {
      expect(screen.getByText(courseName)).toBeInTheDocument();
    });
  });

  it('toggles course details on click', () => {
    render(<CourseList />);

    // Click on the first course
    fireEvent.click(screen.getByText('Math 101'));

    // Check if the details are displayed
    const details = ["Lecture 1", "Lecture 2", "Lecture 3"];
    details.forEach(detail => {
      expect(screen.getByText(detail)).toBeInTheDocument();
    });

    // Click on the first course again to hide the details
    fireEvent.click(screen.getByText('Math 101'));

    // Check if the details are hidden
    details.forEach(detail => {
      expect(screen.queryByText(detail)).not.toBeInTheDocument();
    });
  });

  it('displays the details of only the clicked course', () => {
    render(<CourseList />);

    // Click on the first course
    fireEvent.click(screen.getByText('Math 101'));

    // Check if the details of the first course are displayed
    const details = ["Lecture 1", "Lecture 2", "Lecture 3"];
    details.forEach(detail => {
      expect(screen.getByText(detail)).toBeInTheDocument();
    });

    // Click on the second course
    fireEvent.click(screen.getByText('Math 102'));

    // Check if the details of the first course are hidden
    details.forEach(detail => {
      expect(screen.queryByText(detail)).not.toBeInTheDocument();
    });

    // Check if the details of the second course are displayed
    details.forEach(detail => {
      expect(screen.getByText(detail)).toBeInTheDocument();
    });
  });
});
