import { Link, useLocation, useNavigate } from 'react-router-dom'

interface Sesion {
  id: number
  nombre: string
  email: string
  rol: string
  token: string
}

function obtenerSesion(): Sesion | null {
  try {
    const datos = localStorage.getItem('sesion')

    if (!datos) {
      return null
    }

    const sesion = JSON.parse(datos)

    return sesion.token ? sesion : null
  } catch {
    return null
  }
}

function BarraNavegacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const sesion = obtenerSesion()

  const cerrarSesion = async () => {
    try {
      if (sesion?.token) {
        await fetch(
          'http://localhost:8080/api/auth/logout',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sesion.token}`
            }
          }
        )
      }
    } catch {
      console.warn('No se pudo conectar con el servidor.')
    } finally {
      localStorage.removeItem('sesion')
      navigate('/', { replace: true })
    }
  }

  return (
    <nav
      className="navbar barra-smartpark"
      key={location.key}
    >
      <div className="container d-flex flex-wrap">
        <Link className="navbar-brand text-white" to="/">
          SmartPark
        </Link>

        <div className="d-flex flex-wrap gap-3 align-items-center">
          <Link className="nav-link text-white" to="/">
            Inicio
          </Link>

          <Link
            className="nav-link text-white"
            to="/estacionamientos"
          >
            Estacionamientos
          </Link>

          {!sesion && (
            <>
              <Link
                className="nav-link text-white"
                to="/registro"
              >
                Registro
              </Link>

              <Link
                className="nav-link text-white"
                to="/login"
              >
                Iniciar sesión
              </Link>
            </>
          )}

          <Link
            className="nav-link text-white"
            to="/carrito"
          >
            Carrito
          </Link>

          {sesion?.rol === 'ADMIN' && (
            <Link
              className="nav-link text-white"
              to="/admin/estacionamientos"
            >
              Administración
            </Link>
          )}

          {sesion && (
            <>
              <span className="text-white">
                Hola, {sesion.nombre}
              </span>

              <button
                className="btn btn-outline-light btn-sm"
                type="button"
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default BarraNavegacion