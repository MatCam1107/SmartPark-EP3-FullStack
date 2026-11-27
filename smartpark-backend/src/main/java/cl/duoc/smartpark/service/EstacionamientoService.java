package cl.duoc.smartpark.service;

import cl.duoc.smartpark.model.Estacionamiento;
import cl.duoc.smartpark.repository.EstacionamientoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EstacionamientoService {

    private final EstacionamientoRepository repository;

    public EstacionamientoService(
            EstacionamientoRepository repository) {
        this.repository = repository;
    }

    public List<Estacionamiento> listarTodos() {
        return repository.findAll();
    }

    public Optional<Estacionamiento> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Optional<Estacionamiento> buscarPorCodigo(String codigo) {
        return repository.findByCodigo(codigo);
    }

    public boolean existeCodigo(String codigo) {
        return repository.existsByCodigo(codigo);
    }

    public Estacionamiento guardar(Estacionamiento estacionamiento) {
        return repository.save(estacionamiento);
    }

    public Optional<Estacionamiento> actualizar(
            Long id, Estacionamiento datos) {

        return repository.findById(id).map(estacionamiento -> {

            estacionamiento.setCodigo(datos.getCodigo());
            estacionamiento.setNombre(datos.getNombre());
            estacionamiento.setDescripcion(datos.getDescripcion());
            estacionamiento.setPrecio(datos.getPrecio());
            estacionamiento.setEspaciosDisponibles(
                    datos.getEspaciosDisponibles());
            estacionamiento.setImagen(datos.getImagen());

            return repository.save(estacionamiento);
        });
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}