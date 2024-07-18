// src/App.test.js
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect';

test('renders You are viewing the Home page text', async () => {
  await act(async () => {
    render(<App />);
  });

  await waitFor(() => {
    const linkElement = screen.getByText(/You are viewing the Home page/i);
    expect(linkElement).toBeInTheDocument();
  });
});
