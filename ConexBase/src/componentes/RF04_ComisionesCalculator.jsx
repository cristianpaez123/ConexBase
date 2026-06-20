import { useState, useMemo } from "react";

const ESQUEMAS = {
  basico: { nombre: "Básico", porcentaje: 0.05, descripcion: "5% sobre ventas brutas" },
  estandar: { nombre: "Estándar", porcentaje: 0.08, descripcion: "8% sobre ventas brutas" },
  premium: { nombre: "Premium", porcentaje: 0.12, descripcion: "12% sobre ventas brutas" },
  escalonado: { nombre: "Escalonado", porcentaje: null, descripcion: "Porcentaje variable por tramo" },
};

const TRAMOS_ESCALONADO = [
  { limite: 10000000, porcentaje: 0.05, label: "Hasta $10M" },
  { limite: 30000000, porcentaje: 0.08, label: "$10M – $30M" },
  { limite: Infinity, porcentaje: 0.12, label: "Más de $30M" },
];

function calcularEscalonado(monto) {
  let restante = monto;
  let total = 0;
  let detalle = [];
  let prevLimite = 0;

  for (const tramo of TRAMOS_ESCALONADO) {
    if (restante <= 0) break;
    const base = Math.min(restante, tramo.limite - prevLimite);
    const comision = base * tramo.porcentaje;
    detalle.push({ label: tramo.label, base, porcentaje: tramo.porcentaje, comision });
    total += comision;
    restante -= base;
    prevLimite = tramo.limite;
  }
  return { total, detalle };
}

function formatCOP(valor) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor);
}

export default function RF04_ComisionesCalculator() {
  const [ventaBruta, setVentaBruta] = useState("");
  const [descuentos, setDescuentos] = useState("");
  const [esquema, setEsquema] = useState("estandar");
  const [agente, setAgente] = useState("");
  const [historial, setHistorial] = useState([]);

  const monto = parseFloat((ventaBruta || "0").replace(/\./g, "").replace(",", ".")) || 0;
  const descuento = parseFloat((descuentos || "0").replace(/\./g, "").replace(",", ".")) || 0;
  const ventaNeta = Math.max(0, monto - descuento);

  const resultado = useMemo(() => {
    if (!ventaNeta) return null;
    if (esquema === "escalonado") {
      return calcularEscalonado(ventaNeta);
    }
    const pct = ESQUEMAS[esquema].porcentaje;
    return { total: ventaNeta * pct, detalle: null };
  }, [ventaNeta, esquema]);

  function guardarCalculo() {
    if (!resultado || !agente.trim()) return;
    setHistorial((prev) => [
      {
        id: Date.now(),
        agente,
        ventaBruta: monto,
        ventaNeta,
        esquema: ESQUEMAS[esquema].nombre,
        comision: resultado.total,
        fecha: new Date().toLocaleDateString("es-CO"),
      },
      ...prev.slice(0, 9),
    ]);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">RF04</span>
          <h1 className="text-3xl font-bold text-white mt-1">Cálculo de Comisiones</h1>
          <p className="text-slate-400 text-sm mt-1">Calculadora automática por esquema y agente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-5">Parámetros</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Agente / Vendedor</label>
                <input
                  type="text"
                  value={agente}
                  onChange={(e) => setAgente(e.target.value)}
                  placeholder="Nombre del agente"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Venta bruta (COP)</label>
                <input
                  type="number"
                  value={ventaBruta}
                  onChange={(e) => setVentaBruta(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Descuentos / Devoluciones (COP)</label>
                <input
                  type="number"
                  value={descuentos}
                  onChange={(e) => setDescuentos(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Esquema de comisión</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ESQUEMAS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setEsquema(key)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                        esquema === key
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      }`}
                    >
                      <div className="font-semibold">{val.nombre}</div>
                      <div className="opacity-70 text-[10px] mt-0.5">{val.descripcion}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={guardarCalculo}
              disabled={!resultado || !agente.trim()}
              className="mt-6 w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              Guardar cálculo
            </button>
          </div>

          {/* Resultado */}
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Resultado</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Venta bruta</span>
                  <span className="text-white font-mono">{formatCOP(monto)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Descuentos</span>
                  <span className="text-red-400 font-mono">- {formatCOP(descuento)}</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between text-sm font-semibold">
                  <span className="text-slate-300">Venta neta</span>
                  <span className="text-white font-mono">{formatCOP(ventaNeta)}</span>
                </div>
              </div>

              {resultado && esquema === "escalonado" && resultado.detalle && (
                <div className="bg-slate-800 rounded-xl p-4 mb-4 space-y-2">
                  <p className="text-xs text-slate-400 font-medium mb-2">Desglose escalonado</p>
                  {resultado.detalle.map((t, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-slate-400">
                        {t.label} ({(t.porcentaje * 100).toFixed(0)}%)
                      </span>
                      <span className="text-slate-200 font-mono">{formatCOP(t.comision)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 text-center">
                <p className="text-xs text-emerald-400 mb-1">Comisión a pagar</p>
                <p className="text-4xl font-bold text-emerald-400 font-mono">
                  {resultado ? formatCOP(resultado.total) : "—"}
                </p>
              </div>
            </div>

            {/* Historial */}
            {historial.length > 0 && (
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Historial reciente</h2>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {historial.map((h) => (
                    <div key={h.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-4 py-2.5">
                      <div>
                        <p className="text-sm text-white font-medium">{h.agente}</p>
                        <p className="text-xs text-slate-400">{h.esquema} · {h.fecha}</p>
                      </div>
                      <span className="text-emerald-400 font-mono text-sm font-semibold">{formatCOP(h.comision)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
