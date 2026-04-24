import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Users, LayoutDashboard, CreditCard, FileText,
  BarChart3, LogOut, Settings, Shield, Lock, Activity, AlertTriangle, Sparkles, Brain
} from 'lucide-react';
import { getAuthSession, setAuthSession } from '../services/api';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import AdminTransition from './components/AdminTransition';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setAuthSession(null);
    navigate('/auth');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/users', label: 'Usuarios', icon: Users },
    { path: '/admin/subscriptions', label: 'Suscripciones', icon: CreditCard },
    { path: '/admin/marnee-training', label: 'Marnee Training', icon: Brain },
    { path: '/admin/seo', label: 'SEO', icon: FileText },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const securityItems = [
    { path: '/admin/security', label: 'Security Dashboard', icon: Shield, exact: true },
    { path: '/admin/security/audit-logs', label: 'Audit Logs', icon: Activity },
    { path: '/admin/security/sessions', label: 'Active Sessions', icon: Lock },
    { path: '/admin/security/alerts', label: 'Security Alerts', icon: AlertTriangle },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const session = getAuthSession();

  return (
    <div className="flex h-dvh bg-gradient-to-br from-mn-ice via-white to-mn-lilac/20">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-gradient-to-r from-mn-night to-mn-purple text-white flex items-center justify-between px-4 shadow-lg z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-mn-lilac to-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-mn-purple" />
          </div>
          <span className="text-lg font-display font-bold">Marnee</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-mn-lilac to-white rounded-full flex items-center justify-center">
            <Settings size={16} className="text-mn-purple" />
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-red-300 hover:text-red-100 transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop only */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-mn-night to-mn-purple text-white flex-col shadow-2xl relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-mn-purple/20 to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-mn-lilac to-white rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-mn-purple" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Marnee</h1>
              <p className="text-xs text-mn-lilac">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 relative z-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl mb-2
                  transition-all duration-300 transform
                  ${active
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm scale-105 border border-white/20'
                    : 'text-mn-lilac hover:bg-white/10 hover:text-white hover:scale-102 hover:translate-x-1'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Security Section */}
          <div className="mt-6 mb-3 px-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-mn-lilac" />
              <p className="text-xs font-semibold text-mn-lilac uppercase tracking-wider">
                Seguridad
              </p>
            </div>
          </div>
          {securityItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl mb-2
                  transition-all duration-300 transform
                  ${active
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm scale-105 border border-white/20'
                    : 'text-mn-lilac hover:bg-white/10 hover:text-white hover:scale-102 hover:translate-x-1'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info & logout */}
        <div className="p-4 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl mb-3 border border-white/10">
            <div className="w-10 h-10 bg-gradient-to-br from-mn-lilac to-white rounded-full flex items-center justify-center">
              <Settings size={20} className="text-mn-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{session?.name || session?.email}</p>
              <p className="text-xs text-mn-lilac">Administrador</p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="
              w-full flex items-center justify-center gap-2 px-4 py-3
              bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
              text-white rounded-xl shadow-lg hover:shadow-xl
              transition-all duration-300 transform hover:scale-105
              font-medium
            "
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto lg:pt-0 pt-14 pb-16 lg:pb-0">
        <AdminTransition>
          <Outlet />
        </AdminTransition>
      </main>

      {/* Bottom Tab Bar - Mobile only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-mn-night to-mn-purple border-t border-white/10 flex items-center justify-around px-2 z-40">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.exact);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                active
                  ? 'bg-white/20 text-white scale-105'
                  : 'text-mn-lilac/70 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}
