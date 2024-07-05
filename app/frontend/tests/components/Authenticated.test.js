// app/frontend/tests/components/Authenticated.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Authenticated from '../../../src/components/Authenticated';

describe('Authenticated Component', () => {
  it('renders without crashing and displays the correct text', () => {
    render(
      <BrowserRouter>
        <Authenticated />
      </BrowserRouter>
    );

    // Check if the heading is rendered
    expect(screen.getByText('Congrats! You are authenticated!')).toBeInTheDocument();

    // Check if the link is rendered and has the correct text
    expect(screen.getByText('Click me to go to the home page')).toBeInTheDocument();
  });

  it('has a link that navigates to the home page', () => {
    render(
      <BrowserRouter>
        <Authenticated />
      </BrowserRouter>
    );

    // Check if the link href attribute is correct
    const link = screen.getByText('Click me to go to the home page').closest('a');
    expect(link).toHaveAttribute('href', '/');
  });
});
