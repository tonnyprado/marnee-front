// src/components/InstagramRequirementsModal.jsx
import React from 'react';
import { X, CheckCircle2, AlertTriangle, ExternalLink, Camera } from 'lucide-react';

/**
 * Instagram Requirements Modal
 *
 * Explains requirements for connecting Instagram to Marnee
 * Shows step-by-step instructions for users
 */
const InstagramRequirementsModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Conecta tu Instagram a Marnee</h2>
              <p className="text-purple-100">
                Marnee analizará tu cuenta para darte recomendaciones personalizadas
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Important Notice */}
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Requisitos Importantes
                </h3>
                <p className="text-sm text-yellow-800">
                  Para conectar tu Instagram a Marnee, tu cuenta debe cumplir con los siguientes requisitos:
                </p>
              </div>
            </div>
          </div>

          {/* Requirements List */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  1. Cuenta Business o Creator de Instagram
                </h4>
                <p className="text-sm text-gray-600">
                  Tu cuenta debe ser de tipo <strong>Business</strong> o <strong>Creator</strong>.
                  Las cuentas personales no tienen acceso a la API.
                </p>
                <a
                  href="https://help.instagram.com/502981923235522"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 mt-2"
                >
                  Cómo cambiar a cuenta Business
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  2. Facebook Page conectada
                </h4>
                <p className="text-sm text-gray-600">
                  Tu Instagram Business debe estar conectado a una <strong>Facebook Page</strong>.
                  Meta requiere esta conexión para acceder a los datos.
                </p>
                <a
                  href="https://www.facebook.com/business/help/898752960195806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 mt-2"
                >
                  Cómo conectar Instagram a Facebook Page
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  3. Rol de administrador en la Facebook Page
                </h4>
                <p className="text-sm text-gray-600">
                  Debes ser <strong>administrador</strong> de la Facebook Page para autorizar la conexión.
                </p>
              </div>
            </div>
          </div>

          {/* What Marnee will access */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Qué datos accederá Marnee:
            </h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Información de perfil (nombre, bio, seguidores)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Métricas de rendimiento (alcance, engagement, impresiones)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Demografía de audiencia (ciudades, países, edad, género)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Publicaciones recientes y sus estadísticas</span>
              </li>
            </ul>
          </div>

          {/* Privacy Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              🔒 Tu privacidad es importante
            </h3>
            <p className="text-sm text-blue-800">
              Marnee solo accederá a datos analíticos para darte recomendaciones personalizadas.
              <strong> No publicaremos nada en tu cuenta</strong> sin tu autorización explícita.
              Puedes desconectar tu cuenta en cualquier momento.
            </p>
          </div>

          {/* Steps */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Qué sucederá al conectar:
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-semibold flex-shrink-0 text-xs">
                  1
                </span>
                <span>Serás redirigido a Meta (Facebook) para autorizar la conexión</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-semibold flex-shrink-0 text-xs">
                  2
                </span>
                <span>Seleccionarás la Facebook Page conectada a tu Instagram</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-semibold flex-shrink-0 text-xs">
                  3
                </span>
                <span>Autorizarás los permisos de lectura (solo lectura, no publicación)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 font-semibold flex-shrink-0 text-xs">
                  4
                </span>
                <span>Regresarás a Marnee con tu cuenta conectada</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-medium flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Conectar Instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramRequirementsModal;
