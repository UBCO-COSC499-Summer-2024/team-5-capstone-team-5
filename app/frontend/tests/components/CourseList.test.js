import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CourseList from 'components/CourseList';

const courses = [
  { id: 1, name: "Math 101", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 2, name: "Math 102", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 3, name: "Math 201", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 4, name: "Math 202", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 5, name: "Math 301", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 6, name: "Math 302", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 7, name: "Math 401", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
  { id: 8, name: "Math 402", details: ["Lecture 1", "Lecture 2", "Lecture 3"] },
];

describe('CourseList Component', () => {
  it('renders the course list', () => {
    render(<CourseList />);

    // Check if the course list title is rendered
    expect(screen.getByText('Courses')).toBeInTheDocument();

    // Check if the courses are rendered
    courses.forEach(course => {
      expect(screen.getByText(course.name)).toBeInTheDocument();
    });
  });

  it('toggles course details on click', () => {
    render(<CourseList />);

    // Simulate clicking on the first course
    const firstCourse = screen.getByText(courses[0].name);
    fireEvent.click(firstCourse);

    // Check if the details of the first course are displayed
    courses[0].details.forEach(detail => {
      expect(screen.getByText(detail)).toBeInTheDocument();
    });

    // Simulate clicking on the first course again to hide the details
    fireEvent.click(firstCourse);

    // Check if the details of the first course are hidden
    courses[0].details.forEach(detail => {
      expect(screen.queryByText(detail)).not.toBeInTheDocument();
    });
  });
});
