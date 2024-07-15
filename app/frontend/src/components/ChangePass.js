// app/frontend/src/components/ChangePass.js
import React, { useState } from 'react';
import ChangePassword from '../hooks/ChangePassword';

const ChangePass = (props) => {
  const userId = props.id;
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ChangePassword(userId, oldPass, newPass);
  };

  return (
    <form onSubmit={props.onSubmit || handleSubmit}>
      <label htmlFor="oldPass">Old Password</label>
      <input id="oldPass" name="oldPass" type="text" onChange={(e) => setOldPass(e.target.value)} />
      <label htmlFor="newPass">New Password</label>
      <input id="newPass" name="newPass" type="text" onChange={(e) => setNewPass(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ChangePass;
