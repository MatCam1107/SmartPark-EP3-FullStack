import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Estacionamiento } from '../data/estacionamientos'

function DetalleEstacionamientoPage() {
  const { codigo } = useParams()

  const [estacionamientoSeleccionado, setEstacionamientoSeleccionado] =
    useState<Estacionamiento | null>(null)

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    fetch(
      `http://localhost:8080/api/estacionamientos/codigo/${encodeURIComponent(codigo ?? '')}`,
      { signal: controlador.signal }
    )
      .then((respuesta) => {
        if (respuesta.status === 404) {
          throw new Error('Estacionamiento no encontrado')
        }

        if (!respuesta.ok) {
          throw new Error('Error al obtener el estacionamiento')
        }

        return respuesta.json()
      })
      .then((datos) => {
        setEstacionamientoSeleccionado(datos)
        setError('')
        setCargando(false)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setEstacionamientoSeleccionado(null)
          setError(error.message)
          setCargando(false)
        }
      })

    return () => controlador.abort()
  }, [codigo])

  if (cargando) {
    return (
      <main className="container py-5 text-center">
        <h1>Cargando estacionamiento...</h1>
      </main>
    )
  }

  if (error || !estacionamientoSeleccionado) {
    return (
      <main className="container py-5 text-center">
        <h1>{error || 'Estacionamiento no encontrado'}</h1>

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