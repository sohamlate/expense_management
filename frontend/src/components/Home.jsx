import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  CreditCard,
  PieChart,
  Users,
  Bot,
  Smartphone,
  BarChart3,
  Wallet,
  TrendingUp,
  Download,
  QrCode,
  MessageCircle,
  Shield,
  Zap,
  Eye
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signin');
  };

  // Features data
  const features = [
    {
      title: 'Add Expenses & Income',
      description: 'Easily track your daily expenses and income with our intuitive interface. Categorize transactions automatically.',
      icon: <Wallet className="w-8 h-8 text-blue-500" />
    },
    {
      title: 'Split Expenses',
      description: 'Split bills with friends and family effortlessly. Our smart algorithm calculates fair shares instantly.',
      icon: <Users className="w-8 h-8 text-green-500" />
    },
    {
      title: 'Razorpay Integration',
      description: 'Secure payments powered by Razorpay. Pay and receive money with multiple payment options.',
      icon: <CreditCard className="w-8 h-8 text-purple-500" />
    },
    {
      title: 'Budget Management',
      description: 'Set monthly budgets, track spending limits, and get alerts when you\'re close to your budget.',
      icon: <PieChart className="w-8 h-8 text-orange-500" />
    },
    {
      title: 'Transaction History',
      description: 'View detailed transaction history with filters, search, and export options for better financial tracking.',
      icon: <Eye className="w-8 h-8 text-teal-500" />
    },
    {
      title: 'Analytics & Graphs',
      description: 'Visualize your spending patterns with interactive charts and detailed financial analytics.',
      icon: <BarChart3 className="w-8 h-8 text-red-500" />
    }
  ];

  const telegramFeatures = [
    'Add expenses on the go',
    'Split bills with groups',
    'Check balance instantly',
    'Get spending alerts',
    'View transaction history',
    'Set budget reminders'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center text-xl font-bold text-blue-600">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-2 font-bold">
                  E
                </div>
                Expensesync
              </div>
            </div>

            <div className="hidden md:flex space-x-8">
              <span className="text-slate-600 cursor-default">Features</span>
              <span className="text-slate-600 cursor-default">Telegram Bot</span>
              <span className="text-slate-600 cursor-default">Analytics</span>
              <span className="text-slate-600 cursor-default">About</span>
            </div>

            <button
              onClick={handleGetStarted}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
                Smart Expense Management
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Manage Your{' '}
                <span className="text-blue-600">Expenses</span>{' '}
                Like Never Before
              </h1>

              <p className="text-xl text-slate-600 mb-8">
                Track expenses, split bills, manage budgets, and analyze spending patterns. 
                Now with Telegram bot integration and Razorpay payments.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all group"
                >
                  Start Managing Expenses
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <a
                  href="https://t.me/expense_mangement_telegrambot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Try Telegram Bot
                </a>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Secure with Razorpay
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  Real-time Sync
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Telegram Integration
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Monthly Overview</h3>
                    <span className="text-green-600 text-sm font-medium">+12.5%</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Income</span>
                      <span className="font-semibold text-green-600">₹45,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Total Expenses</span>
                      <span className="font-semibold text-red-600">₹32,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Savings</span>
                      <span className="font-semibold text-blue-600">₹12,500</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '72%'}}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">72% of budget used</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Powerful Features
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Everything You Need for Expense Management
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              From basic expense tracking to advanced analytics, our platform provides all the tools you need to take control of your finances.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Telegram Bot Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
                Telegram Integration
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                Manage Expenses on the Go with Our{' '}
                <span className="text-blue-600">Telegram Bot</span>
              </h2>

              <p className="text-lg text-slate-600 mb-8">
                Access all expense management features directly from Telegram. 
                Add expenses, split bills, check balances, and get insights without leaving your chat.
              </p>

              <div className="space-y-3 mb-8">
                {telegramFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://t.me/expense_mangement_telegrambot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Start Bot
                </a>
                <button className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download App
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-slate-600">Start using our Telegram bot instantly</p>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="bg-slate-100 p-4 rounded-xl">
                    <img 
                      src="https://res.cloudinary.com/dsy3ebkqc/image/upload/v1751807831/image_2025-07-06_18-46-44_sipls6.png"
                      alt="Telegram Bot QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-4">
                    Or click the button below to start directly
                  </p>
                  <a
                    href="https://t.me/expense_mangement_telegrambot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open in Telegram
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-green-50 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Analytics & Insights
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Understand Your Spending with Detailed Analytics
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Get comprehensive insights into your spending patterns with interactive charts, 
              budget tracking, and personalized financial recommendations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl"
            >
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Spending Trends</h3>
              <p className="text-slate-600">
                Track your spending patterns over time with detailed charts and graphs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl"
            >
              <PieChart className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Category Breakdown</h3>
              <p className="text-slate-600">
                See exactly where your money goes with detailed category analysis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl"
            >
              <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Budget Goals</h3>
              <p className="text-slate-600">
                Set and track budget goals with smart alerts and recommendations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Take Control of Your Expenses?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their finances smarter with our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-blue-50 transition-colors"
              >
                Get Started Free
              </button>
              <a
                href="https://t.me/expense_mangement_telegrambot"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 bg-white/10 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                <Bot className="w-5 h-5 mr-2" />
                Try Telegram Bot
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-2 font-bold">
                  E
                </div>
                <span className="text-xl font-bold text-white">ExpenseManager</span>
              </div>
              <p className="text-slate-400 mb-6">
                The smartest way to manage your expenses, split bills, and track your financial goals.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://t.me/expense_mangement_telegrambot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Bot className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Features</h3>
              <ul className="space-y-3">
                <li><span className="text-slate-400 cursor-default">Expense Tracking</span></li>
                <li><span className="text-slate-400 cursor-default">Bill Splitting</span></li>
                <li><span className="text-slate-400 cursor-default">Budget Management</span></li>
                <li><span className="text-slate-400 cursor-default">Analytics</span></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><span className="text-slate-400 cursor-default">Help Center</span></li>
                <li><span className="text-slate-400 cursor-default">Contact Us</span></li>
                <li><span className="text-slate-400 cursor-default">Privacy Policy</span></li>
                <li><span className="text-slate-400 cursor-default">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} ExpenseManager. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-sm text-slate-400 cursor-default">Powered by Razorpay</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}