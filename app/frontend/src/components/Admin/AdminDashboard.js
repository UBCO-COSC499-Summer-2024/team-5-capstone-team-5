// app/frontend/src/components/Admin/AdminDashboard.js
import React, { useState } from 'react';

const AdminDashboard = () => {
  return (
    <div className="flex-grow flex flex-col ml-64">
      <div className="flex-grow p-8">
        <div className="h-full content-center">
          <div className="flex items-center">
            <div className="flex flex-col gap-12">
              <img src="/gradeit.svg" alt="Logo" className="w-2/5 flex self-center mb-12" />
              <h1 className="flex self-center">You are viewing the admin page</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
