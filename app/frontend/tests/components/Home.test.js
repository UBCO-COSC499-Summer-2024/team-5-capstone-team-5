// app/frontend/tests/components/Home.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@components/Home';
import { useTheme } from '@app/App';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('@app/App', () => ({
  useTheme: jest.fn(),
}));

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (theme = 'light') => {
    useTheme.mockReturnValue({ theme });
    return render(
      <Router>
        <Home />
      </Router>
    );
  };

  test('renders Home component with light theme', () => {
    renderComponent('light');

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('You are viewing the Home page')).toBeInTheDocument();
    const outerDiv = screen.getByText('You are viewing the Home page').closest('div').parentElement;
    expect(outerDiv).toHaveClass('bg-white', 'text-black');
  });

  test('renders Home component with dark theme', () => {
    renderComponent('dark');

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('You are viewing the Home page')).toBeInTheDocument();
    const outerDiv = screen.getByText('You are viewing the Home page').closest('div').parentElement;
    expect(outerDiv).toHaveClass('bg-black', 'text-white');
  });
});
