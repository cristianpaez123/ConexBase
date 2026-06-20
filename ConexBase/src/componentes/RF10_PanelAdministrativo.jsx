import { useState } from "react";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
const DATOS_MENSUALES = [
  { mes: "Ene", ingresos: 142000000, egresos: 95000000, comisiones: 9800000 },
  { mes: "Feb", ingresos: 168000000, egresos: 102000000, comisiones: 12100000 },
  { mes: "Mar", ingresos: 135000000, egresos: 88000000, comisiones: 8700000 },
  { mes: "Abr", ingresos: 195000000, egresos: 118000000, comisiones: 15200000 },
  { mes: "May", ingresos: 221000000, egresos: 134000000, comisiones: 18600000 },
  { mes: "Jun", ingresos: 178000000, egresos: 109000000, comisiones: 13900000 },
];

const TRANSACCIONES = [
  { id: "TXN-001", concepto: "Pago comisión – Laura Gómez", tipo: "egreso", monto: 3616000, estado: "pagado", fecha: "15/05/2025" },
  { id: "TXN-002", concepto: "Ingreso venta Plan Premium", tipo: "ingreso", monto: 61500000, estado: "confirmado", fecha: "14/05/2025" },
  { id: "TXN-003", concepto: "Pago comisión – Valentina Cruz", tipo: "egreso", monto: 7380000, estado: "pendiente", fecha: "15/05/2025" },
  { id: "TXN-004", concepto: "Ingreso venta Plan Empresarial", tipo: "ingreso", monto: 45200000, estado: "confirmado", fecha: "13/05/2025" },
  { id: "TXN-005", concepto: "Devolución cliente – Plan Básico", tipo: "egreso", monto: 4200000, estado: "procesando", fecha: "12/05/2025" },
  { id: "TXN-006", concepto: "Ingreso venta Plan Estándar", tipo: "ingreso", monto: 33100000, estado: "confirmado", fecha: "10/05/2025" },
];

function formatCOP(v) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}
function formatCOPFull(v) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);
}

function MiniBarChart({ datos }) {
  const maxVal = Math.max(...datos.map((d) => d.ingresos));
  return (
    <div className="flex items-end gap-1 h-16">
      {datos.map((d) => (
        <div key={d.mes} className="flex-1 flex flex-col items-center gap-0.5">
          <div
            className="w-full bg-violet-500 rounded-t opacity-80"
            style={{ height: `${(d.ingresos / maxVal) * 56}px` }}
          />
          <div
            className="w-full bg-slate-600 rounded-t"
            style={{ height: `${(d.egresos / maxVal) * 56}px`, marginTop: "-1px" }}
          />
          <span className="text-[9px] text-slate-500 mt-1">{d.mes}</span>
        </div>
      ))}
    </div>
  );
}

function LineChart({ datos }) {
  const max = Math.max(...datos.map((d) => d.ingresos));
  const min = Math.min(...datos.map((d) => d.egresos));
  const H = 100, W = 300, pad = 10;

  function toY(val) {
    return H - pad - ((val - min) / (max - min)) * (H - pad * 2);
  }
  function toX(i) {
    return pad + (i / (datos.length - 1)) * (W - pad * 2);
  }

  const ingresosPath = datos.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.ingresos)}`).join(" ");
  const egresosPath = datos.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.egresos)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28">
      <path d={ingresosPath} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={egresosPath} fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {datos.map((d, i) => (
        <circle key={i} cx={toX(i)} cy={toY(d.ingresos)} r="3" fill="#8b5cf6" />
      ))}
    </svg>
  );
}

const ESTADO_STYLES = {
  pagado: "bg-emerald-500/15 text-emerald-400",
  confirmado: "bg-blue-500/15 text-blue-400",
  pendiente: "bg-amber-500/15 text-amber-400",
  procesando: "bg-slate-500/15 text-slate-400",
};

export default function RF10_PanelAdministrativo() {
  const [tabActiva, setTabActiva] = useState("resumen");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const totalIngresos = DATOS_MENSUALES.reduce((s, d) => s + d.ingresos, 0);
  const totalEgresos = DATOS_MENSUALES.reduce((s, d) => s + d.egresos, 0);
  const totalComisiones = DATOS_MENSUALES.reduce((s, d) => s + d.comisiones, 0);
  const utilidad = totalIngresos - totalEgresos;

  const txFiltradas = TRANSACCIONES.filter(
    (t) => filtroTipo === "todos" || t.tipo === filtroTipo
  );

  const KPIS = [
    { label: "Ingresos totales", valor: formatCOP(totalIngresos), sub: "Acumulado 2025", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
    { label: "Egresos totales", valor: formatCOP(totalEgresos), sub: "Acumulado 2025", color: "text-slate-300", bg: "bg-slate-700/30 border-slate-700" },
    { label: "Utilidad neta", valor: formatCOP(utilidad), sub: `${((utilidad / totalIngresos) * 100).toFixed(1)}% margen`, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Comisiones pagadas", valor: formatCOP(totalComisiones), sub: `${((totalComisiones / totalEgresos) * 100).toFixed(1)}% de egresos`, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  ];

  const TABS = [
    { id: "resumen", label: "Resumen" },
    { id: "transacciones", label: "Transacciones" },
    { id: "tendencias", label: "Tendencias" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-violet-400 uppercase">RF10</span>
            <h1 className="text-3xl font-bold text-white mt-1">Panel Financiero</h1>
            <p className="text-slate-400 text-sm mt-1">Administración y control financiero · Período 2025</p>
          </div>
          <span className="bg-emerald-500/15 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-medium">
            ● En vivo
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {KPIS.map((k) => (
            <div key={k.label} className={`border rounded-2xl p-5 ${k.bg}`}>
              <p className="text-xs text-slate-400 mb-2">{k.label}</p>
              <p className={`text-2xl font-bold font-mono ${k.color}`}>{k.valor}</p>
              <p className="text-xs text-slate-500 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTabActiva(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tabActiva === t.id ? "bg-violet-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Resumen */}
        {tabActiva === "resumen" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4">Ingresos vs Egresos por mes</h3>
              <MiniBarChart datos={DATOS_MENSUALES} />
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-3 h-3 rounded bg-violet-500" /> Ingresos
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="w-3 h-3 rounded bg-slate-600" /> Egresos
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-1">Distribución de egresos</h3>
              <p className="text-xs text-slate-500 mb-5">Mayo 2025</p>
              {[
                { concepto: "Nómina operativa", monto: 78000000, color: "bg-violet-500" },
                { concepto: "Comisiones agentes", monto: 18600000, color: "bg-amber-400" },
                { concepto: "Gastos admin", monto: 24000000, color: "bg-blue-500" },
                { concepto: "Infraestructura", monto: 13400000, color: "bg-slate-500" },
              ].map((item) => {
                const total = 134000000;
                const pct = (item.monto / total) * 100;
                return (
                  <div key={item.concepto} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{item.concepto}</span>
                      <span className="text-slate-400 font-mono">{formatCOP(item.monto)}</span>
                    </div>
                    <div className="bg-slate-800 rounded-full h-1.5">
                      <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Transacciones */}
        {tabActiva === "transacciones" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 p-5 border-b border-slate-800">
              <span className="text-sm text-slate-400 mr-2">Filtrar:</span>
              {["todos", "ingreso", "egreso"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltroTipo(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                    filtroTipo === f ? "bg-violet-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-800">
                  <th className="text-left px-5 py-3">ID</th>
                  <th className="text-left px-5 py-3">Concepto</th>
                  <th className="text-left px-5 py-3">Tipo</th>
                  <th className="text-right px-5 py-3">Monto</th>
                  <th className="text-left px-5 py-3">Estado</th>
                  <th className="text-left px-5 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {txFiltradas.map((t) => (
                  <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{t.id}</td>
                    <td className="px-5 py-3 text-slate-200">{t.concepto}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${t.tipo === "ingreso" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                        {t.tipo}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-right font-mono font-semibold ${t.tipo === "ingreso" ? "text-emerald-400" : "text-red-400"}`}>
                      {t.tipo === "egreso" ? "-" : "+"}{formatCOPFull(t.monto)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ESTADO_STYLES[t.estado]}`}>{t.estado}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{t.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Tendencias */}
        {tabActiva === "tendencias" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-1">Tendencia de ingresos vs egresos</h3>
            <p className="text-xs text-slate-500 mb-4">Enero – Junio 2025</p>
            <LineChart datos={DATOS_MENSUALES} />
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-4 h-0.5 bg-violet-500 rounded" /> Ingresos
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="w-4 h-0.5 bg-slate-600 rounded" /> Egresos
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {DATOS_MENSUALES.map((d) => (
                <div key={d.mes} className="bg-slate-800 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-1">{d.mes} 2025</p>
                  <p className="text-base font-bold text-violet-400 font-mono">{formatCOP(d.ingresos)}</p>
                  <p className="text-xs text-slate-500 font-mono">- {formatCOP(d.egresos)}</p>
                  <p className={`text-xs font-semibold mt-1 font-mono ${d.ingresos - d.egresos > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    = {formatCOP(d.ingresos - d.egresos)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
