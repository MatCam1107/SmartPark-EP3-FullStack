import { useState } from 'react'
import Boton from '../components/atoms/Boton'
import type { Estacionamiento } from '../data/estacionamientos'

function CarritoPage() {
  const [carrito, setCarrito] = useState<Estacionamiento[]>(() => {
    const carritoGuardado = localStorage.getItem('carrito')

    return carritoGuardado
      ? JSON.parse(carritoGuardado)
      : []
  })

  const eliminarDelCarrito = (codigo: string) => {
    const carritoActualizado = carrito.filter(
      (estacionamiento) => estacionamiento.codigo !== codigo
    )

    setCarrito(carritoActualizado)

    localStorage.setItem(
      'carrito',
      JSON.stringify(carritoActualizado)
    )
  }

  const total = carrito.reduce(
    (acumulador, estacionamiento) =>
      acumulador + estacionamiento.precio,
    0
  )

  return (
    <main className="container py-5">
      <h1 className="mb-4">Carrito</h1>

      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <div className="row g-4">
            {carrito.map((estacionamiento) => (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={estacionamiento.codigo}
              >
                <div className="card h-100">
                  <img
                    className="card-img-top imagen-estacionamiento"
                    src={estacionamiento.imagen}
                    alt={estacionamiento.nombre}
                  />

                  <div className="card-body text-center">
                    <h2 className="h5">
                      {estacionamiento.nombre}
                    </h2>

                    <p>Precio: ${estacionamiento.precio}</p>

                    <Boton
                      texto="Eliminar"
                      onClick={() =>
                        eliminarDelCarrito(estacionamiento.codigo)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-center mt-4">
            Total: ${total}
          </h2>
        </>
      )}
    </main>
  )
}

export default CarritoPage