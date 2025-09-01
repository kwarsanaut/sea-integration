import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, DollarSign, Target, Activity, Zap, Eye, Settings } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const SeaUILDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userInsights, setUserInsights] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
        if (data.data.length > 0) {
          setSelectedUser(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserProfile = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`);
      const data = await response.json();
      if (data.success) {
        setUserProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    setLoading(false);
  };

  const fetchUserInsights = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/insights`);
      const data = await response.json();
      if (data.success) {
        setUserInsights(data.data);
      }
    } catch (error) {
      console.error('Error fetching user insights:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const executeActions = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Coordinated actions executed successfully across all Sea platforms!');
      }
    } catch (error) {
      console.error('Error executing actions:', error);
      alert('❌ Error executing actions');
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserProfile(selectedUser);
      fetchUserInsights(selectedUser);
    }
  }, [selectedUser]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSegmentColor = (segment) => {
    switch (segment) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'High Value': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Regular': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPersonaIcon = (persona) => {
    switch (persona) {
      case 'Hardcore Gamer': return '🎮';
      case 'Investor': return '💼';
      default: return '😊';
    }
  };

  const pieData = analytics ? [
    { name: 'VIP Users', value: analytics.vip_users, color: '#8B5CF6' },
    { name: 'Regular Users', value: analytics.regular_users, color: '#10B981' }
  ] : [];

  const revenueData = userProfile ? [
    { platform: 'Shopee', revenue: userProfile.shopee_profile.total_spent / 12, color: '#EF4444' },
    { platform: 'Garena', revenue: userProfile.garena_profile.monthly_spend, color: '#F59E0B' },
    { platform: 'SeaMoney', revenue: userProfile.seamoney_profile.avg_transaction * userProfile.seamoney_profile.monthly_transactions * 0.02, color: '#3B82F6' }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Sea Universal Integration Layer</h1>
                <p className="text-blue-100">AI-Powered Cross-Platform Intelligence Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-sm opacity-90">🚀 Live Demo</div>
              <div className="text-white font-semibold">Shopee × Garena × SeaMoney</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: Activity },
              { id: 'user-analysis', name: 'User Analysis', icon: Users },
              { id: 'insights', name: 'AI Insights', icon: Eye },
              { id: 'actions', name: 'Actions', icon: Target }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total_users.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">VIP Users</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.vip_users}</p>
                    <p className="text-sm text-purple-600">{analytics.vip_percentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.total_monthly_revenue)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-teal-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Revenue/User</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.avg_revenue_per_user)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Projection</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">Current Monthly Revenue</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(analytics.total_monthly_revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-700">Projected Annual Revenue</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(analytics.projected_annual_revenue)}</span>
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    💡 With UIL optimization: +35% revenue increase expected
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Analysis Tab */}
        {activeTab === 'user-analysis' && (
          <div className="space-y-6">
            {/* User Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select User for Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedUser === user.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSegmentColor(user.tier)}`}>
                        {user.tier}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* User Profile Analysis */}
            {userProfile && !loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Info & AI Insights */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 AI-Powered User Intelligence</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                      <span className="font-medium text-gray-700">User Value Score</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {userProfile.computed_insights.user_value_score.toFixed(1)}/100
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <span className="font-medium text-gray-700">Segment</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSegmentColor(userProfile.computed_insights.user_segment)}`}>
                        {userProfile.computed_insights.user_segment}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <span className="font-medium text-gray-700">Persona</span>
                      <span className="text-lg font-semibold text-yellow-700">
                        {getPersonaIcon(userProfile.computed_insights.persona)} {userProfile.computed_insights.persona}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <span className="font-medium text-gray-700">Monthly Revenue</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(userProfile.computed_insights.monthly_revenue_contribution)}
                      </span>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">Cross-sell Opportunity:</div>
                      <div className="text-sm text-gray-600">{userProfile.computed_insights.cross_sell_opportunity}</div>
                    </div>
                  </div>
                </div>

                {/* Platform Revenue Breakdown */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Cross-Platform Revenue</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Platform Details */}
            {userProfile && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Shopee */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-500">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <span className="text-red-600 font-bold">🏪</span>
                    </div>
                    <h4 className="ml-3 text-lg font-semibold text-gray-900">Shopee Profile</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Orders</span>
                      <span className="font-semibold">{userProfile.shopee_profile.total_orders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Spent</span>
                      <span className="font-semibold">{formatCurrency(userProfile.shopee_profile.total_spent)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Categories</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {userProfile.shopee_profile.favorite_categories.map((cat, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Latest Purchase</span>
                      <div className="text-sm font-medium">{userProfile.shopee_profile.recent_purchases[0]?.item}</div>
                    </div>
                  </div>
                </div>

                {/* Garena */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <span className="text-yellow-600 font-bold">🎮</span>
                    </div>
                    <h4 className="ml-3 text-lg font-semibold text-gray-900">Garena Profile</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rank</span>
                      <span className="font-semibold">{userProfile.garena_profile.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Spend</span>
                      <span className="font-semibold">{formatCurrency(userProfile.garena_profile.monthly_spend)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Game Hours</span>
                      <span className="font-semibold">{userProfile.garena_profile.total_game_hours}h</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Games</span>
                      <div className="mt-1 text-sm font-medium">
                        {userProfile.garena_profile.games_played.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SeaMoney */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <span className="text-blue-600 font-bold">💰</span>
                    </div>
                    <h4 className="ml-3 text-lg font-semibold text-gray-900">SeaMoney Profile</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Credit Score</span>
                      <span className="font-semibold">{userProfile.seamoney_profile.credit_score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Wallet Balance</span>
                      <span className="font-semibold">{formatCurrency(userProfile.seamoney_profile.wallet_balance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Investment Portfolio</span>
                      <span className="font-semibold">{formatCurrency(userProfile.seamoney_profile.investment_portfolio)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Transactions</span>
                      <span className="font-semibold">{userProfile.seamoney_profile.monthly_transactions}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔮 AI-Generated Cross-Platform Insights</h3>
              
              {userInsights.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Eye className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 capitalize">
                              {insight.insight_type.replace('_', ' ')}
                            </h4>
                            <div className="text-sm text-gray-600">
                              Confidence: {(insight.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Potential Revenue</div>
                          <div className="font-bold text-green-600">
                            {formatCurrency(insight.potential_revenue)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">Data Sources:</div>
                        <div className="flex space-x-2">
                          {insight.data_sources.map((source, idx) => (
                            <span key={idx} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              source === 'shopee' ? 'bg-red-100 text-red-800' :
                              source === 'garena' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-sm font-medium text-gray-700 mb-2">Recommendation:</div>
                        <div className="text-sm text-gray-600">{insight.recommendation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Eye className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No insights available</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a user to generate AI insights</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && selectedUser && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Coordinated Cross-Platform Actions</h3>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>UIL Magic:</strong> Execute coordinated actions across Shopee, Garena, and SeaMoney simultaneously!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Shopee Actions */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center mb-3">
                    <span className="text-red-600 font-bold text-lg">🏪</span>
                    <h4 className="ml-2 font-semibold text-red-800">Shopee Actions</h4>
                  </div>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li>✅ Show exclusive gaming deals (20% off)</li>
                    <li>✅ Priority access to new products</li>
                    <li>✅ VIP customer support activation</li>
                    <li>✅ Personalized recommendations</li>
                  </ul>
                </div>

                {/* Garena Actions */}
                <div className="border-2 border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-600 font-bold text-lg">🎮</span>
                    <h4 className="ml-2 font-semibold text-yellow-800">Garena Actions</h4>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li>✅ Exclusive gaming skins (Worth 500K)</li>
                    <li>✅ VIP tournament invitations</li>
                    <li>✅ Beta features early access</li>
                    <li>✅ Diamond tier rewards</li>
                  </ul>
                </div>

                {/* SeaMoney Actions */}
                <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center mb-3">
                    <span className="text-blue-600 font-bold text-lg">💰</span>
                    <h4 className="ml-2 font-semibold text-blue-800">SeaMoney Actions</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>✅ Gaming investment products</li>
                    <li>✅ Cashback bonus activation</li>
                    <li>✅ Premium advisory services</li>
                    <li>✅ Special equipment loans</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">📈 Expected Impact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+35%</div>
                    <div className="text-sm text-gray-600">Revenue Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">+60%</div>
                    <div className="text-sm text-gray-600">User Retention</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">+85%</div>
                    <div className="text-sm text-gray-600">Cross-platform Engagement</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => executeActions(selectedUser)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-105"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Execute Coordinated Actions
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  This will trigger actions across all Sea platforms simultaneously
                </p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Analyzing cross-platform data...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeaUILDashboard;
