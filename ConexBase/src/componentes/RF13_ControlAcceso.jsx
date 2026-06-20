import { useState, createContext, useContext } from "react";

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

function useAuth() {
  return useContext(AuthContext);
}

// ─── Roles y permisos ─────────────────────────────────────────────────────────
const ROLES = {
  admin: {
    label: "Administrador",
    color: "text-violet-400",
    bg: "bg-violet-500/15 border-violet-500/30",
    rutas: ["dashboard", "comisiones", "consolidado", "panel_financiero", "usuarios", "configuracion"],
  },
  financiero: {
    label: "Financiero",
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/30",
    rutas: ["dashboard", "comisiones", "consolidado", "panel_financiero"],
  },
  agente: {
    label: "Agente de ventas",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
    rutas: ["dashboard", "comisiones"],
  },
  auditor: {
    label: "Auditor",
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
    rutas: ["dashboard", "consolidado", "panel_financiero"],
  },
};

const USUARIOS_MOCK = [
  { id: 1, nombre: "Ana Martínez", email: "ana@empresa.co", rol: "admin", activo: true },
  { id: 2, nombre: "Pedro Soto", email: "pedro@empresa.co", rol: "financiero", activo: true },
  { id: 3, nombre: "Laura Gómez", email: "laura@empresa.co", rol: "agente", activo: true },
  { id: 4, nombre: "Jorge Castro", email: "jorge@empresa.co", rol: "auditor", activo: false },
];

const RUTAS_CONFIG = [
  { id: "dashboard", label: "Dashboard", icon: "◈", descripcion: "Vista general del sistema" },
  { id: "comisiones", label: "Comisiones (RF04)", icon: "◎", descripcion: "Cálculo y gestión de comisiones" },
  { id: "consolidado", label: "Consolidado (RF09)", icon: "◉", descripcion: "Información consolidada" },
  { id: "panel_financiero", label: "Panel Financiero (RF10)", icon: "◇", descripcion: "Administración financiera" },
  { id: "usuarios", label: "Usuarios", icon: "◈", descripcion: "Gestión de usuarios y roles" },
  { id: "configuracion", label: "Configuración", icon: "⚙", descripcion: "Configuración del sistema" },
];

// ─── Componente: Pantalla de login ────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    const usuario = USUARIOS_MOCK.find((u) => u.email === email);
    if (!usuario) {
      setError("Usuario no encontrado. Usa uno de los emails sugeridos.");
      return;
    }
    if (!usuario.activo) {
      setError("Esta cuenta está desactivada. Contacta al administrador.");
      return;
    }
    setError("");
    onLogin(usuario);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-xs font-mono tracking-widest text-rose-400 uppercase">RF13</span>
          <h1 className="text-2xl font-bold text-white mt-1">Control de Acceso</h1>
          <p className="text-slate-400 text-sm mt-1">Autenticación por rol</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="usuario@empresa.co"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-rose-500 hover:bg-rose-400 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            Ingresar
          </button>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-2">Usuarios de prueba:</p>
            <div className="space-y-1">
              {USUARIOS_MOCK.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setEmail(u.email)}
                  className="w-full text-left flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <span className="text-xs text-slate-300">{u.email}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] ${ROLES[u.rol].color}`}>{ROLES[u.rol].label}</span>
                    {!u.activo && <span className="text-[10px] text-red-400">· inactivo</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente: Pantalla de acceso denegado ──────────────────────────────────
function AccesoDenegado({ ruta, onVolver }) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">⛔</div>
        <h2 className="text-xl font-bold text-white mb-2">Acceso denegado</h2>
        <p className="text-slate-400 text-sm mb-1">
          No tienes permisos para acceder a <span className="text-white font-medium">{ruta}</span>.
        </p>
        <p className="text-slate-500 text-xs mb-6">Contacta al administrador si necesitas acceso a esta sección.</p>
        <button
          onClick={onVolver}
          className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

// ─── Componente: Ruta protegida ───────────────────────────────────────────────
function ProtectedRoute({ rutaId, children, onDenied }) {
  const { usuario } = useAuth();
  const rol = ROLES[usuario.rol];
  const tieneAcceso = rol.rutas.includes(rutaId);
  if (!tieneAcceso) return <AccesoDenegado ruta={RUTAS_CONFIG.find((r) => r.id === rutaId)?.label} onVolver={onDenied} />;
  return children;
}

// ─── Contenido de rutas ───────────────────────────────────────────────────────
function ContenidoRuta({ ruta }) {
  const { usuario } = useAuth();
  const info = RUTAS_CONFIG.find((r) => r.id === ruta);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-1">{info?.label}</h2>
      <p className="text-slate-400 text-sm mb-6">{info?.descripcion}</p>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center text-slate-400 text-sm">
        Contenido de <span className="text-white font-medium">{info?.label}</span> visible para el rol{" "}
        <span className={`font-semibold ${ROLES[usuario.rol].color}`}>{ROLES[usuario.rol].label}</span>
      </div>
    </div>
  );
}

// ─── Componente: Sidebar ──────────────────────────────────────────────────────
function Sidebar({ rutaActiva, onNavegar, onLogout }) {
  const { usuario } = useAuth();
  const rol = ROLES[usuario.rol];

  return (
    <div className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-5 border-b border-slate-800">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-mono mb-0.5">RF13 · Control de Acceso</p>
        <p className="text-sm font-semibold text-white">{usuario.nombre}</p>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border mt-1 inline-block ${rol.bg} ${rol.color}`}>
          {rol.label}
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {RUTAS_CONFIG.map((ruta) => {
          const tieneAcceso = rol.rutas.includes(ruta.id);
          const activa = rutaActiva === ruta.id;
          return (
            <button
              key={ruta.id}
              onClick={() => onNavegar(ruta.id)}
              disabled={false}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                activa
                  ? "bg-rose-500 text-white"
                  : tieneAcceso
                  ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "text-slate-600 hover:bg-slate-800/50 cursor-pointer"
              }`}
            >
              <span className="text-base">{ruta.icon}</span>
              <span className="flex-1">{ruta.label}</span>
              {!tieneAcceso && (
                <span className="text-[10px] bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded">🔒</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          ← Cerrar sesión
        </button>
      </div>
    </div>
  );
}

// ─── Componente: Matrix de permisos ──────────────────────────────────────────
function MatrizPermisos() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-1">Matriz de permisos</h2>
      <p className="text-slate-400 text-sm mb-6">Acceso por rol y ruta</p>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wide">
                <th className="text-left px-5 py-3">Ruta</th>
                {Object.entries(ROLES).map(([key, r]) => (
                  <th key={key} className={`text-center px-4 py-3 ${r.color}`}>{r.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RUTAS_CONFIG.map((ruta) => (
                <tr key={ruta.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3 text-slate-200">{ruta.label}</td>
                  {Object.entries(ROLES).map(([key, rol]) => (
                    <td key={key} className="px-4 py-3 text-center">
                      {rol.rutas.includes(ruta.id) ? (
                        <span className="text-emerald-400 text-base">✓</span>
                      ) : (
                        <span className="text-slate-700 text-base">✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── App principal ────────────────────────────────────────────────────────────
export default function RF13_ControlAcceso() {
  const [usuario, setUsuario] = useState(null);
  const [rutaActiva, setRutaActiva] = useState("dashboard");
  const [mostrarMatriz, setMostrarMatriz] = useState(false);

  if (!usuario) {
    return <LoginScreen onLogin={setUsuario} />;
  }

  return (
    <AuthContext.Provider value={{ usuario }}>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
        <Sidebar
          rutaActiva={rutaActiva}
          onNavegar={(r) => { setRutaActiva(r); setMostrarMatriz(false); }}
          onLogout={() => setUsuario(null)}
        />
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <div className="border-b border-slate-800 px-6 py-3 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>RF13</span>
              <span className="text-slate-600">/</span>
              <span className="text-white">{RUTAS_CONFIG.find((r) => r.id === rutaActiva)?.label}</span>
            </div>
            <button
              onClick={() => setMostrarMatriz(!mostrarMatriz)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              {mostrarMatriz ? "← Volver" : "Ver matriz de permisos"}
            </button>
          </div>

          {/* Contenido */}
          <div className="flex-1">
            {mostrarMatriz ? (
              <MatrizPermisos />
            ) : (
              <ProtectedRoute rutaId={rutaActiva} onDenied={() => setRutaActiva("dashboard")}>
                <ContenidoRuta ruta={rutaActiva} />
              </ProtectedRoute>
            )}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
