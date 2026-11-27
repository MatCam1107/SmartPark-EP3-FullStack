import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  const navigate = useNavigate()

  const iniciarSesion = async (
    evento: SubmitEvent<HTMLFormElement>
  ) => {
    evento.preventDefault()

    setMensaje('')

    const correoNormalizado = email.trim().toLowerCase()

    const correoValido =
      correoNormalizado.endsWith('@duoc.cl') ||
      correoNormalizado.endsWith('@profesor.duoc.cl') ||
      correoNormalizado.endsWith('@gmail.com')

    if (correoNormalizado === '') {
      setMensaje('El correo electrónico es obligatorio.')
    } else if (!correoValido) {
      setMensaje('El correo electrónico no es válido.')
    } else if (password === '') {
      setMensaje('La contraseña es obligatoria.')
    } else if (password.length < 8 || password.length > 18) {
      setMensaje(
        'La contraseña debe tener entre 8 y 18 caracteres.'
      )
    } else {
      setEnviando(true)

      try {
        const respuesta = await fetch(
          'http://localhost:8080/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: correoNormalizado,
              password
            })
          }
        )

        if (respuesta.status === 401) {
          setMensaje('Correo o contraseña incorrectos.')
        } else if (respuesta.status === 400) {
          setMensaje('Los datos ingresados no son válidos.')
        } else if (!respuesta.ok) {
          setMensaje('No se pudo iniciar sesión.')
        } else {
          const datos = await respuesta.json()

          const sesion = {
            id: datos.id,
            nombre: datos.nombre,
            email: datos.email,
            rol: datos.rol,
            token: datos.token
          }

          localStorage.setItem(
            'sesion',
            JSON.stringify(sesion)
          )

          setPassword('')

          alert(`Bienvenido, ${datos.nombre}.`)

          navigate('/')
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
      <h1 className="mb-4">Iniciar sesión</h1>

      <form
        className="mx-auto"
        style={{ maxWidth: '500px' }}
        onSubmit={iniciarSesion}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="email-login">
            Correo electrónico
          </label>

          <input
            className="form-control"
            id="email-login"
            type="email"
            autoComplete="email"
            maxLength={100}
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </div>

        <div className="mb-3">
          <label
            className="form-label"
            htmlFor="password-login"
          >
            Contraseña
          </label>

          <input
            className="form-control"
            id="password-login"
            type="password"
            autoComplete="current-password"
            maxLength={18}
            value={password}
            onChange={(evento) =>
              setPassword(evento.target.value)
            }
          />
        </div>

        {mensaje !== '' && (
          <div
            className="alert alert-danger text-center"
            role="alert"
          >
            {mensaje}
          </div>
        )}

        <div className="text-center">
          <button
            className="btn boton-smartpark"
            type="submit"
            disabled={enviando}
          >
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </form>
    </main>
  )
}

export default LoginPage