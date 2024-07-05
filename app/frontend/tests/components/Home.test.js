// app/frontend/tests/components/Home.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../../src/components/Home';

describe('Home Component', () => {
  it('renders without crashing and displays the home page content', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Check if the logo is rendered
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/gradeit.svg');

    // Check if the heading is rendered
    expect(screen.getByText('You are viewing the Home page')).toBeInTheDocument();
  });
});
