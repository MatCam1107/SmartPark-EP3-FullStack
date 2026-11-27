export interface Estacionamiento {
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  espaciosDisponibles: number
  imagen: string
}

export const estacionamientos: Estacionamiento[] = [
  {
    codigo: 'EST001',
    nombre: 'Estacionamiento Centro',
    descripcion: 'Estacionamiento ubicado en el centro de la ciudad.',
    precio: 1500,
    espaciosDisponibles: 10,
    imagen: '/estacionamiento-centro.jpg'
  },
  {
    codigo: 'EST002',
    nombre: 'Estacionamiento Mall',
    descripcion: 'Estacionamiento ubicado cerca del centro comercial.',
    precio: 2000,
    espaciosDisponibles: 5,
    imagen: '/estacionamiento-mall.jpg'
  },
  {
    codigo: 'EST003',
    nombre: 'Estacionamiento Aeropuerto',
    descripcion: 'Estacionamiento ubicado cerca del aeropuerto.',
    precio: 3000,
    espaciosDisponibles: 8,
    imagen: '/estacionamiento-aeropuerto.jpg'
  },
  {
    codigo: 'EST004',
    nombre: 'Estacionamiento Centro Médico',
    descripcion: 'Estacionamiento ubicado junto al centro médico.',
    precio: 2500,
    espaciosDisponibles: 12,
    imagen: '/estacionamiento-hospital.svg'
    }


]