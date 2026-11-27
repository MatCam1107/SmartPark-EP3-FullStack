import { useEffect, useState } from 'react'
import TarjetaEstacionamiento from '../molecules/TarjetaEstacionamiento'
import type { Estacionamiento } from '../../data/estacionamientos'

function agregarAlCarrito(estacionamiento: Estacionamiento) {
  const carritoGuardado = localStorage.getItem('carrito')

  const carrito: Estacionamiento[] = carritoGuardado
    ? JSON.parse(carritoGuardado)
    : []

  const yaExiste = carrito.some(
    (item) => item.codigo === estacionamiento.codigo
  )

  if (yaExiste) {
    alert('Este estacionamiento ya está en el carrito.')
    return
  }

  const carritoActualizado = [...carrito, estacionamiento]

  localStorage.setItem(
    'carrito',
    JSON.stringify(carritoActualizado)
  )

  alert(`${estacionamiento.nombre} añadido al carrito.`)
}

function CatalogoEstacionamientos() {

  const [estacionamientos, setEstacionamientos] =
    useState<Estacionamiento[]>([])

  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/api/estacionamientos')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Error al obtener los estacionamientos')
        }

        return respuesta.json()
      })
      .then((datos) => setEstacionamientos(datos))
      .catch(() => {
        setError('No se pudo conectar con el servidor.')
      })
  }, [])

  return (
    <section className="container py-4">
      <h1 className="text-center mb-4">
        Estacionamientos disponibles
      </h1>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row g-4">
        {estacionamientos.map((estacionamiento) => (
          <div
            className="col-12 col-md-6 col-lg-4"
            key={estacionamiento.codigo}
          >
            <TarjetaEstacionamiento
              codigo={estacionamiento.codigo}
              nombre={estacionamiento.nombre}
              descripcion={estacionamiento.descripcion}
              precio={estacionamiento.precio}
              espaciosDisponibles={estacionamiento.espaciosDisponibles}
              imagen={estacionamiento.imagen}
              onAgregar={() =>
                agregarAlCarrito(estacionamiento)
              }
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default CatalogoEstacionamientos