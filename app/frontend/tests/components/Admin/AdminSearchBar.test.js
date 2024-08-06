// app/frontend/tests/components/Admin/AdminSearchBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useTheme } from '../../../src/App';
import SearchBar from '../../../src/components/Admin/AdminSearchBar';

jest.mock('../../../src/App', () => ({
  useTheme: jest.fn()
}));

describe('SearchBar', () => {
  test('renders SearchBar component with light theme', () => {
    useTheme.mockReturnValue({ theme: 'light' });

    render(<SearchBar onSearch={jest.fn()} />);

    const inputElement = screen.getByPlaceholderText('Search');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-300');
  });

  test('renders SearchBar component with dark theme', () => {
    useTheme.mockReturnValue({ theme: 'dark' });

    render(<SearchBar onSearch={jest.fn()} />);

    const inputElement = screen.getByPlaceholderText('Search');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-600');
  });

  test('calls onSearch prop when input value changes', () => {
    useTheme.mockReturnValue({ theme: 'light' });

    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    const inputElement = screen.getByPlaceholderText('Search');
    fireEvent.change(inputElement, { target: { value: 'test' } });

    expect(onSearchMock).toHaveBeenCalledWith('test');
  });
});
