import { useState, type SubmitEvent } from 'react'

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
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [region, setRegion] = useState('')
  const [comuna, setComuna] = useState('')
  const [direccion, setDireccion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [exito, setExito] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const comunasDisponibles =
    regionesComunas.find((item) => item.region === region)?.comunas || []

  const enviarFormulario = async (
    evento: SubmitEvent<HTMLFormElement>
  ) => {
    evento.preventDefault()

    setMensaje('')
    setExito(false)

    const correoNormalizado = email.trim().toLowerCase()

    const correoValido =
      correoNormalizado.endsWith('@duoc.cl') ||
      correoNormalizado.endsWith('@profesor.duoc.cl') ||
      correoNormalizado.endsWith('@gmail.com')

    if (run.trim() === '') {
      setMensaje('El RUN es obligatorio.')
    } else if (run.length < 7 || run.length > 9) {
      setMensaje('El RUN debe tener entre 7 y 9 caracteres.')
    } else if (run.includes('.') || run.includes('-')) {
      setMensaje('El RUN debe ingresarse sin puntos ni guion.')
    } else if (!/^[0-9]{6,8}[0-9Kk]$/.test(run)) {
      setMensaje('El formato del RUN no es válido.')
    } else if (nombre.trim() === '') {
      setMensaje('El nombre es obligatorio.')
    } else if (apellidos.trim() === '') {
      setMensaje('Los apellidos son obligatorios.')
    } else if (!correoValido) {
      setMensaje('El correo electrónico no es válido.')
    } else if (password.length < 8 || password.length > 18) {
      setMensaje('La contraseña debe tener entre 8 y 18 caracteres.')
    } else if (password !== confirmarPassword) {
      setMensaje('Las contraseñas no coinciden.')
    } else if (region === '') {
      setMensaje('Debe seleccionar una región.')
    } else if (comuna === '') {
      setMensaje('Debe seleccionar una comuna.')
    } else if (direccion.trim() === '') {
      setMensaje('La dirección es obligatoria.')
    } else {
      setEnviando(true)

      try {
        const respuesta = await fetch(
          'http://localhost:8080/api/auth/registro',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              run: run.toUpperCase(),
              nombre: nombre.trim(),
              apellidos: apellidos.trim(),
              email: correoNormalizado,
              password,
              region,
              comuna,
              direccion: direccion.trim()
            })
          }
        )

        if (respuesta.status === 409) {
          setMensaje('El RUN o el correo ya están registrados.')
        } else if (respuesta.status === 400) {
          setMensaje('Los datos ingresados no son válidos.')
        } else if (!respuesta.ok) {
          setMensaje('No se pudo realizar el registro.')
        } else {
          setExito(true)
          setMensaje('Registro realizado correctamente.')

          setRun('')
          setNombre('')
          setApellidos('')
          setEmail('')
          setPassword('')
          setConfirmarPassword('')
          setRegion('')
          setComuna('')
          setDireccion('')
        }
      } catch {
        setMensaje('No se pudo conectar con el servidor.')
      } finally {
        setEnviando(false)
      }
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
            maxLength={9}
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
            maxLength={50}
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
            maxLength={49}
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
            maxLength={100}
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="password">
            Contraseña
          </label>
          <input
            className="form-control"
            id="password"
            type="password"
            autoComplete="new-password"
            maxLength={18}
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label" htmlFor="confirmarPassword">
            Confirmar contraseña
          </label>
          <input
            className="form-control"
            id="confirmarPassword"
            type="password"
            autoComplete="new-password"
            maxLength={18}
            value={confirmarPassword}
            onChange={(evento) =>
              setConfirmarPassword(evento.target.value)
            }
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
            maxLength={200}
            value={direccion}
            onChange={(evento) => setDireccion(evento.target.value)}
          />
        </div>

        {mensaje !== '' && (
          <div className="col-12">
            <div
              className={`alert ${
                exito ? 'alert-success' : 'alert-danger'
              } text-center`}
              role="alert"
            >
              {mensaje}
            </div>
          </div>
        )}

        <div className="col-12 text-center">
          <button
            className="btn boton-smartpark"
            type="submit"
            disabled={enviando}
          >
            {enviando ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default RegistroPage