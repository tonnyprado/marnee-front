import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FileText, ExternalLink } from 'lucide-react';
import {
  getSeoSettings,
  createSeoSettings,
  updateSeoSettings,
  deleteSeoSettings,
} from '../../services/adminApi';

export default function SeoManagement() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSeoSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error loading SEO settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await createSeoSettings(data);
      setCreateModal(false);
      loadSettings();
    } catch (err) {
      alert('Error creando configuración SEO: ' + err.message);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateSeoSettings(id, data);
      setEditModal(null);
      loadSettings();
    } catch (err) {
      alert('Error actualizando SEO: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSeoSettings(id);
      setDeleteModal(null);
      loadSettings();
    } catch (err) {
      alert('Error eliminando configuración: ' + err.message);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Gestión de SEO</h1>
        <p className="text-gray-600 mt-2">
          Configura meta tags y SEO para cada página de la plataforma
        </p>
      </div>

      {/* Create Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90 transition-colors"
        >
          <Plus size={18} />
          Nueva Configuración
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-mn-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando configuraciones...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadSettings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      ) : settings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="mb-4">No hay configuraciones SEO creadas</p>
          <button
            onClick={() => setCreateModal(true)}
            className="px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90"
          >
            Crear Primera Configuración
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settings.map((setting) => (
            <div key={setting.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={18} className="text-mn-purple" />
                    <h3 className="font-semibold text-gray-900">{setting.pagePath}</h3>
                    <a
                      href={setting.pagePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-mn-purple"
                      title="Ver página"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  {setting.title && (
                    <p className="text-sm text-gray-600">{setting.title}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditModal(setting)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteModal(setting)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 text-sm">
                {setting.description && (
                  <div>
                    <span className="font-medium text-gray-700">Description: </span>
                    <span className="text-gray-600">{setting.description}</span>
                  </div>
                )}

                {setting.keywords && (
                  <div>
                    <span className="font-medium text-gray-700">Keywords: </span>
                    <span className="text-gray-600">{setting.keywords}</span>
                  </div>
                )}

                {(setting.ogTitle || setting.ogDescription) && (
                  <div className="pt-3 border-t">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Open Graph
                    </div>
                    {setting.ogTitle && (
                      <div className="mb-1">
                        <span className="font-medium text-gray-700">OG Title: </span>
                        <span className="text-gray-600">{setting.ogTitle}</span>
                      </div>
                    )}
                    {setting.ogDescription && (
                      <div>
                        <span className="font-medium text-gray-700">OG Description: </span>
                        <span className="text-gray-600">{setting.ogDescription}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Robots: <span className="font-medium">{setting.robots}</span>
                  </span>
                  <span className="text-gray-400">
                    {new Date(setting.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {createModal && (
        <Modal title="Nueva Configuración SEO" onClose={() => setCreateModal(false)}>
          <SeoForm
            onSave={handleCreate}
            onCancel={() => setCreateModal(false)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editModal && (
        <Modal title="Editar Configuración SEO" onClose={() => setEditModal(null)}>
          <SeoForm
            setting={editModal}
            onSave={(data) => handleUpdate(editModal.id, data)}
            onCancel={() => setEditModal(null)}
          />
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <Modal title="Eliminar Configuración" onClose={() => setDeleteModal(null)}>
          <DeleteConfirm
            setting={deleteModal}
            onConfirm={() => handleDelete(deleteModal.id)}
            onCancel={() => setDeleteModal(null)}
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
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white">
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

// SEO Form Component
function SeoForm({ setting, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    pagePath: setting?.pagePath || '',
    title: setting?.title || '',
    description: setting?.description || '',
    keywords: setting?.keywords || '',
    ogTitle: setting?.ogTitle || '',
    ogDescription: setting?.ogDescription || '',
    ogImageUrl: setting?.ogImageUrl || '',
    canonicalUrl: setting?.canonicalUrl || '',
    robots: setting?.robots || 'index, follow',
  });

  const handleSubmit = () => {
    if (!formData.pagePath.trim()) {
      alert('La ruta de la página es requerida');
      return;
    }
    if (!formData.pagePath.startsWith('/')) {
      alert('La ruta debe comenzar con /');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="space-y-4">
      {/* Page Path */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ruta de la Página *
        </label>
        <input
          type="text"
          value={formData.pagePath}
          onChange={(e) => setFormData({ ...formData, pagePath: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          placeholder="/ruta/de/la/pagina"
          disabled={!!setting} // No editable if editing
        />
        <p className="text-xs text-gray-500 mt-1">
          Ejemplo: /, /presentation, /app/calendar
        </p>
      </div>

      {/* Basic Meta */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título (Title Tag)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            placeholder="Título de la página"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.title.length}/60 caracteres (óptimo: 50-60)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (Meta Description)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            rows={3}
            placeholder="Descripción de la página"
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/160 caracteres (óptimo: 120-160)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keywords (Meta Keywords)
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>
      </div>

      {/* Open Graph */}
      <div className="pt-4 border-t">
        <h4 className="font-semibold text-gray-900 mb-3">Open Graph (Redes Sociales)</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OG Title
            </label>
            <input
              type="text"
              value={formData.ogTitle}
              onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
              placeholder="Título para compartir en redes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OG Description
            </label>
            <textarea
              value={formData.ogDescription}
              onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
              rows={2}
              placeholder="Descripción para compartir en redes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OG Image URL
            </label>
            <input
              type="url"
              value={formData.ogImageUrl}
              onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recomendado: 1200x630px
            </p>
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div className="pt-4 border-t">
        <h4 className="font-semibold text-gray-900 mb-3">Avanzado</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canonical URL
            </label>
            <input
              type="url"
              value={formData.canonicalUrl}
              onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
              placeholder="https://ejemplo.com/pagina-canonica"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Robots Meta Tag
            </label>
            <select
              value={formData.robots}
              onChange={(e) => setFormData({ ...formData, robots: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            >
              <option value="index, follow">index, follow (Indexar y seguir enlaces)</option>
              <option value="noindex, follow">noindex, follow (No indexar, seguir enlaces)</option>
              <option value="index, nofollow">index, nofollow (Indexar, no seguir enlaces)</option>
              <option value="noindex, nofollow">noindex, nofollow (No indexar, no seguir)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90"
        >
          {setting ? 'Actualizar' : 'Crear'}
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

// Delete Confirm Component
function DeleteConfirm({ setting, onConfirm, onCancel }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        ¿Estás seguro de que deseas eliminar la configuración SEO para <strong>{setting.pagePath}</strong>?
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
