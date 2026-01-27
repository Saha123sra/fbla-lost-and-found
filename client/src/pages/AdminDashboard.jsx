import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Package, Users, ClipboardList, BarChart3, CheckCircle, XCircle, Clock } from 'lucide-react';
import { adminAPI, claimsAPI } from '../services/api';
import toast from 'react-hot-toast';

// Image component with error fallback
const ItemImage = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <Package className="w-8 h-8 text-gray-400" />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded-lg"
      onError={() => setHasError(true)}
    />
  );
};

// Stats Overview Component
const StatsOverview = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="text-3xl font-bold text-navy-600">{stats.active_items || 0}</div>
      <div className="text-gray-600">Active Items</div>
    </div>
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="text-3xl font-bold text-orange-500">{stats.pending_claims || 0}</div>
      <div className="text-gray-600">Pending Claims</div>
    </div>
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="text-3xl font-bold text-green-600">{stats.claimed_items || 0}</div>
      <div className="text-gray-600">Returned Items</div>
    </div>
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="text-3xl font-bold text-purple-600">{stats.success_rate || 0}%</div>
      <div className="text-gray-600">Success Rate</div>
    </div>
  </div>
);

// Claims Management Component
const ClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [actionData, setActionData] = useState({ pickupDate: '', pickupTime: '', pickupLocation: 'Main Office', denialReason: '' });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await adminAPI.getClaims({ status: 'pending' });
      setClaims(response.data);
    } catch (error) {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (claimId, status) => {
    try {
      await claimsAPI.update(claimId, {
        status,
        pickupDate: actionData.pickupDate,
        pickupTime: actionData.pickupTime,
        pickupLocation: actionData.pickupLocation,
        denialReason: actionData.denialReason
      });
      toast.success(`Claim ${status}!`);
      setSelectedClaim(null);
      fetchClaims();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Claims ({claims.length})</h2>
      {claims.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
          No pending claims! All caught up.
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  <ItemImage src={claim.image_url} alt={claim.item_name} />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{claim.item_name}</h3>
                      <p className="text-sm text-gray-500">Claimed by: {claim.user_name} ({claim.user_email})</p>
                      <p className="text-sm text-gray-500">Student ID: {claim.user_student_id}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">Pending</span>
                  </div>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Proof of Ownership:</p>
                    <p className="text-sm text-gray-600">{claim.proof_description}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setSelectedClaim({ ...claim, action: 'approve' })}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => setSelectedClaim({ ...claim, action: 'deny' })}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Deny
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">
              {selectedClaim.action === 'approve' ? '✅ Approve Claim' : '❌ Deny Claim'}
            </h3>
            
            {selectedClaim.action === 'approve' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Date *</label>
                  <input type="date" value={actionData.pickupDate} onChange={(e) => setActionData({...actionData, pickupDate: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Time *</label>
                  <input type="time" value={actionData.pickupTime} onChange={(e) => setActionData({...actionData, pickupTime: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pickup Location *</label>
                  <input type="text" value={actionData.pickupLocation} onChange={(e) => setActionData({...actionData, pickupLocation: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Denial *</label>
                <textarea value={actionData.denialReason} onChange={(e) => setActionData({...actionData, denialReason: e.target.value})} rows={3} placeholder="Insufficient proof, description doesn't match..." className="w-full border rounded-lg px-3 py-2" />
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button onClick={() => setSelectedClaim(null)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={() => handleAction(selectedClaim.id, selectedClaim.action === 'approve' ? 'approved' : 'denied')}
                className={`flex-1 text-white py-2 rounded-lg ${selectedClaim.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Student Directory Component
const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await adminAPI.getStudents({});
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const searchLower = search.toLowerCase();
    return (
      student.first_name?.toLowerCase().includes(searchLower) ||
      student.last_name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.student_id?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <div className="text-center py-8">Loading students...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Student Directory ({students.length} students)</h2>
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy-500 outline-none"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          {search ? 'No students match your search' : 'No students registered yet'}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Student ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Grade</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Claims</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Items Reported</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{student.first_name} {student.last_name}</td>
                  <td className="px-6 py-4 text-gray-600">{student.student_id}</td>
                  <td className="px-6 py-4 text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-gray-600">{student.grade_level || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{student.total_claims || 0}</td>
                  <td className="px-6 py-4 text-gray-600">{student.items_reported || 0}</td>
                  <td className="px-6 py-4 text-gray-600">{new Date(student.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'claims', label: 'Claims', icon: ClipboardList },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'students', label: 'Students', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-navy-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-skyblue-300" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <StatsOverview stats={stats} />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition ${
                    activeTab === tab.id ? 'border-b-2 border-navy-600 text-navy-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'claims' && stats.pending_claims > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{stats.pending_claims}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-2">Welcome, Admin!</h2>
                <p className="text-gray-600 mb-4">You have {stats.pending_claims || 0} pending claims to review.</p>
                <button onClick={() => setActiveTab('claims')} className="bg-navy-600 text-white px-6 py-2 rounded-lg hover:bg-navy-700">
                  Review Claims
                </button>
              </div>
            )}
            {activeTab === 'claims' && <ClaimsManagement />}
            {activeTab === 'items' && (
              <div className="text-gray-500 text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                Item management coming soon...
              </div>
            )}
            {activeTab === 'students' && <StudentDirectory />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;