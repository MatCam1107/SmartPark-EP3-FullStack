import { useState, type FormEvent } from 'react'

const regionesComunas = [
  {
    region: 'Región Metropolitana',
    comunas: ['Santiago', 'Maipú', 'Puente Alto']
  },
  {
    region: 'Región de Valparaíso',
    comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué']
  },
  {
    region: 'Región del Biobío',
    comunas: ['Concepción', 'Talcahuano', 'Los Ángeles']
  }
]

function RegistroPage() {
  const [run, setRun] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState('')
  const [comuna, setComuna] = useState('')
  const [direccion, setDireccion] = useState('')
  const [mensaje, setMensaje] = useState('')

  const comunasDisponibles =
    regionesComunas.find((item) => item.region === region)?.comunas || []

  const enviarFormulario = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const correoValido =
      email.endsWith('@duoc.cl') ||
      email.endsWith('@profesor.duoc.cl') ||
      email.endsWith('@gmail.com')

    if (run === '') {
      setMensaje('El RUN es obligatorio.')
    } else if (run.length < 7 || run.length > 9) {
      setMensaje('El RUN debe tener entre 7 y 9 caracteres.')
    } else if (run.includes('.') || run.includes('-')) {
      setMensaje('El RUN debe ingresarse sin puntos ni guion.')
    } else if (nombre === '') {
      setMensaje('El nombre es obligatorio.')
    } else if (apellidos === '') {
      setMensaje('Los apellidos son obligatorios.')
    } else if (!correoValido) {
      setMensaje('El correo electrónico no es válido.')
    } else if (region === '') {
      setMensaje('Debe seleccionar una región.')
    } else if (comuna === '') {
      setMensaje('Debe seleccionar una comuna.')
    } else if (direccion === '') {
      setMensaje('La dirección es obligatoria.')
    } else {
      setMensaje('Registro realizado correctamente.')
    }
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4">Registro de usuario</h1>

      <form
        className="row g-3 mx-auto"
        style={{ maxWidth: '750px' }}
        onSubmit={enviarFormulario}
      >
        <div className="col-md-6">
          <label className="form-label" htmlFor="run">
            RUN
          </label>
          <input
            className="form-control"
            id="run"
            value={run}
            onChange={(evento) => setRun(evento.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="nombre">
            Nombre
          </label>
          <input
            className="form-control"
            id="nombre"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="apellidos">
            Apellidos
          </label>
          <input
            className="form-control"
            id="apellidos"
            value={apellidos}
            onChange={(evento) => setApellidos(evento.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            className="form-control"
            id="email"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="region">
            Región
          </label>
          <select
            className="form-select"
            id="region"
            value={region}
            onChange={(evento) => {
              setRegion(evento.target.value)
              setComuna('')
            }}
          >
            <option value="">Seleccione una región</option>

            {regionesComunas.map((item) => (
              <option key={item.region} value={item.region}>
                {item.region}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="comuna">
            Comuna
          </label>
          <select
            className="form-select"
            id="comuna"
            value={comuna}
            onChange={(evento) => setComuna(evento.target.value)}
          >
            <option value="">Seleccione una comuna</option>

            {comunasDisponibles.map((nombreComuna) => (
              <option key={nombreComuna} value={nombreComuna}>
                {nombreComuna}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="direccion">
            Dirección
          </label>
          <input
            className="form-control"
            id="direccion"
            value={direccion}
            onChange={(evento) => setDireccion(evento.target.value)}
          />
        </div>

        {mensaje !== '' && (
          <div className="col-12">
            <div className="alert alert-info text-center">
              {mensaje}
            </div>
          </div>
        )}

        <div className="col-12 text-center">
          <button className="btn boton-smartpark" type="submit">
            Registrarse
          </button>
        </div>
      </form>
    </main>
  )
}

export default RegistroPage