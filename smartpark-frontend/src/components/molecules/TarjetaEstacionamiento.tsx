import { Link } from 'react-router-dom'
import Boton from '../atoms/Boton'

interface TarjetaEstacionamientoProps {
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  espaciosDisponibles: number
  imagen: string
  onAgregar: () => void
}

function TarjetaEstacionamiento({
  codigo,
  nombre,
  descripcion,
  precio,
  espaciosDisponibles,
  imagen,
  onAgregar
}: TarjetaEstacionamientoProps) {
  return (
    <div className="card h-100">
      <img
        className="card-img-top imagen-estacionamiento"
        src={imagen}
        alt={nombre}
      />

      <div className="card-body d-flex flex-column">
        <h2 className="card-title h5">{nombre}</h2>
        <p className="card-text">{descripcion}</p>
        <p>Precio: ${precio}</p>
        <p>Espacios disponibles: {espaciosDisponibles}</p>

        <div className="mt-auto">
          <Boton texto="Añadir" onClick={onAgregar} />

          <Link
            className="btn boton-smartpark ms-2"
            to={`/estacionamientos/${codigo}`}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TarjetaEstacionamiento