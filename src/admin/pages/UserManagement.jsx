import { useEffect, useState } from 'react';
import { Search, Edit, Trash2, Key, Shield, Lock, UserPlus } from 'lucide-react';
import {
  getUsers,
  searchUsers,
  createUser,
  updateUser,
  updateUserRole,
  changeUserPassword,
  deleteUser,
} from '../../services/adminApi';
import UserSecurityModal from '../components/UserSecurityModal';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [passwordModal, setPasswordModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [securityModal, setSecurityModal] = useState(null);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers(page, 20);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }

    try {
      setLoading(true);
      const data = await searchUsers(searchQuery);
      setUsers(data);
    } catch (err) {
      console.error('Error searching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data) => {
    try {
      await createUser(data);
      setCreateModal(false);
      loadUsers();
      alert('Usuario creado correctamente');
    } catch (err) {
      alert('Error creando usuario: ' + err.message);
    }
  };

  const handleUpdateUser = async (userId, data) => {
    try {
      await updateUser(userId, data);
      setEditModal(null);
      loadUsers();
    } catch (err) {
      alert('Error actualizando usuario: ' + err.message);
    }
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      setRoleModal(null);
      loadUsers();
    } catch (err) {
      alert('Error actualizando rol: ' + err.message);
    }
  };

  const handleChangePassword = async (userId, newPassword) => {
    try {
      await changeUserPassword(userId, newPassword);
      setPasswordModal(null);
      alert('Contraseña actualizada correctamente');
    } catch (err) {
      alert('Error cambiando contraseña: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setDeleteModal(null);
      loadUsers();
    } catch (err) {
      alert('Error eliminando usuario: ' + err.message);
    }
  };

  const getRoleBadgeColor = (role) => {
    return role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600 mt-2">Administra los usuarios de la plataforma</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setCreateModal(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <UserPlus size={20} />
            Crear Usuario
          </button>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90 transition-colors"
          >
            Buscar
          </button>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); loadUsers(); }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-mn-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadUsers}
              className="px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90"
            >
              Reintentar
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se encontraron usuarios
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Creación</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => setSecurityModal(user)}
                        className="text-indigo-600 hover:text-indigo-800 mr-3"
                        title="Security Details"
                      >
                        <Lock size={18} />
                      </button>
                      <button
                        onClick={() => setEditModal(user)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setRoleModal(user)}
                        className="text-purple-600 hover:text-purple-800 mr-3"
                        title="Cambiar rol"
                      >
                        <Shield size={18} />
                      </button>
                      <button
                        onClick={() => setPasswordModal(user)}
                        className="text-orange-600 hover:text-orange-800 mr-3"
                        title="Cambiar contraseña"
                      >
                        <Key size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteModal(user)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <Modal
          title="Editar Usuario"
          onClose={() => setEditModal(null)}
        >
          <EditUserForm
            user={editModal}
            onSave={(data) => handleUpdateUser(editModal.id, data)}
            onCancel={() => setEditModal(null)}
          />
        </Modal>
      )}

      {/* Role Modal */}
      {roleModal && (
        <Modal
          title="Cambiar Rol"
          onClose={() => setRoleModal(null)}
        >
          <RoleChangeForm
            user={roleModal}
            onSave={(role) => handleUpdateRole(roleModal.id, role)}
            onCancel={() => setRoleModal(null)}
          />
        </Modal>
      )}

      {/* Password Modal */}
      {passwordModal && (
        <Modal
          title="Cambiar Contraseña"
          onClose={() => setPasswordModal(null)}
        >
          <PasswordChangeForm
            user={passwordModal}
            onSave={(password) => handleChangePassword(passwordModal.id, password)}
            onCancel={() => setPasswordModal(null)}
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <Modal
          title="Eliminar Usuario"
          onClose={() => setDeleteModal(null)}
        >
          <DeleteUserForm
            user={deleteModal}
            onConfirm={() => handleDeleteUser(deleteModal.id)}
            onCancel={() => setDeleteModal(null)}
          />
        </Modal>
      )}

      {/* Security Modal */}
      {securityModal && (
        <UserSecurityModal
          userId={securityModal.id}
          open={!!securityModal}
          onClose={() => setSecurityModal(null)}
          onUpdate={loadUsers}
        />
      )}

      {/* Create User Modal */}
      {createModal && (
        <Modal
          title="Crear Nuevo Usuario"
          onClose={() => setCreateModal(false)}
        >
          <CreateUserForm
            onSave={handleCreateUser}
            onCancel={() => setCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Edit User Form
function EditUserForm({ user, onSave, onCancel }) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => onSave({ name, email })}
          className="flex-1 px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90"
        >
          Guardar
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Role Change Form
function RoleChangeForm({ user, onSave, onCancel }) {
  const [role, setRole] = useState(user.role);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Usuario: <strong>{user.email}</strong>
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Rol</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => onSave(role)}
          className="flex-1 px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90"
        >
          Cambiar Rol
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Password Change Form
function PasswordChangeForm({ user, onSave, onCancel }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    onSave(password);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Usuario: <strong>{user.email}</strong>
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90"
        >
          Cambiar Contraseña
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Delete User Form
function DeleteUserForm({ user, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        ¿Estás seguro de que deseas eliminar el usuario <strong>{user.email}</strong>?
      </p>
      <p className="text-sm text-red-600 font-medium">
        Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-3 pt-4">
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Eliminar
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Create User Form
function CreateUserForm({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('El nombre es requerido');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Email inválido');
      return;
    }
    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    onSave({ name, email, password, role });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          placeholder="Nombre completo"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          placeholder="correo@ejemplo.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          placeholder="Mínimo 8 caracteres"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Crear Usuario
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
