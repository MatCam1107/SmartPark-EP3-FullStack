package cl.duoc.smartpark.controller;

import cl.duoc.smartpark.model.Estacionamiento;
import cl.duoc.smartpark.service.EstacionamientoService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/estacionamientos")
@Tag(name = "Estacionamientos",
        description = "Gestion de estacionamientos SmartPark")
public class EstacionamientoController {

    private final EstacionamientoService service;

    public EstacionamientoController(
            EstacionamientoService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar todos los estacionamientos")
    public List<Estacionamiento> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar estacionamiento por ID")
    public ResponseEntity<Estacionamiento> buscarPorId(
            @PathVariable Long id) {

        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Buscar estacionamiento por codigo")
    public ResponseEntity<Estacionamiento> buscarPorCodigo(
            @PathVariable String codigo) {

        return service.buscarPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear estacionamiento",
            description = "Requiere rol ADMIN")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Estacionamiento> crear(
            @Valid @RequestBody Estacionamiento estacionamiento) {

        if (service.existeCodigo(estacionamiento.getCodigo())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        estacionamiento.setId(null);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.guardar(estacionamiento));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar estacionamiento",
            description = "Requiere rol ADMIN")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Estacionamiento> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Estacionamiento estacionamiento) {

        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var existente = service.buscarPorCodigo(
                estacionamiento.getCodigo());

        if (existente.isPresent()
                && !existente.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        return service.actualizar(id, estacionamiento)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar estacionamiento",
            description = "Requiere rol ADMIN")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {

        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}