import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';
import { ThemeContext } from '../../App';

describe('SearchBar Component', () => {
  test('renders SearchBar and responds to input', () => {
    const handleSearch = jest.fn();
    render(
      <ThemeContext.Provider value={{ theme: 'light' }}>
        <SearchBar onSearch={handleSearch} />
      </ThemeContext.Provider>
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleSearch).toHaveBeenCalledWith('test');
  });
});
