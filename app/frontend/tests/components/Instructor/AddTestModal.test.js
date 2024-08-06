// app/frontend/tests/components/Instructor/AddTestModal.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddTestModal from '../../../src/components/Instructor/AddTestModal';
import { useTheme } from '../../../src/App';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn()
}));

describe('AddTestModal', () => {
  const onAddTest = jest.fn();
  const onClose = jest.fn();
  const courseId = 'test-course-id';

  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock alert
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'Sample Exam', questions: [], courseId, visibility: true }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AddTestModal correctly when open', () => {
    render(<AddTestModal isOpen={true} onClose={onClose} courseId={courseId} onAddTest={onAddTest} />);

    expect(screen.getByText('Add New Test')).toBeInTheDocument();
    expect(screen.getByLabelText('Exam Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Allow Students To View Answers?')).toBeInTheDocument();
  });

  test('does not render AddTestModal when closed', () => {
    render(<AddTestModal isOpen={false} onClose={onClose} courseId={courseId} onAddTest={onAddTest} />);

    expect(screen.queryByText('Add New Test')).not.toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<AddTestModal isOpen={true} onClose={onClose} courseId={courseId} onAddTest={onAddTest} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onAddTest with correct data when form is submitted', async () => {
    render(<AddTestModal isOpen={true} onClose={onClose} courseId={courseId} onAddTest={onAddTest} />);

    fireEvent.change(screen.getByLabelText('Exam Name'), { target: { value: 'Sample Exam' } });

    fireEvent.click(screen.getByText('Save Test'));

    await waitFor(() => {
      expect(onAddTest).toHaveBeenCalledWith({
        name: 'Sample Exam',
        questions: [],
        courseId,
        visibility: true,
      });
    });

    expect(onClose).toHaveBeenCalled();
  });
});
