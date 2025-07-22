import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { MdPassword } from 'react-icons/md';
import { FaCheckDouble } from 'react-icons/fa';

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
      <div className="max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
          <FiLock className="w-6 h-6 text-teal-500" />
          Change Password
        </h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {message && <div className="text-green-500 mb-2">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 flex items-center gap-2">
              <MdPassword className="w-5 h-5 text-teal-500" />
              Current Password
            </label>
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
            <label className="block text-gray-700 mb-1 flex items-center gap-2">
              <MdPassword className="w-5 h-5 text-teal-500" />
              New Password
            </label>
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
            <label className="block text-gray-700 mb-1 flex items-center gap-2">
              <FaCheckDouble className="w-5 h-5 text-teal-500" />
              Confirm New Password
            </label>
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
            className="w-full bg-gradient-to-r bg-teal-500 text-dark py-3 px-4 rounded-lg hover:scale-105 hover:from-teal-400 hover:to-teal-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}