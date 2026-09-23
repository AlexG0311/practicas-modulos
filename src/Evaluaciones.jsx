
import { useMemo, useState } from "react";
import {
  ClipboardCheck,
  FileText,
  Plus,
  Search,
  Download,
  CheckCircle2,
  GraduationCap,
  Building2,
  UserRound,
} from "lucide-react";
import "./Evaluaciones.css";

const ROLES = ["Estudiante", "Supervisor", "Asesor"];

const CRITERIOS = [
  {
    grupo: "Ser",
    descripcion: "Actitud, responsabilidad, ética y compromiso.",
  },
  {
    grupo: "Saber",
    descripcion: "Conocimientos teóricos y comprensión de su área.",
  },
  {
    grupo: "Hacer",
    descripcion: "Aplicación práctica, desempeño y cumplimiento de tareas.",
  },
];

const NOTA_MINIMA = 0;
const NOTA_MAXIMA = 5;

const iniciales = [
  {
    id: 1,
    estudiante: "Laura Martínez",
    codigo: "20231001",
    programa: "Ingeniería de Sistemas",
    empresa: "Tecnologías del Caribe",
    asesor: "Carlos Pérez",
    supervisor: "María Gómez",
    corte1: { Estudiante: null, Supervisor: null, Asesor: null },
    corte2: { Estudiante: null, Supervisor: null, Asesor: null },
  },
  {
    id: 2,
    estudiante: "Andrés Rodríguez",
    codigo: "20231002",
    programa: "Ingeniería de Sistemas",
    empresa: "Soluciones Digitales",
    asesor: "Carlos Pérez",
    supervisor: "Jorge Díaz",
    corte1: { Estudiante: null, Supervisor: null, Asesor: null },
    corte2: { Estudiante: null, Supervisor: null, Asesor: null },
  },
];

function notaPromedio(registros) {
  const notas = Object.values(registros || {}).filter(
    (nota) => typeof nota === "number"
  );

  if (!notas.length) return null;

  return notas.reduce((total, nota) => total + nota, 0) / notas.length;
}

function notaFinal(estudiante) {
  const corte1 = notaPromedio(estudiante.corte1);
  const corte2 = notaPromedio(estudiante.corte2);

  if (corte1 === null || corte2 === null) return null;

  return corte1 * 0.4 + corte2 * 0.6;
}

function notaTexto(nota) {
  return nota === null ? "Pendiente" : nota.toFixed(2);
}

export default function Evaluaciones() {
  const [estudiantes, setEstudiantes] = useState(iniciales);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState(null);
  const [rol, setRol] = useState("Supervisor");
  const [corte, setCorte] = useState("corte1");
  const [criterios, setCriterios] = useState({
    Ser: 3,
    Saber: 3,
    Hacer: 3,
  });
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nuevo, setNuevo] = useState(false);
  const [formNuevo, setFormNuevo] = useState({
    estudiante: "",
    codigo: "",
    programa: "Ingeniería de Sistemas",
    empresa: "",
    asesor: "",
    supervisor: "",
  });

  const filtrados = useMemo(
    () =>
      estudiantes.filter((estudiante) =>
        `${estudiante.estudiante} ${estudiante.codigo} ${estudiante.empresa}`
          .toLowerCase()
          .includes(busqueda.toLowerCase())
      ),
    [estudiantes, busqueda]
  );

  const actual = estudiantes.find((e) => e.id === seleccionado);

  const notaFormulario = useMemo(() => {
    const valores = Object.values(criterios);
    return valores.reduce((total, n) => total + Number(n), 0) / valores.length;
  }, [criterios]);

  const completadas = estudiantes.filter(
    (e) => notaFinal(e) !== null
  ).length;

  const promedioGeneral = useMemo(() => {
    const notas = estudiantes
      .map(notaFinal)
      .filter((nota) => nota !== null);

    if (!notas.length) return null;

    return notas.reduce((a, b) => a + b, 0) / notas.length;
  }, [estudiantes]);

  function guardarEvaluacion(e) {
    e.preventDefault();

    if (!actual) return;

    const registro = {
      nota: Number(notaFormulario.toFixed(2)),
      comentario,
      fecha: new Date().toLocaleDateString("es-CO"),
    };

    setEstudiantes((lista) =>
      lista.map((estudiante) =>
        estudiante.id === actual.id
          ? {
              ...estudiante,
              [corte]: {
                ...estudiante[corte],
                [rol]: registro.nota,
              },
              [`${corte}Comentarios`]: {
                ...(estudiante[`${corte}Comentarios`] || {}),
                [rol]: comentario,
              },
            }
          : estudiante
      )
    );

    setMensaje("Evaluación guardada correctamente.");
    setComentario("");
  }

  function agregarEstudiante(e) {
    e.preventDefault();

    if (!formNuevo.estudiante.trim() || !formNuevo.codigo.trim()) {
      setMensaje("Ingresa al menos el nombre y el código.");
      return;
    }

    const nuevoEstudiante = {
      ...formNuevo,
      id: Date.now(),
      corte1: { Estudiante: null, Supervisor: null, Asesor: null },
      corte2: { Estudiante: null, Supervisor: null, Asesor: null },
    };

    setEstudiantes((lista) => [...lista, nuevoEstudiante]);
    setFormNuevo({
      estudiante: "",
      codigo: "",
      programa: "Ingeniería de Sistemas",
      empresa: "",
      asesor: "",
      supervisor: "",
    });
    setNuevo(false);
    setMensaje("Estudiante agregado al prototipo.");
  }

  function exportarInforme() {
    window.print();
  }

  function abrirFormulario(estudiante) {
    setSeleccionado(estudiante.id);
    setCriterios({ Ser: 3, Saber: 3, Hacer: 3 });
    setComentario("");
    setMensaje("");
  }

  return (
    <div className="evaluaciones-page">
      <section className="eval-heading">
        <div>
          <div className="eval-eyebrow">SEGUIMIENTO ACADÉMICO</div>
          <h1>Evaluaciones</h1>
          <p>
            Registro de competencias Ser, Saber y Hacer, por evaluador y
            periodo de práctica.
          </p>
        </div>

        <button className="eval-primary-button" onClick={exportarInforme}>
          <Download size={17} />
          Imprimir informe
        </button>
      </section>

      <section className="eval-kpis">
        <article className="eval-kpi">
          <div className="eval-kpi-icon blue">
            <GraduationCap size={21} />
          </div>
          <span>Estudiantes registrados</span>
          <strong>{estudiantes.length}</strong>
        </article>

        <article className="eval-kpi">
          <div className="eval-kpi-icon green">
            <CheckCircle2 size={21} />
          </div>
          <span>Con nota final</span>
          <strong>{completadas}</strong>
        </article>

        <article className="eval-kpi">
          <div className="eval-kpi-icon purple">
            <ClipboardCheck size={21} />
          </div>
          <span>Promedio final</span>
          <strong>{notaTexto(promedioGeneral)}</strong>
        </article>
      </section>

      <section className="eval-panel">
        <div className="eval-panel-heading">
          <div>
            <h2>Listado de estudiantes</h2>
            <p>Selecciona un estudiante para registrar o consultar notas.</p>
          </div>

          <button
            className="eval-secondary-button"
            onClick={() => {
              setNuevo(!nuevo);
              setMensaje("");
            }}
          >
            <Plus size={16} />
            Nuevo estudiante
          </button>
        </div>

        {nuevo && (
          <form className="eval-new-form" onSubmit={agregarEstudiante}>
            <label>
              Nombre completo
              <input
                value={formNuevo.estudiante}
                onChange={(e) =>
                  setFormNuevo({
                    ...formNuevo,
                    estudiante: e.target.value,
                  })
                }
                placeholder="Nombre del estudiante"
                required
              />
            </label>

            <label>
              Código estudiantil
              <input
                value={formNuevo.codigo}
                onChange={(e) =>
                  setFormNuevo({ ...formNuevo, codigo: e.target.value })
                }
                placeholder="Código"
                required
              />
            </label>

            <label>
              Programa
              <select
                value={formNuevo.programa}
                onChange={(e) =>
                  setFormNuevo({ ...formNuevo, programa: e.target.value })
                }
              >
                <option>Ingeniería de Sistemas</option>
                <option>Administración</option>
                <option>Contaduría Pública</option>
              </select>
            </label>

            <label>
              Empresa
              <input
                value={formNuevo.empresa}
                onChange={(e) =>
                  setFormNuevo({ ...formNuevo, empresa: e.target.value })
                }
                placeholder="Empresa de práctica"
              />
            </label>

            <label>
              Asesor académico
              <input
                value={formNuevo.asesor}
                onChange={(e) =>
                  setFormNuevo({ ...formNuevo, asesor: e.target.value })
                }
                placeholder="Nombre del asesor"
              />
            </label>

            <label>
              Supervisor
              <input
                value={formNuevo.supervisor}
                onChange={(e) =>
                  setFormNuevo({
                    ...formNuevo,
                    supervisor: e.target.value,
                  })
                }
                placeholder="Nombre del supervisor"
              />
            </label>

            <div className="eval-form-actions">
              <button type="submit" className="eval-primary-button">
                Guardar estudiante
              </button>
              <button
                type="button"
                className="eval-cancel-button"
                onClick={() => setNuevo(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="eval-search">
          <Search size={17} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante, código o empresa..."
          />
        </div>

        <div className="eval-table-wrap">
          <table className="eval-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Empresa</th>
                <th>Corte 1</th>
                <th>Corte 2</th>
                <th>Nota final</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((estudiante) => {
                const c1 = notaPromedio(estudiante.corte1);
                const c2 = notaPromedio(estudiante.corte2);
                const final = notaFinal(estudiante);

                return (
                  <tr key={estudiante.id}>
                    <td>
                      <strong>{estudiante.estudiante}</strong>
                      <small>{estudiante.codigo}</small>
                    </td>
                    <td>{estudiante.empresa || "Sin registrar"}</td>
                    <td>{notaTexto(c1)}</td>
                    <td>{notaTexto(c2)}</td>
                    <td>
                      <strong>{notaTexto(final)}</strong>
                    </td>
                    <td>
                      <span
                        className={`eval-status ${
                          final === null ? "pending" : "complete"
                        }`}
                      >
                        {final === null ? "Pendiente" : "Completada"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="eval-link-button"
                        onClick={() => abrirFormulario(estudiante)}
                      >
                        Evaluar
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="eval-empty">
                    No se encontraron estudiantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {actual && (
        <section className="eval-panel eval-editor">
          <div className="eval-panel-heading">
            <div>
              <div className="eval-eyebrow">FORMULARIO DE EVALUACIÓN</div>
              <h2>{actual.estudiante}</h2>
              <p>
                {actual.programa} · {actual.empresa || "Empresa sin registrar"}
              </p>
            </div>
            <button
              className="eval-cancel-button"
              onClick={() => setSeleccionado(null)}
            >
              Cerrar
            </button>
          </div>

          <div className="eval-selectors">
            <label>
              <UserRound size={16} />
              Evaluador
              <select value={rol} onChange={(e) => setRol(e.target.value)}>
                {ROLES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <FileText size={16} />
              Corte
              <select value={corte} onChange={(e) => setCorte(e.target.value)}>
                <option value="corte1">Corte 1 (40 %)</option>
                <option value="corte2">Corte 2 (60 %)</option>
              </select>
            </label>
          </div>

          <form onSubmit={guardarEvaluacion}>
            <div className="eval-criteria">
              {CRITERIOS.map((criterio) => (
                <div className="eval-criterion" key={criterio.grupo}>
                  <div>
                    <span className="eval-criterion-tag">
                      {criterio.grupo}
                    </span>
                    <p>{criterio.descripcion}</p>
                  </div>

                  <label>
                    Nota (0–5)
                    <input
                      type="number"
                      min={NOTA_MINIMA}
                      max={NOTA_MAXIMA}
                      step="0.1"
                      required
                      value={criterios[criterio.grupo]}
                      onChange={(e) =>
                        setCriterios({
                          ...criterios,
                          [criterio.grupo]: Math.min(
                            NOTA_MAXIMA,
                            Math.max(NOTA_MINIMA, Number(e.target.value))
                          ),
                        })
                      }
                    />
                  </label>
                </div>
              ))}
            </div>

            <label className="eval-comment">
              Observaciones del evaluador
              <textarea
                rows="3"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escribe comentarios sobre el desempeño..."
              />
            </label>

            <div className="eval-score-preview">
              <span>Nota de esta evaluación</span>
              <strong>{notaFormulario.toFixed(2)} / 5.00</strong>
            </div>

            <div className="eval-form-actions">
              <button className="eval-primary-button" type="submit">
                <CheckCircle2 size={17} />
                Guardar evaluación
              </button>
            </div>
          </form>

          {mensaje && <div className="eval-message">{mensaje}</div>}
        </section>
      )}

      <section className="eval-panel">
        <div className="eval-panel-heading">
          <div>
            <h2>Consolidado para gestión</h2>
            <p>
              Resumen de calificaciones por corte y avance de evaluaciones.
            </p>
          </div>
          <Building2 size={22} />
        </div>

        <div className="eval-table-wrap">
          <table className="eval-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Nota corte 1</th>
                <th>Ponderación 40 %</th>
                <th>Nota corte 2</th>
                <th>Ponderación 60 %</th>
                <th>Nota final</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante) => {
                const c1 = notaPromedio(estudiante.corte1);
                const c2 = notaPromedio(estudiante.corte2);
                const final = notaFinal(estudiante);

                return (
                  <tr key={estudiante.id}>
                    <td>{estudiante.estudiante}</td>
                    <td>{notaTexto(c1)}</td>
                    <td>{c1 === null ? "—" : (c1 * 0.4).toFixed(2)}</td>
                    <td>{notaTexto(c2)}</td>
                    <td>{c2 === null ? "—" : (c2 * 0.6).toFixed(2)}</td>
                    <td>
                      <strong>{notaTexto(final)}</strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="eval-report-note">
          La nota de cada corte se calcula como el promedio de las evaluaciones
          registradas para Estudiante, Supervisor y Asesor. La nota final solo
          se muestra cuando ambos cortes tienen calificaciones.
        </p>
      </section>
    </div>
  );
}