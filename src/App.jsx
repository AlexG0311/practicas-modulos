
import { useEffect, useState } from "react";
import Evaluaciones from "./Evaluaciones";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  Building2,
  Bell,
  Search,
  ChevronDown,
  Clock3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Menu,
  Download,
  CircleHelp,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import "./App.css";
import Asistencias from "./Asistencias";

const kpis = [
  {
    id: 1,
    title: "Cumplimiento de horas",
    value: "90%",
    target: "Meta ≥ 90%",
    progress: 90,
    status: "En meta",
    color: "green",
    icon: Clock3,
  },
  {
    id: 2,
    title: "Porcentaje de ausentismo",
    value: "4,5%",
    target: "Meta ≤ 5%",
    progress: 90,
    status: "En meta",
    color: "green",
    icon: Users,
  },
  {
    id: 3,
    title: "Validación de asistencias",
    value: "86%",
    target: "Meta ≥ 90%",
    progress: 86,
    status: "Por mejorar",
    color: "yellow",
    icon: ClipboardCheck,
  },
  {
    id: 4,
    title: "Evaluaciones completadas",
    value: "92%",
    target: "Meta ≥ 95%",
    progress: 92,
    status: "Por mejorar",
    color: "yellow",
    icon: FileText,
  },
  {
    id: 5,
    title: "Convenios al día",
    value: "95%",
    target: "Meta ≥ 95%",
    progress: 95,
    status: "En meta",
    color: "green",
    icon: Building2,
  },
  {
    id: 6,
    title: "Tiempo de asignación",
    value: "12 días",
    target: "Meta: reducir 20%",
    progress: 80,
    status: "Revisar línea base",
    color: "blue",
    icon: CalendarDays,
  },
  {
    id: 7,
    title: "Informes oportunos",
    value: "95%",
    target: "Meta ≥ 95%",
    progress: 95,
    status: "En meta",
    color: "green",
    icon: FileText,
  },
  {
    id: 8,
    title: "Atención de alertas",
    value: "90%",
    target: "Meta ≥ 90%",
    progress: 90,
    status: "En meta",
    color: "green",
    icon: Bell,
  },
];

const trendData = [
  { corte: "Corte 1", horas: 72, asistencia: 78 },
  { corte: "Corte 2", horas: 78, asistencia: 82 },
  { corte: "Corte 3", horas: 84, asistencia: 85 },
  { corte: "Corte 4", horas: 90, asistencia: 86 },
];

const assignmentData = [
  { mes: "Feb", dias: 18 },
  { mes: "Mar", dias: 16 },
  { mes: "Abr", dias: 15 },
  { mes: "May", dias: 12 },
  { mes: "Jun", dias: 12 },
];

const initialAlerts = [
  {
    id: 1,
    title: "Asistencias pendientes",
    description: "Registros que requieren validación del supervisor.",
    type: "warning",
    count: 12,
  },
  {
    id: 2,
    title: "Convenios próximos a vencer",
    description: "Revisar documentación y gestionar renovaciones.",
    type: "danger",
    count: 3,
  },
  {
    id: 3,
    title: "Evaluaciones pendientes",
    description: "Evaluaciones que deben completarse para el corte.",
    type: "warning",
    count: 8,
  },
];

function Sidebar({ active, setActive, open, setOpen }) {
  const navigate = useNavigate();
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/" },
    { label: "Evaluaciones", icon: FileText, path: "/evaluaciones" },
    { label: "Convenios", icon: Building2, path: "/" },
    { label: "Informes", icon: FileText, path: "/evaluaciones" },
    { label: "Asistencias", icon: ClipboardCheck, path: "/asistencias" },
  ];

  return (
    <>
      {open && (
        <div className="mobile-overlay" onClick={() => setOpen(false)} />
      )}

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>Prácticas</strong>
            <span>Gestión institucional</span>
          </div>
        </div>

        <div className="menu-label">MENÚ PRINCIPAL</div>

        <nav>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`nav-item ${
                  active === item.label ? "nav-active" : ""
                }`}
                onClick={() => {
                  setActive(item.label);
                  navigate(item.path);
                  setOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <CircleHelp size={20} />
            <strong>¿Necesitas ayuda?</strong>
            <span>Consulta la guía de la plataforma.</span>
            <button onClick={() => alert("Prototipo: guía de ayuda")}>
              Ver guía
            </button>
          </div>

          <div className="profile">
            <div className="avatar">CP</div>
            <div className="profile-text">
              <strong>Coordinación</strong>
              <span>Administrador</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>
    </>
  );
}

function KpiCard({ item }) {
  const Icon = item.icon;

  return (
    <article className="kpi-card">
      <div className="kpi-top">
        <div className={`kpi-icon ${item.color}`}>
          <Icon size={20} />
        </div>
        <span className={`status status-${item.color}`}>
          {item.status}
        </span>
      </div>

      <p className="kpi-title">{item.title}</p>
      <div className="kpi-value">{item.value}</div>

      <div className="progress-track">
        <div
          className={`progress-fill fill-${item.color}`}
          style={{ width: `${item.progress}%` }}
        />
      </div>

      <div className="kpi-footer">
        <span>{item.target}</span>
        <span>{item.progress}%</span>
      </div>
    </article>
  );
}

function DashboardPage({
  active,
  setActive,
  period,
  setPeriod,
  program,
  setProgram,
  open,
  setOpen,
  alerts,
  setAlerts,
  search,
  setSearch,
}) {
  const visibleAlerts = alerts.filter((alert) =>
    alert.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        open={open}
        setOpen={setOpen}
      />

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>

          <div className="breadcrumb">
            <span>Prácticas Profesionales</span>
            <span className="crumb-separator">/</span>
            <strong>{active}</strong>
          </div>

          <div className="topbar-right">
            <button className="icon-button" title="Notificaciones">
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="topbar-user">
              <div className="avatar">CP</div>
              <span>Coordinación</span>
              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <div className="page-container">
          <>
              <section className="page-heading">
                <div>
                  <div className="eyebrow">PANEL DE CONTROL INSTITUCIONAL</div>
                  <h1>Dashboard de gestión</h1>
                  <p>
                    Consulta el desempeño y seguimiento de las prácticas
                    profesionales.
                  </p>
                </div>

                <button className="export-button" onClick={handleExport}>
                  <Download size={17} />
                  Exportar / Imprimir
                </button>
              </section>

              <section className="filters">
                <div className="filter-heading">
                  <Filter size={17} />
                  <span>Filtros de consulta</span>
                </div>

                <label>
                  Periodo académico
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="2026-1">2026 - I</option>
                    <option value="2026-2">2026 - II</option>
                    <option value="2025-2">2025 - II</option>
                  </select>
                </label>

                <label>
                  Programa académico
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                  >
                    <option>Todos</option>
                    <option>Ingeniería de Sistemas</option>
                    <option>Administración</option>
                    <option>Contaduría Pública</option>
                  </select>
                </label>

                <div className="filter-note">
                  <CalendarDays size={16} />
                  <span>Datos de ejemplo</span>
                </div>
              </section>

              <section className="section-heading">
                <div>
                  <h2>Indicadores clave de desempeño</h2>
                  <p>
                    Estado general de los ocho KPI definidos para el proceso.
                  </p>
                </div>
                <span className="period-badge">
                  Periodo {period.replace("-", " - ")}
                </span>
              </section>

              <section className="kpi-grid">
                {kpis.map((item) => (
                  <KpiCard key={item.id} item={item} />
                ))}
              </section>

              <section className="charts-grid">
                <article className="panel trend-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Evolución del seguimiento</h3>
                      <p>Cumplimiento de horas y validación de asistencia</p>
                    </div>
                    <button className="dots-button" aria-label="Más opciones">
                      •••
                    </button>
                  </div>

                  <div className="chart-legend">
                    <span>
                      <i className="legend-dot blue-dot" />
                      Cumplimiento de horas
                    </span>
                    <span>
                      <i className="legend-dot green-dot" />
                      Validación de asistencia
                    </span>
                  </div>

                  <div className="chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="corte"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip formatter={(v) => `${v}%`} />
                        <Line
                          type="monotone"
                          dataKey="horas"
                          name="Cumplimiento de horas"
                          stroke="#4263eb"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="asistencia"
                          name="Validación de asistencia"
                          stroke="#16a085"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="panel assignment-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Tiempo de asignación</h3>
                      <p>Promedio de días por mes</p>
                    </div>
                    <span className="chart-badge">
                      <TrendingUp size={14} />
                      KPI 6
                    </span>
                  </div>

                  <div className="assignment-summary">
                    <strong>12 días</strong>
                    <span>Promedio ilustrativo</span>
                  </div>

                  <div className="chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={assignmentData}
                        margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="mes"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip formatter={(v) => `${v} días`} />
                        <Bar
                          dataKey="dias"
                          name="Días promedio"
                          fill="#4263eb"
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </article>
              </section>

              <section className="bottom-grid">
                <article className="panel alerts-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Alertas y pendientes</h3>
                      <p>Situaciones que requieren revisión</p>
                    </div>
                    <span className="alert-total">
                      {alerts.reduce((sum, item) => sum + item.count, 0)} pendientes
                    </span>
                  </div>

                  <div className="alert-search">
                    <Search size={16} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar alertas..."
                    />
                  </div>

                  <div className="alert-list">
                    {visibleAlerts.length === 0 && (
                      <p className="empty-alerts">No se encontraron alertas.</p>
                    )}

                    {visibleAlerts.map((alert) => (
                      <div className="alert-row" key={alert.id}>
                        <div
                          className={`alert-icon ${
                            alert.type === "danger" ? "danger" : "warning"
                          }`}
                        >
                          {alert.type === "danger" ? (
                            <AlertTriangle size={19} />
                          ) : (
                            <Clock3 size={19} />
                          )}
                        </div>

                        <div className="alert-copy">
                          <strong>{alert.title}</strong>
                          <span>{alert.description}</span>
                        </div>

                        <span className="alert-count">{alert.count}</span>

                        <button
                          className="review-button"
                          onClick={() =>
                            setAlerts((old) =>
                              old.filter((item) => item.id !== alert.id)
                            )
                          }
                        >
                          Revisar
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="panel summary-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Resumen de gestión</h3>
                      <p>Información general del periodo</p>
                    </div>
                  </div>

                  <div className="summary-stat">
                    <div className="summary-icon blue">
                      <Users size={20} />
                    </div>
                    <div>
                      <span>Estudiantes en práctica</span>
                      <strong>248</strong>
                    </div>
                  </div>

                  <div className="summary-stat">
                    <div className="summary-icon green">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <span>Convenios activos</span>
                      <strong>36</strong>
                    </div>
                  </div>

                  <div className="summary-stat">
                    <div className="summary-icon purple">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <span>Asignaciones formalizadas</span>
                      <strong>214</strong>
                    </div>
                  </div>

                  <div className="summary-note">
                    <CheckCircle2 size={17} />
                    <span>
                      Resumen ilustrativo para representar la información
                      consolidada del sistema.
                    </span>
                  </div>
                </article>
              </section>

              <footer className="dashboard-footer">
                <span>
                  © 2026 Plataforma de Gestión de Prácticas Profesionales
                </span>
                <span>Prototipo académico · Datos ficticios</span>
              </footer>
          </>
        </div>
      </main>
    </div>
  );
}

function AsistenciasPage() {
  return <main className="attendance-standalone"><Asistencias /></main>;
}

function App() {
  const location = useLocation();
  const [active, setActive] = useState("Dashboard");
  const [period, setPeriod] = useState("2026-1");
  const [program, setProgram] = useState("Todos");
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const rutas = {
      "/": "Dashboard",
      "/asistencias": "Asistencias",
      "/evaluaciones": "Evaluaciones",
    };

    setActive(rutas[location.pathname] || "Dashboard");
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage
            active={active}
            setActive={setActive}
            period={period}
            setPeriod={setPeriod}
            program={program}
            setProgram={setProgram}
            open={open}
            setOpen={setOpen}
            alerts={alerts}
            setAlerts={setAlerts}
            search={search}
            setSearch={setSearch}
          />
        }
      />
      <Route
        path="/asistencias"
        element={<AsistenciasPage />}
      />
      <Route
        path="/evaluaciones"
        element={
          <div className="app-shell">
            <Sidebar
              active={active}
              setActive={setActive}
              open={open}
              setOpen={setOpen}
            />

            <main className="main-content">
              <header className="topbar">
                <button
                  className="mobile-menu"
                  onClick={() => setOpen(!open)}
                  aria-label="Abrir menú"
                >
                  <Menu size={22} />
                </button>

                <div className="breadcrumb">
                  <span>Prácticas Profesionales</span>
                  <span className="crumb-separator">/</span>
                  <strong>Evaluaciones</strong>
                </div>

                <div className="topbar-right">
                  <div className="topbar-user">
                    <div className="avatar">CP</div>
                    <span>Coordinación</span>
                    <ChevronDown size={15} />
                  </div>
                </div>
              </header>

              <div className="page-container">
                <Evaluaciones />
              </div>
            </main>
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;