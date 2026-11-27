import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  const navigate = useNavigate()

  const iniciarSesion = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const correoValido =
      email.endsWith('@duoc.cl') ||
      email.endsWith('@profesor.duoc.cl') ||
      email.endsWith('@gmail.com')

    if (email === '') {
      setMensaje('El correo electrónico es obligatorio.')
    } else if (!correoValido) {
      setMensaje('El correo electrónico no es válido.')
    } else if (password === '') {
      setMensaje('La contraseña es obligatoria.')
    } else if (password.length < 4 || password.length > 10) {
      setMensaje('La contraseña debe tener entre 4 y 10 caracteres.')
    } else {
      let rol = 'Cliente'

      if (email.endsWith('@profesor.duoc.cl')) {
        rol = 'Administrador'
      } else if (email.endsWith('@duoc.cl')) {
        rol = 'Vendedor'
      }

      const sesion = {
        email: email,
        rol: rol
      }

      localStorage.setItem(
        'sesion',
        JSON.stringify(sesion)
      )

      alert(`Inicio de sesión correcto. Rol: ${rol}.`)

      navigate('/')
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
            value={password}
            onChange={(evento) =>
              setPassword(evento.target.value)
            }
          />
        </div>

        {mensaje !== '' && (
          <div className="alert alert-info text-center">
            {mensaje}
          </div>
        )}

        <div className="text-center">
          <button
            className="btn boton-smartpark"
            type="submit"
          >
            Ingresar
          </button>
        </div>
      </form>
    </main>
  )
}

export default LoginPage