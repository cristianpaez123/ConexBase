import { useState } from "react";

const ROLES = {
  admin: { label: "Administrador", color: "bg-purple-100 text-purple-800" },
  supervisor: { label: "Supervisor", color: "bg-blue-100 text-blue-800" },
  cliente: { label: "Cliente", color: "bg-green-100 text-green-800" },
};

const MOCK_USERS = {
  "admin@empresa.com": { password: "admin123", role: "admin", name: "Ana García" },
  "supervisor@empresa.com": { password: "super123", role: "supervisor", name: "Carlos Méndez" },
  "cliente@empresa.com": { password: "cli123", role: "cliente", name: "María López" },
};

export default function RF01_Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const user = MOCK_USERS[email.toLowerCase()];
    if (!user || user.password !== password) {
      setError("Correo o contraseña incorrectos. Verifica tus credenciales.");
      setLoading(false);
      return;
    }

    const session = { email, role: user.role, name: user.name };
    setLoggedUser(session);
    setLoading(false);
    if (onLogin) onLogin(session);
  };

  const handleLogout = () => {
    setLoggedUser(null);
    setEmail("");
    setPassword("");
  };

  if (loggedUser) {
    const roleInfo = ROLES[loggedUser.role];
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
            {loggedUser.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">{loggedUser.name}</h2>
          <p className="text-slate-500 mb-4">{loggedUser.email}</p>
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${roleInfo.color} mb-6`}>
            {roleInfo.label}
          </span>
          <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Permisos de rol</p>
            {loggedUser.role === "admin" && (
              <ul className="space-y-1 text-sm text-slate-700">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Gestión completa de usuarios</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Ver y editar todos los pedidos</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Eliminar registros</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Configuración del sistema</li>
              </ul>
            )}
            {loggedUser.role === "supervisor" && (
              <ul className="space-y-1 text-sm text-slate-700">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Ver todos los pedidos</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Editar pedidos asignados</li>
                <li className="flex items-center gap-2"><span className="text-yellow-500">~</span> Gestión parcial de usuarios</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Eliminar registros</li>
              </ul>
            )}
            {loggedUser.role === "cliente" && (
              <ul className="space-y-1 text-sm text-slate-700">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Ver mis pedidos</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Crear nuevos pedidos</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Ver pedidos de otros</li>
                <li className="flex items-center gap-2"><span className="text-red-400">✗</span> Administración</li>
              </ul>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Sistema de Pedidos</h1>
          <p className="text-blue-300 text-sm mt-1">Ingresa con tu cuenta corporativa</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </>
              ) : "Ingresar"}
            </button>
          </form>

          {/* Demo hints */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">Cuentas de demostración</p>
            <div className="space-y-1.5">
              {Object.entries(MOCK_USERS).map(([email, u]) => (
                <button
                  key={email}
                  onClick={() => { setEmail(email); setPassword(u.password); }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between"
                >
                  <span className="text-xs text-slate-600">{email}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLES[u.role].color}`}>
                    {ROLES[u.role].label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
