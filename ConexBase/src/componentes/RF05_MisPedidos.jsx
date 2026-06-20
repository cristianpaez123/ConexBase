import { useState } from "react";

const ESTADO_CONFIG = {
  pendiente:  { label: "Pendiente",   color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  proceso:    { label: "En proceso",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  enviado:    { label: "Enviado",     color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  entregado:  { label: "Entregado",   color: "bg-green-100 text-green-800 border-green-200" },
  cancelado:  { label: "Cancelado",   color: "bg-red-100 text-red-800 border-red-200" },
};

const PEDIDOS_MOCK = [
  { id: "PED-001", producto: "Laptop Dell XPS 15", cantidad: 2, total: 3800000, estado: "entregado",  fecha: "2025-06-01", direccion: "Calle 80 #45-12, Bogotá" },
  { id: "PED-002", producto: "Monitor Samsung 27\"", cantidad: 1, total: 920000,  estado: "enviado",   fecha: "2025-06-10", direccion: "Carrera 7 #32-18, Bogotá" },
  { id: "PED-003", producto: "Teclado Mecánico Keychron", cantidad: 3, total: 690000, estado: "proceso",  fecha: "2025-06-14", direccion: "Av. 68 #21-40, Bogotá" },
  { id: "PED-004", producto: "Auriculares Sony WH-1000XM5", cantidad: 1, total: 1450000, estado: "pendiente", fecha: "2025-06-18", direccion: "Calle 100 #15-22, Bogotá" },
  { id: "PED-005", producto: "Silla Ergonómica Herman Miller", cantidad: 1, total: 4200000, estado: "cancelado", fecha: "2025-06-05", direccion: "Carrera 15 #88-60, Bogotá" },
];

function EstadoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || {};
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function ModalDetalle({ pedido, onClose }) {
  if (!pedido) return null;
  const steps = ["pendiente", "proceso", "enviado", "entregado"];
  const currentStep = steps.indexOf(pedido.estado);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{pedido.id}</h3>
            <p className="text-sm text-slate-500">{pedido.fecha}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Producto</p>
              <p className="font-semibold text-slate-800 text-sm">{pedido.producto}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Total</p>
              <p className="font-semibold text-slate-800 text-sm">${pedido.total.toLocaleString("es-CO")}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Cantidad</p>
              <p className="font-semibold text-slate-800 text-sm">{pedido.cantidad} unidad(es)</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-1">Estado</p>
              <EstadoBadge estado={pedido.estado} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-1">Dirección de entrega</p>
            <p className="text-sm text-slate-700">{pedido.direccion}</p>
          </div>

          {pedido.estado !== "cancelado" && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Seguimiento</p>
              <div className="flex items-center gap-0">
                {steps.map((step, i) => {
                  const done = i <= currentStep;
                  const cfg = ESTADO_CONFIG[step];
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className={`flex flex-col items-center`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}>
                          {done ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs mt-1 whitespace-nowrap ${done ? "text-blue-600 font-medium" : "text-slate-400"}`}>{cfg.label}</span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? "bg-blue-600" : "bg-slate-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="px-6 pb-5">
          <button onClick={onClose} className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RF05_MisPedidos() {
  const [pedidos] = useState(PEDIDOS_MOCK);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const pedidosFiltrados = pedidos.filter((p) => {
    const matchEstado = filtroEstado === "todos" || p.estado === filtroEstado;
    const matchBusqueda = p.producto.toLowerCase().includes(busqueda.toLowerCase()) || p.id.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  const totalesPorEstado = Object.fromEntries(
    Object.keys(ESTADO_CONFIG).map((e) => [e, pedidos.filter((p) => p.estado === e).length])
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Mis Pedidos</h1>
            <p className="text-sm text-slate-500">{pedidos.length} pedidos registrados</p>
          </div>
          <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo pedido
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {/* Tarjetas resumen */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(ESTADO_CONFIG).map(([estado, cfg]) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(filtroEstado === estado ? "todos" : estado)}
              className={`rounded-xl p-3 text-left border transition ${filtroEstado === estado ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50" : "bg-white border-slate-200 hover:border-slate-300"}`}
            >
              <p className="text-2xl font-bold text-slate-800">{totalesPorEstado[estado] || 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">{cfg.label}</p>
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por producto o número de pedido..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {pedidosFiltrados.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="font-semibold text-slate-600">No hay pedidos</p>
              <p className="text-sm text-slate-400 mt-1">Ajusta el filtro o crea un nuevo pedido</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pedido</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Producto</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Fecha</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Total</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4">
                      <span className="font-mono font-semibold text-blue-600 text-xs">{pedido.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{pedido.producto}</p>
                      <p className="text-xs text-slate-400">{pedido.cantidad} unidad(es)</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 hidden sm:table-cell">{pedido.fecha}</td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-800 hidden md:table-cell">
                      ${pedido.total.toLocaleString("es-CO")}
                    </td>
                    <td className="px-5 py-4">
                      <EstadoBadge estado={pedido.estado} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setPedidoSeleccionado(pedido)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ModalDetalle pedido={pedidoSeleccionado} onClose={() => setPedidoSeleccionado(null)} />
    </div>
  );
}
