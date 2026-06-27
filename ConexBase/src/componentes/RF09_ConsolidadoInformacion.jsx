import { useState, useMemo } from "react";

const DATOS_MOCK = [
  { id: 1, agente: "Laura Gómez", region: "Bogotá", producto: "Plan Empresarial", ventas: 45200000, comision: 3616000, meta: 50000000, mes: "Mayo 2025" },
  { id: 2, agente: "Carlos Ríos", region: "Medellín", producto: "Plan Básico", ventas: 28700000, comision: 1435000, meta: 30000000, mes: "Mayo 2025" },
  { id: 3, agente: "Valentina Cruz", region: "Cali", producto: "Plan Premium", ventas: 61500000, comision: 7380000, meta: 60000000, mes: "Mayo 2025" },
  { id: 4, agente: "Andrés Torres", region: "Barranquilla", producto: "Plan Estándar", ventas: 33100000, comision: 2648000, meta: 40000000, mes: "Mayo 2025" },
  { id: 5, agente: "Marcela Pérez", region: "Bogotá", producto: "Plan Premium", ventas: 55800000, comision: 6696000, meta: 55000000, mes: "Mayo 2025" },
  { id: 6, agente: "Felipe Naranjo", region: "Medellín", producto: "Plan Empresarial", ventas: 22300000, comision: 1784000, meta: 35000000, mes: "Mayo 2025" },
  { id: 7, agente: "Sofía Herrera", region: "Cali", producto: "Plan Básico", ventas: 18900000, comision: 945000, meta: 20000000, mes: "Mayo 2025" },
  { id: 8, agente: "Diego Morales", region: "Bucaramanga", producto: "Plan Estándar", ventas: 41600000, comision: 3328000, meta: 40000000, mes: "Mayo 2025" },
];

const REGIONES = ["Todas", ...new Set(DATOS_MOCK.map((d) => d.region))];
const PRODUCTOS = ["Todos", ...new Set(DATOS_MOCK.map((d) => d.producto))];

function formatCOP(v) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);
}

function BarMeta({ ventas, meta }) {
  const pct = Math.min(100, (ventas / meta) * 100);
  const color = pct >= 100 ? "bg-emerald-500" : pct >= 75 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-700 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-mono w-10 text-right ${pct >= 100 ? "text-emerald-400" : pct >= 75 ? "text-amber-400" : "text-red-400"}`}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

export default function RF09_ConsolidadoInformacion() {
  const [region, setRegion] = useState("Todas");
  const [producto, setProducto] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState({ campo: "ventas", dir: "desc" });

  const filtrados = useMemo(() => {
    let datos = DATOS_MOCK.filter((d) => {
      const matchRegion = region === "Todas" || d.region === region;
      const matchProd = producto === "Todos" || d.producto === producto;
      const matchBus = d.agente.toLowerCase().includes(busqueda.toLowerCase());
      return matchRegion && matchProd && matchBus;
    });

    datos.sort((a, b) => {
      const diff = a[orden.campo] < b[orden.campo] ? -1 : 1;
      return orden.dir === "asc" ? diff : -diff;
    });
    return datos;
  }, [region, producto, busqueda, orden]);

  const totales = useMemo(
    () => ({
      ventas: filtrados.reduce((s, d) => s + d.ventas, 0),
      comisiones: filtrados.reduce((s, d) => s + d.comision, 0),
      meta: filtrados.reduce((s, d) => s + d.meta, 0),
    }),
    [filtrados]
  );

  function toggleOrden(campo) {
    setOrden((prev) => ({
      campo,
      dir: prev.campo === campo && prev.dir === "desc" ? "asc" : "desc",
    }));
  }

  const SortIcon = ({ campo }) => {
    if (orden.campo !== campo) return <span className="text-slate-600">↕</span>;
    return <span className="text-indigo-400">{orden.dir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">RF09</span>
          <h1 className="text-3xl font-bold text-white mt-1">Consolidado de Información</h1>
          <p className="text-slate-400 text-sm mt-1">Vista unificada de ventas, metas y comisiones por agente</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total ventas", valor: formatCOP(totales.ventas), color: "text-indigo-400" },
            { label: "Total comisiones", valor: formatCOP(totales.comisiones), color: "text-emerald-400" },
            { label: "Cumplimiento meta", valor: `${((totales.ventas / totales.meta) * 100).toFixed(1)}%`, color: totales.ventas >= totales.meta ? "text-emerald-400" : "text-amber-400" },
          ].map((k) => (
            <div key={k.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-400 mb-1">{k.label}</p>
              <p className={`text-2xl font-bold font-mono ${k.color}`}>{k.valor}</p>
              <p className="text-xs text-slate-500 mt-1">{filtrados.length} agentes</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-5">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar agente..."
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
            />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {REGIONES.map((r) => <option key={r}>{r}</option>)}
            </select>
            <select
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {PRODUCTOS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wide">
                  <th className="text-left px-5 py-4">Agente</th>
                  <th className="text-left px-5 py-4">Región</th>
                  <th className="text-left px-5 py-4">Producto</th>
                  <th
                    className="text-right px-5 py-4 cursor-pointer hover:text-white select-none"
                    onClick={() => toggleOrden("ventas")}
                  >
                    Ventas <SortIcon campo="ventas" />
                  </th>
                  <th
                    className="text-right px-5 py-4 cursor-pointer hover:text-white select-none"
                    onClick={() => toggleOrden("comision")}
                  >
                    Comisión <SortIcon campo="comision" />
                  </th>
                  <th className="text-left px-5 py-4 w-44">Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-800/20"}`}
                  >
                    <td className="px-5 py-4 font-medium text-white">{d.agente}</td>
                    <td className="px-5 py-4 text-slate-300">{d.region}</td>
                    <td className="px-5 py-4">
                      <span className="bg-indigo-500/15 text-indigo-300 text-xs px-2 py-0.5 rounded-full">{d.producto}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-slate-200">{formatCOP(d.ventas)}</td>
                    <td className="px-5 py-4 text-right font-mono text-emerald-400 font-semibold">{formatCOP(d.comision)}</td>
                    <td className="px-5 py-4">
                      <BarMeta ventas={d.ventas} meta={d.meta} />
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No hay registros con estos filtros
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
