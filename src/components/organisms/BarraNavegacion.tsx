import { Link } from 'react-router-dom'

function BarraNavegacion() {
  return (
    <nav className="navbar barra-smartpark">
      <div className="container d-flex flex-wrap">
        <Link className="navbar-brand text-white" to="/">
          SmartPark
        </Link>

        <div className="d-flex flex-wrap gap-3">
          <Link className="nav-link text-white" to="/">
            Inicio
          </Link>

          <Link
            className="nav-link text-white"
            to="/estacionamientos"
          >
            Estacionamientos
          </Link>

          <Link className="nav-link text-white" to="/registro">
            Registro
          </Link>

          <Link className="nav-link text-white" to="/login">
            Iniciar sesión
          </Link>

          <Link className="nav-link text-white" to="/carrito">
            Carrito
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default BarraNavegacion