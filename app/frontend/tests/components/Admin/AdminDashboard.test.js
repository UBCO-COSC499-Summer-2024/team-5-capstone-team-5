// app/frontend/tests/components/Admin/AdminDashboard.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminDashboard from '../../../src/components/Admin/AdminDashboard';

describe('AdminDashboard', () => {
  test('renders AdminDashboard component', () => {
    render(<AdminDashboard />);
    
    // Check if the image is rendered
    const logoImage = screen.getByAltText('Logo');
    expect(logoImage).toBeInTheDocument();
    
    // Check if the heading is rendered
    const heading = screen.getByText('You are viewing the admin page');
    expect(heading).toBeInTheDocument();
  });
});
