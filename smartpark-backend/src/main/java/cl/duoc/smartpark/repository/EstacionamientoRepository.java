package cl.duoc.smartpark.repository;

import cl.duoc.smartpark.model.Estacionamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EstacionamientoRepository
        extends JpaRepository<Estacionamiento, Long> {

    Optional<Estacionamiento> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);
}