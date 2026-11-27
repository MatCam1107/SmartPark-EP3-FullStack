import TarjetaEstacionamiento from '../molecules/TarjetaEstacionamiento'
import {
  estacionamientos,
  type Estacionamiento
} from '../../data/estacionamientos'

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
  return (
    <section className="container py-4">
      <h1 className="text-center mb-4">
        Estacionamientos disponibles
      </h1>

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