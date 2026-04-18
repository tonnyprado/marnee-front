import React from 'react';
import { Link } from 'react-router-dom';

/**
 * TestChatLink - Botón flotante para acceder al test chat
 * Solo aparece en desarrollo para testing
 */
export default function TestChatLink() {
  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    // En producción, mostrar siempre (temporal para testing)
    // Comentar esta línea después de las pruebas:
    // return null;
  }

  return (
    <Link
      to="/testeando-chat"
      className="fixed bottom-4 left-4 z-50 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 border-4 border-yellow-600"
    >
      <span className="text-2xl">🧪</span>
      <div className="text-left">
        <div className="text-xs uppercase tracking-wide">Testing</div>
        <div className="text-sm font-black">Nuevo Chat</div>
      </div>
    </Link>
  );
}
