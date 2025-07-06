import React, { useState } from 'react';
import { DollarSign, Save, X } from 'lucide-react';
import axios from 'axios';

const Budgetpage = ({ budget, setBudget }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id || user; // Adjust depending on your backend
  console.log('User data:', userId);
  const [income, setIncome] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!income) return;
    try {
      setLoading(true);
      const response = await axios.post("https://expense-management-seven-plum.vercel.app/api/transaction/addbudget", {
        userId: userId,
        budget: parseFloat(income),
      });
      console.log('Budget response:', response.data);
      console.log('Budget saved:', { income: parseFloat(income) });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBudget(!budget);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-8">
          <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Set Your Monthly Budget</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!income || loading}
            className={`w-full flex items-center justify-center space-x-2 ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200`}
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Saving...' : 'Save Budget'}</span>
          </button>

          {saved && (
            <div className="text-center text-green-600 font-medium">
              Budget saved successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budgetpage;
