package cl.duoc.smartpark.service;

import cl.duoc.smartpark.dto.RegistroRequest;
import cl.duoc.smartpark.model.Usuario;
import cl.duoc.smartpark.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.Locale;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registrar(RegistroRequest datos) {

        String email = datos.email().trim()
                .toLowerCase(Locale.ROOT);

        String run = datos.run().trim()
                .toUpperCase(Locale.ROOT);

        if (repository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El correo electrónico ya está registrado");
        }

        if (repository.existsByRun(run)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El RUN ya está registrado");
        }

        Usuario usuario = new Usuario();

        usuario.setRun(run);

        usuario.setNombre(
                datos.nombre().trim() + " " +
                datos.apellidos().trim());

        usuario.setEmail(email);

        usuario.setPassword(
                passwordEncoder.encode(datos.password()));

        usuario.setRegion(datos.region());
        usuario.setComuna(datos.comuna());
        usuario.setDireccion(datos.direccion());
        usuario.setRol("CLIENTE");

        repository.save(usuario);
    }
}