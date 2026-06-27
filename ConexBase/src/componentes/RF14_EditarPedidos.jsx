import { useState } from "react";

const ESTADOS = {
  pendiente: { label: "Pendiente",   color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  proceso:   { label: "En proceso",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  enviado:   { label: "Enviado",     color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  entregado: { label: "Entregado",   color: "bg-green-100 text-green-800 border-green-200" },
  cancelado: { label: "Cancelado",   color: "bg-red-100 text-red-800 border-red-200" },
};

const PEDIDOS_INICIALES = [
  { id: "PED-001", cliente: "María López",     producto: "Laptop Dell XPS 15",          cantidad: 2, precio: 1900000, estado: "entregado", fecha: "2025-06-01", notas: "Entrega urgente" },
  { id: "PED-002", cliente: "Carlos Méndez",   producto: "Monitor Samsung 27\"",         cantidad: 1, precio: 920000,  estado: "enviado",   fecha: "2025-06-10", notas: "" },
  { id: "PED-003", cliente: "Jorge Ramírez",   producto: "Teclado Mecánico Keychron",    cantidad: 3, precio: 230000,  estado: "proceso",   fecha: "2025-06-14", notas: "Sin switches clicky" },
  { id: "PED-004", cliente: "Luisa Fernández", producto: "Auriculares Sony WH-1000XM5",  cantidad: 1, precio: 1450000, estado: "pendiente", fecha: "2025-06-18", notas: "" },
  { id: "PED-005", cliente: "Pedro Vargas",    producto: "Silla Ergonómica Herman Miller",cantidad: 1, precio: 4200000, estado: "cancelado", fecha: "2025-06-05", notas: "Cancelado por cliente" },
];

function Badge({ estado }) {
  const cfg = ESTADOS[estado] || {};
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function ModalEditar({ pedido, onClose, onSave }) {
  const [form, setForm] = useState({
    cliente:  pedido.cliente,
    producto: pedido.producto,
    cantidad: pedido.cantidad,
    precio:   pedido.precio,
    estado:   pedido.estado,
    fecha:    pedido.fecha,
    notas:    pedido.notas,
  });
  const [errores, setErrores] = useState({});

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrores((e) => ({ ...e, [field]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.cliente.trim())         e.cliente  = "El cliente es obligatorio";
    if (!form.producto.trim())        e.producto = "El producto es obligatorio";
    if (!form.cantidad || form.cantidad < 1) e.cantidad = "Cantidad mínima: 1";
    if (!form.precio   || form.precio  < 0) e.precio   = "Precio inválido";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validar()) return;
    onSave({ ...pedido, ...form, cantidad: Number(form.cantidad), precio: Number(form.precio) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Editar pedido</h3>
            <p className="text-sm text-slate-500 font-mono">{pedido.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cliente</label>
            <input
              type="text"
              value={form.cliente}
              onChange={(e) => set("cliente", e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errores.cliente ? "border-red-300 bg-red-50" : "border-slate-200"}`}
              placeholder="Nombre del cliente"
            />
            {errores.cliente && <p className="text-xs text-red-500 mt-1">{errores.cliente}</p>}
          </div>

          {/* Producto */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Producto</label>
            <input
              type="text"
              value={form.producto}
              onChange={(e) => set("producto", e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errores.producto ? "border-red-300 bg-red-50" : "border-slate-200"}`}
              placeholder="Nombre del producto"
            />
            {errores.producto && <p className="text-xs text-red-500 mt-1">{errores.producto}</p>}
          </div>

          {/* Cantidad y Precio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cantidad</label>
              <input
                type="number"
                min="1"
                value={form.cantidad}
                onChange={(e) => set("cantidad", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errores.cantidad ? "border-red-300 bg-red-50" : "border-slate-200"}`}
              />
              {errores.cantidad && <p className="text-xs text-red-500 mt-1">{errores.cantidad}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Precio unitario (COP)</label>
              <input
                type="number"
                min="0"
                value={form.precio}
                onChange={(e) => set("precio", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errores.precio ? "border-red-300 bg-red-50" : "border-slate-200"}`}
              />
              {errores.precio && <p className="text-xs text-red-500 mt-1">{errores.precio}</p>}
            </div>
          </div>

          {/* Total calculado */}
          <div className="bg-blue-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">Total del pedido</span>
            <span className="text-lg font-bold text-blue-800">
              ${(Number(form.cantidad) * Number(form.precio)).toLocaleString("es-CO")}
            </span>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Estado del pedido</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ESTADOS).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => set("estado", key)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition text-center ${form.estado === key ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"}`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => set("fecha", e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Notas internas</label>
            <textarea
              value={form.notas}
              onChange={(e) => set("notas", e.target.value)}
              rows={3}
              placeholder="Observaciones sobre el pedido..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
          </div>
        </div>

        <div className="px-6 pb-5 flex gap-3 sticky bottom-0 bg-white border-t border-slate-100 pt-4">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition text-sm">
            Cancelar
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition text-sm">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RF14_EditarPedidos() {
  const [pedidos, setPedidos] = useState(PEDIDOS_INICIALES);
  const [editando, setEditando] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [toast, setToast] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);

  const showToast = (msg, tipo = "ok") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const matchEstado = filtroEstado === "todos" || p.estado === filtroEstado;
    const matchBusqueda =
      p.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.producto.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  const handleGuardar = (pedidoActualizado) => {
    setPedidos((ps) => ps.map((p) => p.id === pedidoActualizado.id ? pedidoActualizado : p));
    showToast(`Pedido ${pedidoActualizado.id} actualizado`);
    setEditando(null);
  };

  const handleEliminar = () => {
    const ids = confirmarEliminar === "seleccion" ? seleccionados : [confirmarEliminar.id];
    setPedidos((ps) => ps.filter((p) => !ids.includes(p.id)));
    setSeleccionados([]);
    showToast(`${ids.length} pedido(s) eliminado(s)`, "error");
    setConfirmarEliminar(null);
  };

  const toggleSeleccion = (id) => {
    setSeleccionados((s) => s.includes(id) ? s.filter((i) => i !== id) : [...s, id]);
  };

  const toggleTodos = () => {
    if (seleccionados.length === pedidosFiltrados.length) setSeleccionados([]);
    else setSeleccionados(pedidosFiltrados.map((p) => p.id));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 transition ${toast.tipo === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}>
          <span>{toast.tipo === "error" ? "✕" : "✓"}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Gestión de Pedidos</h1>
            <p className="text-sm text-slate-500">{pedidos.length} pedidos en total</p>
          </div>
          {seleccionados.length > 0 && (
            <button
              onClick={() => setConfirmarEliminar("seleccion")}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar ({seleccionados.length})
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar pedido, cliente o producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFiltroEstado("todos")}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${filtroEstado === "todos" ? "bg-slate-800 text-white border-slate-800" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
            >
              Todos
            </button>
            {Object.entries(ESTADOS).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFiltroEstado(key)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${filtroEstado === key ? "bg-slate-800 text-white border-slate-800" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={seleccionados.length === pedidosFiltrados.length && pedidosFiltrados.length > 0}
                    onChange={toggleTodos}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Pedido</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Producto</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <p className="font-semibold text-slate-500">No se encontraron pedidos</p>
                    <p className="text-sm text-slate-400 mt-1">Ajusta los filtros de búsqueda</p>
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((p) => (
                  <tr key={p.id} className={`hover:bg-slate-50 transition ${seleccionados.includes(p.id) ? "bg-blue-50" : ""}`}>
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={seleccionados.includes(p.id)}
                        onChange={() => toggleSeleccion(p.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <span className="font-mono font-semibold text-blue-600 text-xs">{p.id}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{p.fecha}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="font-medium text-slate-700">{p.cliente}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-slate-600">{p.producto}</span>
                      <p className="text-xs text-slate-400">x{p.cantidad}</p>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-800 hidden lg:table-cell">
                      ${(p.cantidad * p.precio).toLocaleString("es-CO")}
                    </td>
                    <td className="px-4 py-4">
                      <Badge estado={p.estado} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditando(p)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition"
                          title="Editar pedido"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setConfirmarEliminar(p)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                          title="Eliminar pedido"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer tabla */}
          {pedidosFiltrados.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {seleccionados.length > 0 ? `${seleccionados.length} seleccionado(s)` : `${pedidosFiltrados.length} pedido(s)`}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Total: ${pedidosFiltrados.reduce((acc, p) => acc + p.cantidad * p.precio, 0).toLocaleString("es-CO")} COP
              </p>
            </div>
          )}
        </div>
      </div>

      {editando && <ModalEditar pedido={editando} onClose={() => setEditando(null)} onSave={handleGuardar} />}

      {/* Modal eliminar */}
      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              {confirmarEliminar === "seleccion"
                ? `Eliminar ${seleccionados.length} pedido(s)`
                : `Eliminar ${confirmarEliminar.id}`}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Esta acción es permanente y no se puede deshacer.
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
