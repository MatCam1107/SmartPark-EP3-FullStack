import { Link, useParams } from 'react-router-dom'
import { estacionamientos } from '../data/estacionamientos'

function DetalleEstacionamientoPage() {
  const { codigo } = useParams()

  const estacionamientoSeleccionado = estacionamientos.find(
    (estacionamiento) => estacionamiento.codigo === codigo
  )

  if (!estacionamientoSeleccionado) {
    return (
      <main className="container py-5 text-center">
        <h1>Estacionamiento no encontrado</h1>

        <Link
          className="btn boton-smartpark"
          to="/estacionamientos"
        >
          Volver a estacionamientos
        </Link>
      </main>
    )
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <img
            className="img-fluid rounded mb-4"
            src={estacionamientoSeleccionado.imagen}
            alt={estacionamientoSeleccionado.nombre}
          />

          <h1>{estacionamientoSeleccionado.nombre}</h1>
          <p>{estacionamientoSeleccionado.descripcion}</p>
          <p>Precio: ${estacionamientoSeleccionado.precio}</p>
          <p>
            Espacios disponibles:{' '}
            {estacionamientoSeleccionado.espaciosDisponibles}
          </p>

          <Link
            className="btn boton-smartpark"
            to="/estacionamientos"
          >
            Volver a estacionamientos
          </Link>
        </div>
      </div>
    </main>
  )
}

export default DetalleEstacionamientoPage
