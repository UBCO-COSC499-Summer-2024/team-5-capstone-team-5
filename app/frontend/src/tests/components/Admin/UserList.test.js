import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from '../components/Admin/UserList';
import getAllUsers from '../hooks/GetAllUsers';
import changeUserRole from '../hooks/changeUserRole';

jest.mock('../hooks/GetAllUsers');
jest.mock('../hooks/changeUserRole');

describe('UserList Component', () => {
  beforeEach(() => {
    getAllUsers.mockResolvedValue([
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', role: 1 },
      { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', role: 2 },
    ]);
  });

  test('renders user list and allows role change', async () => {
    render(<UserList />);
    
    const userRows = await screen.findAllByRole('row');
    
    expect(userRows).toHaveLength(3); 

    const johnRow = screen.getByText('John Doe');
    expect(johnRow).toBeInTheDocument();

    const janeRow = screen.getByText('Jane Doe');
    expect(janeRow).toBeInTheDocument();

    const selectElements = screen.getAllByRole('combobox');
    expect(selectElements).toHaveLength(2);

    fireEvent.change(selectElements[0], { target: { value: '2' } });
    expect(changeUserRole).toHaveBeenCalledWith(1, 2);
  });
});