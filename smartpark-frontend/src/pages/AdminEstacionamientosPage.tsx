import { useEffect, useState, type SubmitEvent } from 'react'
import { Navigate } from 'react-router-dom'

interface Estacionamiento {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  espaciosDisponibles: number
  imagen: string
}

interface Sesion {
  rol: string
  token: string
}

const API = 'http://localhost:8080/api/estacionamientos'

const formularioInicial = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  espaciosDisponibles: '',
  imagen: ''
}

function obtenerSesion(): Sesion | null {
  try {
    return JSON.parse(localStorage.getItem('sesion') || 'null')
  } catch {
    return null
  }
}

function AdminEstacionamientosPage() {
  const sesion = obtenerSesion()
  const token = sesion?.token
  const autorizado = sesion?.rol === 'ADMIN' && !!token

  const [estacionamientos, setEstacionamientos] =
    useState<Estacionamiento[]>([])

  const [formulario, setFormulario] =
    useState(formularioInicial)

  const [idEdicion, setIdEdicion] =
    useState<number | null>(null)

  const [mensaje, setMensaje] = useState('')
  const [exito, setExito] = useState(false)
  const [ocupado, setOcupado] = useState(false)

  const cargarEstacionamientos = async () => {
    const respuesta = await fetch(API)

    if (!respuesta.ok) {
      throw new Error('No se pudo cargar el listado.')
    }

    setEstacionamientos(await respuesta.json())
  }

  useEffect(() => {
    if (autorizado) {
      fetch(API)
        .then((respuesta) => {
          if (!respuesta.ok) {
            throw new Error('Error de conexión')
          }

          return respuesta.json()
        })
        .then(setEstacionamientos)
        .catch(() => {
          setMensaje('No se pudo cargar el listado.')
          setExito(false)
        })
    }
  }, [autorizado])

  const actualizarCampo = (
    campo: keyof typeof formularioInicial,
    valor: string
  ) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor
    }))
  }

  const cancelarEdicion = () => {
    setFormulario(formularioInicial)
    setIdEdicion(null)
    setMensaje('')
  }

  const guardar = async (
    evento: SubmitEvent<HTMLFormElement>
  ) => {
    evento.preventDefault()

    setMensaje('')
    setExito(false)

    const precio = Number(formulario.precio)
    const espacios = Number(formulario.espaciosDisponibles)

    if (
      !formulario.codigo.trim() ||
      !formulario.nombre.trim() ||
      formulario.precio === '' ||
      formulario.espaciosDisponibles === '' ||
      !Number.isFinite(precio) ||
      precio <= 0 ||
      !Number.isInteger(espacios) ||
      espacios < 0
    ) {
      setMensaje('Revise los datos ingresados.')
      return
    }

    setOcupado(true)

    try {
      const respuesta = await fetch(
        idEdicion === null ? API : `${API}/${idEdicion}`,
        {
          method: idEdicion === null ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            codigo: formulario.codigo.trim().toUpperCase(),
            nombre: formulario.nombre.trim(),
            descripcion: formulario.descripcion.trim(),
            precio,
            espaciosDisponibles: espacios,
            imagen: formulario.imagen.trim()
          })
        }
      )

      if (respuesta.status === 401) {
        setMensaje('La sesión expiró. Inicie sesión nuevamente.')
      } else if (respuesta.status === 403) {
        setMensaje('No tiene permisos para realizar esta operación.')
      } else if (respuesta.status === 409) {
        setMensaje('El código del estacionamiento ya existe.')
      } else if (respuesta.status === 400) {
        setMensaje('Los datos ingresados no son válidos.')
      } else if (!respuesta.ok) {
        setMensaje('No se pudo guardar el estacionamiento.')
      } else {
        setExito(true)

        setMensaje(
          idEdicion === null
            ? 'Estacionamiento creado correctamente.'
            : 'Estacionamiento actualizado correctamente.'
        )

        setFormulario(formularioInicial)
        setIdEdicion(null)

        await cargarEstacionamientos()
      }
    } catch {
      setExito(false)
      setMensaje('No se pudo completar la operación o actualizar el listado.')
    } finally {
      setOcupado(false)
    }
  }

  const editar = (estacionamiento: Estacionamiento) => {
    setIdEdicion(estacionamiento.id)
    setMensaje('')

    setFormulario({
      codigo: estacionamiento.codigo,
      nombre: estacionamiento.nombre,
      descripcion: estacionamiento.descripcion || '',
      precio: String(estacionamiento.precio),
      espaciosDisponibles: String(
        estacionamiento.espaciosDisponibles
      ),
      imagen: estacionamiento.imagen || ''
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminar = async (estacionamiento: Estacionamiento) => {
    const confirmar = window.confirm(
      `¿Desea eliminar ${estacionamiento.nombre}?`
    )

    if (!confirmar) {
      return
    }

    setOcupado(true)
    setMensaje('')
    setExito(false)

    try {
      const respuesta = await fetch(
        `${API}/${estacionamiento.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (respuesta.status === 401) {
        setMensaje('La sesión expiró. Inicie sesión nuevamente.')
      } else if (respuesta.status === 403) {
        setMensaje('No tiene permisos para eliminar.')
      } else if (!respuesta.ok) {
        setMensaje('No se pudo eliminar el estacionamiento.')
      } else {
        if (idEdicion === estacionamiento.id) {
          cancelarEdicion()
        }

        setExito(true)
        setMensaje('Estacionamiento eliminado correctamente.')

        await cargarEstacionamientos()
      }
    } catch {
      setExito(false)
      setMensaje('No se pudo completar la operación o actualizar el listado.')
    } finally {
      setOcupado(false)
    }
  }

  if (!autorizado) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4 text-center">
        Administración de estacionamientos
      </h1>

      <section className="card shadow-sm p-4 mb-5">
        <h2 className="h4 mb-4">
          {idEdicion === null
            ? 'Nuevo estacionamiento'
            : 'Editar estacionamiento'}
        </h2>

        <form className="row g-3" onSubmit={guardar}>
          <div className="col-md-6">
            <label className="form-label" htmlFor="codigo">
              Código
            </label>
            <input
              id="codigo"
              className="form-control"
              maxLength={20}
              required
              value={formulario.codigo}
              onChange={(e) =>
                actualizarCampo('codigo', e.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              className="form-control"
              maxLength={100}
              required
              value={formulario.nombre}
              onChange={(e) =>
                actualizarCampo('nombre', e.target.value)
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              className="form-control"
              maxLength={500}
              rows={3}
              value={formulario.descripcion}
              onChange={(e) =>
                actualizarCampo('descripcion', e.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="precio">
              Precio
            </label>
            <input
              id="precio"
              className="form-control"
              type="number"
              min="0.01"
              max="99999999.99"
              step="0.01"
              required
              value={formulario.precio}
              onChange={(e) =>
                actualizarCampo('precio', e.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="espacios">
              Espacios disponibles
            </label>
            <input
              id="espacios"
              className="form-control"
              type="number"
              min="0"
              max="2147483647"
              step="1"
              required
              value={formulario.espaciosDisponibles}
              onChange={(e) =>
                actualizarCampo(
                  'espaciosDisponibles',
                  e.target.value
                )
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="imagen">
              Ruta de la imagen
            </label>
            <input
              id="imagen"
              className="form-control"
              maxLength={255}
              placeholder="/estacionamiento-centro.jpg"
              value={formulario.imagen}
              onChange={(e) =>
                actualizarCampo('imagen', e.target.value)
              }
            />
          </div>

          <div className="col-12 d-flex gap-2">
            <button
              className="btn boton-smartpark"
              type="submit"
              disabled={ocupado}
            >
              {ocupado
                ? 'Procesando...'
                : idEdicion === null
                  ? 'Crear estacionamiento'
                  : 'Guardar cambios'}
            </button>

            {idEdicion !== null && (
              <button
                className="btn btn-secondary"
                type="button"
                disabled={ocupado}
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {mensaje && (
        <div
          className={`alert ${
            exito ? 'alert-success' : 'alert-danger'
          }`}
          role="alert"
        >
          {mensaje}
        </div>
      )}

      <section>
        <h2 className="h4 mb-3">
          Estacionamientos registrados
        </h2>

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Espacios</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {estacionamientos.map((estacionamiento) => (
                <tr key={estacionamiento.id}>
                  <td>{estacionamiento.codigo}</td>
                  <td>{estacionamiento.nombre}</td>
                  <td>${estacionamiento.precio}</td>
                  <td>
                    {estacionamiento.espaciosDisponibles}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        disabled={ocupado}
                        onClick={() => editar(estacionamiento)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={ocupado}
                        onClick={() => eliminar(estacionamiento)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default AdminEstacionamientosPage