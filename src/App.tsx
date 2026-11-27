import { Route, Routes } from 'react-router-dom'
import BarraNavegacion from './components/organisms/BarraNavegacion'
import InicioPage from './pages/InicioPage'
import EstacionamientosPage from './pages/EstacionamientosPage'
import DetalleEstacionamientoPage from './pages/DetalleEstacionamientoPage'
import RegistroPage from './pages/RegistroPage'
import LoginPage from './pages/LoginPage'
import CarritoPage from './pages/CarritoPage'

function App() {
  return (
    <>
      <BarraNavegacion />

      <Routes>
        <Route
          path="/"
          element={<InicioPage />}
        />

        <Route
          path="/estacionamientos"
          element={<EstacionamientosPage />}
        />

        <Route
          path="/estacionamientos/:codigo"
          element={<DetalleEstacionamientoPage />}
        />

        <Route
          path="/registro"
          element={<RegistroPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/carrito"
          element={<CarritoPage />}
        />
      </Routes>
    </>
  )
}

export default App