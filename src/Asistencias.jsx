import { useMemo, useState } from "react";
import "./Asistencias.css";

const initialRecords = [
  { id: 1, student: "Laura Pérez", code: "202210045", institution: "Alcaldía Municipal", date: "2026-09-22", checkIn: "08:02", checkOut: "12:00", hours: 4, status: "Pendiente", absence: false, supervisor: "Carlos Gómez" },
  { id: 2, student: "Andrés Ruiz", code: "202210071", institution: "Empresa XYZ", date: "2026-09-22", checkIn: "08:10", checkOut: "12:10", hours: 4, status: "Validada", absence: false, supervisor: "Marta Díaz" },
  { id: 3, student: "Sofía Torres", code: "202110032", institution: "Fundación ABC", date: "2026-09-21", checkIn: "08:15", checkOut: "12:15", hours: 4, status: "Validada", absence: false, supervisor: "Jorge León" },
  { id: 4, student: "Mateo Díaz", code: "202210099", institution: "Alcaldía Municipal", date: "2026-09-21", checkIn: "—", checkOut: "—", hours: 0, status: "Ausencia", absence: true, supervisor: "Carlos Gómez" },
];

const requiredHours = 400;
const statusClass = s => s.toLowerCase().replaceAll("ó","o");

export default function Asistencias() {
  const [currentRole, setCurrentRole] = useState(null);
  const [records, setRecords] = useState(initialRecords);
  const [studentName, setStudentName] = useState("Laura Pérez");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [geoStatus, setGeoStatus] = useState("No verificada");
  const [geoCoords, setGeoCoords] = useState("");

  const mine = records.filter(r => r.student === studentName);
  const validatedHours = records.filter(r => r.student === studentName && r.status === "Validada").reduce((n,r)=>n+r.hours,0);
  const absences = records.filter(r => r.student === studentName && r.absence).length;
  const pending = records.filter(r => r.status === "Pendiente").length;

  const filtered = useMemo(() => records.filter(r =>
    (filter === "Todos" || r.status === filter) &&
    `${r.student} ${r.code} ${r.institution}`.toLowerCase().includes(search.toLowerCase())
  ), [records, filter, search]);

  function checkIn() {
    const today = new Date().toISOString().slice(0,10);
    if (records.some(r => r.student === studentName && r.date === today && r.status !== "Ausencia")) {
      setMessage("Ya existe un registro de asistencia para hoy.");
      return;
    }
    const now = new Date();
    const time = now.toLocaleTimeString("es-CO", {hour:"2-digit", minute:"2-digit", hour12:false});
    const record = { id: Date.now(), student: studentName, code: "202210045", institution: "Institución asignada", date: today, checkIn: time, checkOut: "—", hours: 0, status: "Pendiente", absence: false, supervisor: "Supervisor asignado", geo: geoCoords || "No disponible" };
    setRecords(old => [record, ...old]);
    setMessage("Check-in registrado. Queda pendiente de validación del supervisor.");
  }

  function verifyLocation() {
    if (!("geolocation" in navigator)) {
      setGeoStatus("No disponible en este navegador");
      return;
    }
    setGeoStatus("Solicitando permiso…");
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGeoCoords(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setGeoStatus("Ubicación obtenida");
      },
      () => setGeoStatus("Permiso denegado o ubicación no disponible"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function updateStatus(id, status) {
    setRecords(old => old.map(r => r.id === id ? {...r, status, hours: status === "Validada" ? (r.hours || 4) : r.hours} : r));
    setMessage(`Registro ${status.toLowerCase()}.`);
  }

  if (!currentRole) {
    return <section className="attendance-page attendance-login">
      <div className="attendance-login-brand">PRÁCTICAS PROFESIONALES</div>
      <div className="attendance-login-heading">
        <span className="attendance-eyebrow">INICIO DE SESIÓN DE DEMOSTRACIÓN</span>
        <h1>¿Cómo quieres ingresar?</h1>
        <p>Selecciona un perfil para explorar el módulo de asistencias.</p>
      </div>
      <div className="role-options">
        <button className="role-option" onClick={() => setCurrentRole("estudiante")}>
          <span className="role-option-icon">E</span>
          <span><strong>Estudiante</strong><small>Registra tu asistencia y consulta tus horas.</small></span>
          <span className="role-option-arrow">→</span>
        </button>
        <button className="role-option" onClick={() => setCurrentRole("supervisor")}>
          <span className="role-option-icon supervisor">S</span>
          <span><strong>Supervisor</strong><small>Valida los registros de tus estudiantes.</small></span>
          <span className="role-option-arrow">→</span>
        </button>
        <button className="role-option" onClick={() => setCurrentRole("asesor")}>
          <span className="role-option-icon advisor">A</span>
          <span><strong>Asesor académico</strong><small>Da seguimiento al avance de las prácticas.</small></span>
          <span className="role-option-arrow">→</span>
        </button>
      </div>
      <small className="attendance-login-note">Modo demostración · No se requiere una cuenta real</small>
    </section>;
  }

  return <section className="attendance-page">
    <header className="attendance-header">
      <div>
        <span className="attendance-eyebrow">GESTIÓN DE PRÁCTICAS</span>
        <h1>Asistencias</h1>
        <p>Registro, validación y seguimiento de horas de práctica.</p>
      </div>
      <button className="role-change" onClick={()=>{setCurrentRole(null);setMessage("");}}>Cambiar perfil</button>
    </header>

    {message && <div className="attendance-message" role="status">{message}<button onClick={()=>setMessage("")} aria-label="Cerrar">×</button></div>}

    {currentRole === "estudiante" && <>
      <div className="attendance-cards">
        <article className="attendance-stat"><span>Horas validadas</span><strong>{validatedHours} / {requiredHours}</strong><small>{Math.round(validatedHours/requiredHours*100)}% completado</small></article>
        <article className="attendance-stat"><span>Ausencias registradas</span><strong>{absences}</strong><small>Consulta con tu asesor si hay inconsistencias.</small></article>
        <article className="attendance-stat"><span>Mis registros pendientes</span><strong>{mine.filter(r=>r.status==="Pendiente").length}</strong><small>Esperando validación</small></article>
      </div>
      <div className="attendance-layout">
        <article className="attendance-panel">
          <h2>Registrar asistencia</h2>
          <p>Confirma que estás en tu lugar de práctica y registra tu entrada.</p>
          <label>Estudiante de demostración
            <select value={studentName} onChange={e=>setStudentName(e.target.value)}>
              <option>Laura Pérez</option><option>Andrés Ruiz</option><option>Sofía Torres</option><option>Mateo Díaz</option>
            </select>
          </label>
          <div className="geo-box">
            <div><strong>Verificación de ubicación (opcional)</strong><small>{geoStatus}{geoCoords ? ` · ${geoCoords}` : ""}</small></div>
            <button className="btn-secondary" onClick={verifyLocation}>Obtener ubicación</button>
          </div>
          <button className="btn-primary btn-wide" onClick={checkIn}>Registrar check-in</button>
          <small className="attendance-disclaimer">Prototipo: el registro se guarda solo en el estado de esta pantalla. La ubicación no confirma por sí sola la asistencia.</small>
        </article>
        <article className="attendance-panel">
          <h2>Mi historial</h2>
          <div className="attendance-table-wrap"><table className="attendance-table">
            <thead><tr><th>Fecha</th><th>Entrada</th><th>Horas</th><th>Estado</th></tr></thead>
            <tbody>{mine.map(r=><tr key={r.id}><td>{r.date}</td><td>{r.checkIn}</td><td>{r.hours}</td><td><span className={`attendance-status ${statusClass(r.status)}`}>{r.status}</span></td></tr>)}</tbody>
          </table></div>
        </article>
      </div>
    </>}

    {currentRole === "supervisor" && <>
      <div className="attendance-cards">
        <article className="attendance-stat"><span>Pendientes de revisar</span><strong>{pending}</strong><small>Registros esperando decisión</small></article>
        <article className="attendance-stat"><span>Registros mostrados</span><strong>{filtered.length}</strong><small>Según filtros actuales</small></article>
        <article className="attendance-stat"><span>Validaciones realizadas</span><strong>{records.filter(r=>r.status==="Validada").length}</strong><small>En este prototipo</small></article>
      </div>
      <article className="attendance-panel">
        <h2>Bandeja de validación</h2>
        <div className="attendance-toolbar">
          <input placeholder="Buscar estudiante o institución…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select value={filter} onChange={e=>setFilter(e.target.value)}><option>Todos</option><option>Pendiente</option><option>Validada</option><option>Rechazada</option><option>Ausencia</option></select>
        </div>
        <div className="attendance-table-wrap"><table className="attendance-table">
          <thead><tr><th>Estudiante</th><th>Institución</th><th>Fecha</th><th>Entrada</th><th>Horas</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>{filtered.map(r=><tr key={r.id}><td><strong>{r.student}</strong><small>{r.code}</small></td><td>{r.institution}</td><td>{r.date}</td><td>{r.checkIn}</td><td>{r.hours}</td><td><span className={`attendance-status ${statusClass(r.status)}`}>{r.status}</span></td><td>{r.status==="Pendiente" ? <div className="attendance-actions"><button className="btn-approve" onClick={()=>updateStatus(r.id,"Validada")}>Validar</button><button className="btn-reject" onClick={()=>updateStatus(r.id,"Rechazada")}>Rechazar</button></div> : "—"}</td></tr>)}</tbody>
        </table></div>
      </article>
    </>}

    {currentRole === "asesor" && <>
      <div className="attendance-cards">
        <article className="attendance-stat"><span>Estudiantes en seguimiento</span><strong>{new Set(records.map(r=>r.student)).size}</strong><small>Datos ficticios</small></article>
        <article className="attendance-stat"><span>Asistencias pendientes</span><strong>{pending}</strong><small>Requieren validación</small></article>
        <article className="attendance-stat"><span>Ausencias registradas</span><strong>{records.filter(r=>r.absence).length}</strong><small>Revisar casos según normativa</small></article>
      </div>
      <article className="attendance-panel">
        <h2>Acumulado de estudiantes</h2>
        <p>Las horas contabilizadas en esta tabla son las que tienen estado validado.</p>
        <div className="attendance-table-wrap"><table className="attendance-table">
          <thead><tr><th>Estudiante</th><th>Institución</th><th>Horas validadas</th><th>Horas requeridas</th><th>Avance</th><th>Ausencias</th><th>Pendientes</th></tr></thead>
          <tbody>{[...new Set(records.map(r=>r.student))].map(name=>{
            const rs=records.filter(r=>r.student===name);
            const hours=rs.filter(r=>r.status==="Validada").reduce((s,r)=>s+r.hours,0);
            const absent=rs.filter(r=>r.absence).length;
            const pend=rs.filter(r=>r.status==="Pendiente").length;
            return <tr key={name}><td><strong>{name}</strong><small>{rs[0]?.code}</small></td><td>{rs[0]?.institution}</td><td>{hours}</td><td>{requiredHours}</td><td><div className="attendance-progress"><span style={{width:`${Math.min(100,hours/requiredHours*100)}%`}} /></div>{Math.round(hours/requiredHours*100)}%</td><td>{absent}</td><td>{pend}</td></tr>
          })}</tbody>
        </table></div>
      </article>
    </>}
  </section>;
}
