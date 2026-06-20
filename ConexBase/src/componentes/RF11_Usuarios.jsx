import { useState } from "react";

const ROLES = {
  admin:       { label: "Administrador", color: "bg-purple-100 text-purple-800 border-purple-200" },
  supervisor:  { label: "Supervisor",    color: "bg-blue-100 text-blue-800 border-blue-200" },
  cliente:     { label: "Cliente",       color: "bg-green-100 text-green-800 border-green-200" },
};

const ESTADOS_USER = {
  activo:   { label: "Activo",   color: "bg-emerald-100 text-emerald-700" },
  inactivo: { label: "Inactivo", color: "bg-slate-100 text-slate-500" },
  bloqueado:{ label: "Bloqueado",color: "bg-red-100 text-red-700" },
};

const USUARIOS_MOCK = [
  { id: 1, nombre: "Ana García",      email: "ana@empresa.com",        rol: "admin",      estado: "activo",   creado: "2024-01-15", pedidos: 0  },
  { id: 2, nombre: "Carlos Méndez",   email: "carlos@empresa.com",     rol: "supervisor", estado: "activo",   creado: "2024-02-08", pedidos: 12 },
  { id: 3, nombre: "María López",     email: "maria@empresa.com",      rol: "cliente",    estado: "activo",   creado: "2024-03-22", pedidos: 5  },
  { id: 4, nombre: "Jorge Ramírez",   email: "jorge@empresa.com",      rol: "cliente",    estado: "inactivo", creado: "2024-04-10", pedidos: 2  },
  { id: 5, nombre: "Luisa Fernández", email: "luisa@empresa.com",      rol: "supervisor", estado: "activo",   creado: "2024-05-01", pedidos: 8  },
  { id: 6, nombre: "Pedro Vargas",    email: "pedro@empresa.com",      rol: "cliente",    estado: "bloqueado",creado: "2024-05-18", pedidos: 1  },
];

function Avatar({ nombre, size = "md" }) {
  const initials = nombre.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-indigo-500"];
  const color = colors[nombre.charCodeAt(0) % colors.length];
  const sizeClass = size === "lg" ? "w-10 h-10 text-base" : "w-8 h-8 text-sm";
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}>
      {initials}
    </div>
  );
}

function ModalUsuario({ usuario, onClose, onSave }) {
  const esNuevo = !usuario.id;
  const [form, setForm] = useState({
    nombre: usuario.nombre || "",
    email:  usuario.email  || "",
    rol:    usuario.rol    || "cliente",
    estado: usuario.estado || "activo",
  });

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">{esNuevo ? "Nuevo usuario" : "Editar usuario"}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Nombre y apellido"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="usuario@empresa.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rol</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ROLES).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => handleChange("rol", key)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium border transition ${form.rol === key ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ESTADOS_USER).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => handleChange("estado", key)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium border transition ${form.estado === key ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition text-sm">
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.nombre || !form.email}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-medium transition text-sm"
          >
            {esNuevo ? "Crear usuario" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RF11_Usuarios() {
  const [usuarios, setUsuarios] = useState(USUARIOS_MOCK);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [modalUsuario, setModalUsuario] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const matchRol = filtroRol === "todos" || u.rol === filtroRol;
    const matchBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) || u.email.toLowerCase().includes(busqueda.toLowerCase());
    return matchRol && matchBusqueda;
  });

  const handleSave = (form) => {
    if (modalUsuario.id) {
      setUsuarios((us) => us.map((u) => u.id === modalUsuario.id ? { ...u, ...form } : u));
      showToast("Usuario actualizado correctamente");
    } else {
      const nuevo = { id: Date.now(), ...form, creado: new Date().toISOString().split("T")[0], pedidos: 0 };
      setUsuarios((us) => [nuevo, ...us]);
      showToast("Usuario creado correctamente");
    }
    setModalUsuario(null);
  };

  const handleEliminar = () => {
    setUsuarios((us) => us.filter((u) => u.id !== confirmarEliminar.id));
    showToast("Usuario eliminado", "error");
    setConfirmarEliminar(null);
  };

  const stats = {
    total: usuarios.length,
    activos: usuarios.filter((u) => u.estado === "activo").length,
    admins: usuarios.filter((u) => u.rol === "admin").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}>
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Gestión de Usuarios</h1>
            <p className="text-sm text-slate-500">{stats.total} usuarios · {stats.activos} activos</p>
          </div>
          <button
            onClick={() => setModalUsuario({})}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Nuevo usuario
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total usuarios", value: stats.total, icon: "👥" },
            { label: "Activos",        value: stats.activos, icon: "✅" },
            { label: "Administradores",value: stats.admins,  icon: "🔑" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{s.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex gap-2">
            {["todos", ...Object.keys(ROLES)].map((rol) => (
              <button
                key={rol}
                onClick={() => setFiltroRol(rol)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${filtroRol === rol ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
              >
                {rol === "todos" ? "Todos" : ROLES[rol].label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Usuario</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Rol</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Estado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Creado</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar nombre={u.nombre} />
                      <div>
                        <p className="font-semibold text-slate-800">{u.nombre}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ROLES[u.rol]?.color}`}>
                      {ROLES[u.rol]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADOS_USER[u.estado]?.color}`}>
                      {ESTADOS_USER[u.estado]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 hidden lg:table-cell">{u.creado}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setModalUsuario(u)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmarEliminar(u)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalUsuario && (
        <ModalUsuario usuario={modalUsuario} onClose={() => setModalUsuario(null)} onSave={handleSave} />
      )}

      {/* Modal confirmación eliminar */}
      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Eliminar usuario</h3>
            <p className="text-slate-500 text-sm mb-6">
              ¿Seguro que quieres eliminar a <strong>{confirmarEliminar.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarEliminar(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition text-sm">
                Cancelar
              </button>
              <button onClick={handleEliminar} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition text-sm">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
