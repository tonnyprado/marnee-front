import { X, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function LogoutConfirmModal({ onConfirm, onCancel }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      onConfirm();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-mn-night/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-scaleIn">
        {isLoggingOut ? (
          // Logging out animation
          <div className="p-12 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-mn-purple to-mn-lilac rounded-full flex items-center justify-center animate-pulse">
                <LogOut className="w-10 h-10 text-white animate-bounce" />
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-mn-black mb-2">
              Cerrando sesión...
            </h3>
            <p className="text-gray-600">
              Hasta pronto
            </p>
          </div>
        ) : (
          // Confirmation dialog
          <>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-mn-black">
                  Cerrar sesión
                </h3>
                <button
                  onClick={onCancel}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                ¿Estás seguro de que deseas cerrar sesión del panel de administración?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-mn-purple to-purple-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
