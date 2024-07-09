import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Authenticated from 'components/Authenticated';

describe('Authenticated Component', () => {
  it('renders the authenticated message', () => {
    render(<Authenticated />);

    // Check if the heading is rendered
    expect(screen.getByText('Congrats! You are authenticated!')).toBeInTheDocument();
  });

  it('renders the home page link', () => {
    render(<Authenticated />);

    // Check if the link is rendered and has the correct href attribute
    const linkElement = screen.getByText('Click me to go to the home page');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/');
  });
});
