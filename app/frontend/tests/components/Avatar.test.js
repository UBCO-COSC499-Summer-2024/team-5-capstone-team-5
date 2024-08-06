// app/frontend/tests/components/Avatar.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from '@components/Avatar';
import * as avatars from '@dicebear/avatars';
import * as style from '@dicebear/avatars-avataaars-sprites';

jest.mock('@dicebear/avatars');
jest.mock('@dicebear/avatars-avataaars-sprites');

describe('Avatar', () => {
  const mockAvatarSVG = '<svg>Mock Avatar</svg>';
  
  beforeEach(() => {
    avatars.createAvatar.mockReturnValue(mockAvatarSVG);
  });

  test('renders avatar with default size', () => {
    render(<Avatar options={{}} />);

    const imgElement = screen.getByAltText('Avatar');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(mockAvatarSVG)));
  });

  test('renders avatar with specified size', () => {
    const size = 256;
    render(<Avatar options={{}} size={size} />);

    const imgElement = screen.getByAltText('Avatar');
    expect(imgElement).toBeInTheDocument();
    expect(avatars.createAvatar).toHaveBeenCalledWith(style, { size, ...{} });
  });

  test('renders avatar with specified options', () => {
    const options = { mood: ['happy'] };
    render(<Avatar options={options} />);

    const imgElement = screen.getByAltText('Avatar');
    expect(imgElement).toBeInTheDocument();
    expect(avatars.createAvatar).toHaveBeenCalledWith(style, { size: 128, ...options });
  });
});
