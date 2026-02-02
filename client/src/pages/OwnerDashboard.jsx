import React, { useState, useEffect } from 'react';
import { Crown, Users, Shield, CheckCircle, XCircle, Clock, Package, ClipboardList, UserX, UserCheck } from 'lucide-react';
import { ownerAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({});
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [denyReason, setDenyReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes, allRes] = await Promise.all([
        ownerAPI.getStats(),
        ownerAPI.getPendingAdmins(),
        ownerAPI.getAdmins()
      ]);
      setStats(statsRes.data.data || {});
      setPendingAdmins(pendingRes.data.data || []);
      setAllAdmins(allRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (admin) => {
    try {
      const response = await ownerAPI.approveAdmin(admin.id);
      toast.success(`Admin approved! Security code: ${response.data.data.securityCode}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to approve admin');
    }
  };

  const handleDeny = async () => {
    if (!selectedAdmin) return;

    try {
      await ownerAPI.denyAdmin(selectedAdmin.id, denyReason);
      toast.success('Admin registration denied');
      setSelectedAdmin(null);
      setDenyReason('');
      fetchData();
    } catch (error) {
      toast.error('Failed to deny admin');
    }
  };

  const handleDeactivate = async (admin) => {
    if (!window.confirm(`Deactivate admin ${admin.first_name} ${admin.last_name}?`)) return;

    try {
      await ownerAPI.deactivateAdmin(admin.id, 'Deactivated by owner');
      toast.success('Admin deactivated');
      fetchData();
    } catch (error) {
      toast.error('Failed to deactivate admin');
    }
  };

  const handleReactivate = async (admin) => {
    if (!window.confirm(`Reactivate admin ${admin.first_name} ${admin.last_name}?`)) return;

    try {
      const response = await ownerAPI.reactivateAdmin(admin.id);
      toast.success(`Admin reactivated! New security code: ${response.data.data.securityCode}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to reactivate admin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-navy-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-300" />
            <div>
              <h1 className="text-2xl font-bold">{t('owner.title')}</h1>
              <p className="text-purple-200 text-sm">{t('owner.siteAdmin')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-3xl font-bold text-orange-500">{stats.pending_admins || 0}</div>
            <div className="text-gray-600 text-sm">{t('owner.stats.pendingAdmins')}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-3xl font-bold text-green-600">{stats.active_admins || 0}</div>
            <div className="text-gray-600 text-sm">{t('owner.stats.activeAdmins')}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-3xl font-bold text-red-500">{stats.deactivated_admins || 0}</div>
            <div className="text-gray-600 text-sm">{t('owner.allAdmins.deactivated')}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-3xl font-bold text-blue-600">{stats.total_students || 0}</div>
            <div className="text-gray-600 text-sm">{t('admin.tabs.students')}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-3xl font-bold text-navy-600">{stats.active_items || 0}</div>
            <div className="text-gray-600 text-sm">{t('admin.stats.activeItems')}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending_claims || 0}</div>
            <div className="text-gray-600 text-sm">{t('admin.stats.pendingClaims')}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'pending'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clock className="w-4 h-4" />
              {t('owner.tabs.pendingAdmins')}
              {pendingAdmins.length > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingAdmins.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                activeTab === 'admins'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              {t('owner.tabs.allAdmins')}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-lg font-bold mb-4">{t('owner.pendingAdmins.title')}</h2>
                {pendingAdmins.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    {t('owner.pendingAdmins.noPending')}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAdmins.map((admin) => (
                      <div key={admin.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">
                              {admin.first_name} {admin.last_name}
                            </h3>
                            <p className="text-gray-600 text-sm">{t('owner.adminId')}: {admin.admin_id}</p>
                            <p className="text-gray-600 text-sm">{admin.email}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {t('owner.pendingAdmins.requestedOn')}: {new Date(admin.created_at).toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'hi' ? 'hi-IN' : language)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(admin)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {t('owner.pendingAdmins.approve')}
                            </button>
                            <button
                              onClick={() => setSelectedAdmin(admin)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              {t('owner.pendingAdmins.deny')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admins' && (
              <div>
                <h2 className="text-lg font-bold mb-4">{t('owner.allAdmins.title')}</h2>
                {allAdmins.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    {t('owner.allAdmins.noAdmins')}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('admin.students.columns.name')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('owner.adminId')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('admin.students.columns.email')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('itemDetail.status')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('owner.lastLogin')}</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('owner.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allAdmins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              {admin.first_name} {admin.last_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{admin.admin_id || admin.student_id}</td>
                            <td className="px-4 py-3 text-gray-600">{admin.email}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                admin.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : admin.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {admin.status === 'active' ? t('owner.allAdmins.active') :
                                 admin.status === 'pending' ? t('claims.status.pending') :
                                 t('owner.allAdmins.deactivated')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-sm">
                              {admin.last_login
                                ? new Date(admin.last_login).toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'hi' ? 'hi-IN' : language)
                                : t('owner.never')}
                            </td>
                            <td className="px-4 py-3">
                              {admin.status === 'active' && (
                                <button
                                  onClick={() => handleDeactivate(admin)}
                                  className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                                >
                                  <UserX className="w-4 h-4" />
                                  {t('owner.allAdmins.deactivate')}
                                </button>
                              )}
                              {admin.status === 'deactivated' && (
                                <button
                                  onClick={() => handleReactivate(admin)}
                                  className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  {t('owner.allAdmins.reactivate')}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deny Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">{t('owner.denyModal.title')}</h3>
            <p className="text-gray-600 mb-4">
              {t('owner.denyModal.denyingFor')}: <strong>{selectedAdmin.first_name} {selectedAdmin.last_name}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{t('owner.denyModal.reasonLabel')} ({t('common.optional')})</label>
              <textarea
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                rows={3}
                placeholder={t('owner.denyModal.reasonPlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedAdmin(null);
                  setDenyReason('');
                }}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeny}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                {t('owner.denyModal.denyButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
