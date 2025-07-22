import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.newPassword.length < 6) {
      return setError('New password must be at least 6 characters long.');
    }

    if (form.newPassword !== form.confirmPassword) {
      return setError('New password and confirm password do not match.');
    }

    // Simulate API call
    setTimeout(() => {
      setMessage('Password changed successfully!');
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full   p-6">
         <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
          <FiLock className="w-6 h-6 text-blue-600" />
          Change Password
        </h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {message && <div className="text-green-500 mb-2">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
