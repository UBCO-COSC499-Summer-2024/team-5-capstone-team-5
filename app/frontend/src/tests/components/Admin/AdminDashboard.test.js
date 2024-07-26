import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';

describe('AdminDashboard Component', () => {
  test('renders AdminDashboard with logo and heading', () => {
    render(<AdminDashboard />)
    
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/gradeit.svg');

    const heading = screen.getByText('You are viewing the admin page');
    expect(heading).toBeInTheDocument();
  });
});