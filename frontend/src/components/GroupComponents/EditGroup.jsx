import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const EditGroup = ({ group, editform, setEditForm, user }) => {
  
  const userId = user?._id || '';
  const groupId = group._id || '';
  
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    members: [],
    groupId: group._id,
    createdBy: userId
  });
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');


  const extractEmail = (member) => {
    if (typeof member === 'string') {
      return member;
    }
    if (member && typeof member === 'object') {
      return member.email || '';
    }
    return '';
  };

  
  useEffect(() => {
    if (group) {
    
      const memberEmails = group.members ? 
        group.members
          .map(member => extractEmail(member))
          .filter(email => email && email.trim() !== '') 
        : [];

      setGroupData({
        name: group.name || '',
        description: group.description || '',
        members: memberEmails, 
        groupId: group._id || groupId,
        createdBy: group.createdBy || userId
      });
    }
  }, [group, userId, groupId]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData(prev => ({ ...prev, [name]: value }));
  };


  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


  const handleAddEmail = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email cannot be empty');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();


    if (groupData.members.some(memberEmail => 
      memberEmail.toLowerCase() === trimmedEmail
    )) {
      setError('This email is already added');
      return;
    }

  
    setGroupData(prev => ({
      ...prev,
      members: [...prev.members, email.trim()]
    }));

    setEmail('');
    setError('');
  };


  const handleRemoveEmail = (emailToRemove) => {
    setGroupData(prev => ({
      ...prev,
      members: prev.members.filter(memberEmail => memberEmail !== emailToRemove)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!groupData.name.trim()) {
      setError('Group name is required');
      return;
    }

    if (groupData.members.length === 0) {
      setError('Please add at least one member');
      return;
    }

    try {
      console.log("Sending group data:", groupData);
      
      const response = await axios.put(
        `https://expense-management-seven-plum.vercel.app/api/group/${group._id}`,
        {
          ...groupData,
          name: groupData.name.trim(),
          description: groupData.description.trim(),
      
          members: [...new Set(groupData.members.filter(email => 
            email && email.trim() && isValidEmail(email.trim())
          ))]
        }
      );
      
      console.log('Update response:', response);

      setError('');
      alert('Group updated successfully!');
      setEditForm(false);
    } catch (err) {
      console.error('Error updating group:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update group. Please try again.');
      }
    }
  };


  const renderMemberItem = (memberEmail, index) => {
    if (!memberEmail || typeof memberEmail !== 'string') {
      return null;
    }

    return (
      <li key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg mb-2">
        <div className="flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 text-white">
            {memberEmail.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-700">{memberEmail}</span>
        </div>
        <button 
          onClick={() => handleRemoveEmail(memberEmail)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
          type="button"
          aria-label={`Remove ${memberEmail}`}
        >
          <X size={18} />
        </button>
      </li>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="max-h-90vh animate-fade-in w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-poppins text-2xl font-bold text-gray-800">
              Edit Group
            </h2>
            <button
              onClick={() => setEditForm(false)}
              className="bg-red-500 text-white rounded-full p-1 hover:scale-110 hover:bg-red-600 transition-all duration-150 cursor-pointer focus:outline-none"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="font-poppins">
            <div className="mb-5">
              <label
                className="mb-2 block font-medium text-gray-700"
                htmlFor="name"
              >
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={groupData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="mb-5">
              <label
                className="mb-2 block font-medium text-gray-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={groupData.description}
                onChange={handleChange}
                className="h-24 w-full resize-none rounded-lg border border-gray-300 p-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group description"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block font-medium text-gray-700">
                Members <span className="text-red-500">*</span>
              </label>
              <div className="mb-2 flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow rounded-l-lg border border-gray-300 p-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddEmail(e);
                    }
                  }}
                />
                <button
                  onClick={handleAddEmail}
                  type="button"
                  className="rounded-r-lg bg-blue-600 px-4 py-3 font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add
                  </div>
                </button>
              </div>
              
              {error && (
                <p className="text-sm text-red-500 mt-1 mb-2">{error}</p>
              )}
              
              <p className="text-sm text-gray-500 mb-3">
                Add email addresses of group members
              </p>

           
              {groupData.members && groupData.members.length > 0 ? (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Current Members ({groupData.members.length}):
                  </h3>
                  <ul className="space-y-1 max-h-48 overflow-y-auto">
                    {groupData.members.map((memberEmail, index) => 
                      renderMemberItem(memberEmail, index)
                    )}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No members in this group</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditForm(false)}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={groupData.members.length === 0 || !groupData.name.trim()}
              >
                Update Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGroup;