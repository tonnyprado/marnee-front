import { useState } from 'react';
import { Key, Copy, Check, RefreshCw, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyAdminPassword, generateSecurePassword } from '../../services/adminSecurityApi';

export default function PasswordGeneratorPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [length, setLength] = useState(32);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);

    try {
      const result = await verifyAdminPassword(password);
      if (result.valid) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error al verificar contraseña');
    } finally {
      setVerifying(false);
    }
  };

  const handleGeneratePassword = async () => {
    setGenerating(true);
    setCopied(false);

    try {
      const result = await generateSecurePassword(length, includeSymbols);
      setGeneratedPassword(result.password);
      setShowGenerated(true);
    } catch (err) {
      setError('Error al generar contraseña');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-mn-lilac/20">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-mn-purple to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-mn-black">
                Área Restringida
              </h1>
              <p className="text-gray-600 text-center mt-2">
                Por seguridad, ingresa tu contraseña para acceder al generador de contraseñas
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-mn-lilac rounded-xl focus:ring-2 focus:ring-mn-purple focus:border-transparent transition-all"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={verifying || !password}
                className="w-full py-3 bg-gradient-to-r from-mn-purple to-purple-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Verificar e Ingresar
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Password Generator Screen
  return (
    <div className="p-8 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-mn-purple to-purple-600 bg-clip-text text-transparent">
            Generador de Contraseñas
          </h1>
          <p className="text-gray-600 mt-1">
            Genera contraseñas seguras para AWS y otros servicios
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-mn-lilac/20 mb-6">
          <h2 className="text-lg font-display font-semibold text-mn-black mb-4">
            Configuración
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud: {length} caracteres
              </label>
              <input
                type="range"
                min="16"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-mn-lilac/30 rounded-lg appearance-none cursor-pointer accent-mn-purple"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>16</span>
                <span>32</span>
                <span>48</span>
                <span>64</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mn-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mn-purple"></div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                Incluir símbolos (!@#$%^&*_+-=)
              </span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePassword}
          disabled={generating}
          className="w-full py-4 bg-gradient-to-r from-mn-purple to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all transform hover:scale-[1.02] font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mb-6"
        >
          {generating ? (
            <>
              <RefreshCw className="w-6 h-6 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Key size={24} />
              Generar Contraseña Segura
            </>
          )}
        </button>

        {/* Generated Password */}
        <AnimatePresence>
          {generatedPassword && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-mn-lilac/20"
            >
              <h2 className="text-lg font-display font-semibold text-mn-black mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Contraseña Generada
              </h2>

              <div className="relative">
                <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm break-all border border-gray-200">
                  {showGenerated ? generatedPassword : '•'.repeat(generatedPassword.length)}
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    onClick={() => setShowGenerated(!showGenerated)}
                    className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    title={showGenerated ? 'Ocultar' : 'Mostrar'}
                  >
                    {showGenerated ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-mn-purple to-purple-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    Copiada
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    Copiar Contraseña
                  </>
                )}
              </button>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  <strong>Importante:</strong> Esta contraseña no se guarda en ningún lugar.
                  Asegúrate de copiarla y guardarla en un lugar seguro antes de cerrar esta página.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
