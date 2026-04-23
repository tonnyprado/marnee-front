import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users, LayoutDashboard, CreditCard, FileText,
  BarChart3, LogOut, Settings, Shield, Lock, Activity, AlertTriangle
} from 'lucide-react';
import { getAuthSession, setAuthSession } from '../services/api';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthSession(null);
    navigate('/auth');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/users', label: 'Usuarios', icon: Users },
    { path: '/admin/subscriptions', label: 'Suscripciones', icon: CreditCard },
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-mn-night text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-mn-purple">
          <h1 className="text-2xl font-display font-bold">Marnee Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Panel de administración</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-2
                  transition-colors duration-200
                  ${active
                    ? 'bg-mn-purple text-white'
                    : 'text-gray-300 hover:bg-mn-purple/50 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Security Section */}
          <div className="mt-6 mb-2 px-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Security
            </p>
          </div>
          {securityItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-2
                  transition-colors duration-200
                  ${active
                    ? 'bg-mn-purple text-white'
                    : 'text-gray-300 hover:bg-mn-purple/50 hover:text-white'
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
        <div className="p-4 border-t border-mn-purple">
          <div className="flex items-center gap-3 px-4 py-3 bg-mn-purple/30 rounded-lg mb-2">
            <Settings size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.name || session?.email}</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="
              w-full flex items-center justify-center gap-2 px-4 py-3
              bg-red-600 hover:bg-red-700 text-white rounded-lg
              transition-colors duration-200
            "
          >
            <LogOut size={18} />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
