// app/frontend/tests/components/Flip.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Flip from '@components/Flip';
import { useTheme } from '@app/App';

jest.mock('@app/App', () => ({
  useTheme: jest.fn(),
}));

const mockCourse = {
  course_id: '1',
  department: 'CS',
  code: '101',
  section: '1',
  description: 'Intro to Computer Science',
  start_date: '2023-01-01T00:00:00Z',
  end_date: '2023-06-01T00:00:00Z',
};

const mockOnFlip = jest.fn();
const mockOnSave = jest.fn();

describe('Flip', () => {
  beforeEach(() => {
    useTheme.mockReturnValue({ theme: 'light' });
    jest.clearAllMocks();
  });

  const renderComponent = (flipped = false) => render(
    <Flip
      course={mockCourse}
      flipped={flipped}
      onFlip={mockOnFlip}
      onSave={mockOnSave}
    />
  );

  test('renders front card with course details', () => {
    renderComponent();

    expect(screen.getByText('CS 101-001')).toBeInTheDocument();
    const introText = screen.getAllByText('Intro to Computer Science');
    expect(introText[0]).toBeInTheDocument();
    expect(screen.getByText('Ends: 2023-06-01')).toBeInTheDocument();
  });

  test('renders back card with edit form when flipped', () => {
    renderComponent(true);

    expect(screen.getByLabelText('Edit Department')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit Section')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit End Date')).toBeInTheDocument();
  });

  test('handles input changes on back card', async () => {
    renderComponent(true);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Edit Department'), { target: { value: 'IT' } });
      fireEvent.change(screen.getByLabelText('Edit Code'), { target: { value: '102' } });
      fireEvent.change(screen.getByLabelText('Edit Section'), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText('Edit Description'), { target: { value: 'Advanced Computer Science' } });
      fireEvent.change(screen.getByLabelText('Edit Start Date'), { target: { value: '2023-02-01' } });
      fireEvent.change(screen.getByLabelText('Edit End Date'), { target: { value: '2023-07-01' } });
    });

    expect(screen.getByLabelText('Edit Department').value).toBe('IT');
    expect(screen.getByLabelText('Edit Code').value).toBe('102');
    expect(screen.getByLabelText('Edit Section').value).toBe('2');
    expect(screen.getByLabelText('Edit Description').value).toBe('Advanced Computer Science');
    expect(screen.getByLabelText('Edit Start Date').value).toBe('2023-02-01');
    expect(screen.getByLabelText('Edit End Date').value).toBe('2023-07-01');
  });

  test('calls onSave and onFlip when save button is clicked', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Course updated successfully' }),
      })
    );

    renderComponent(true);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Edit Department'), { target: { value: 'IT' } });
      fireEvent.click(screen.getByText('Save'));
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith('1', expect.objectContaining({ department: 'IT' }));
      expect(mockOnFlip).toHaveBeenCalledWith('1');
    });

    global.fetch.mockRestore();
  });

  
});
