package cl.duoc.smartpark.config;

import cl.duoc.smartpark.repository.UsuarioRepository;
import cl.duoc.smartpark.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    public TokenAuthenticationFilter(
            TokenService tokenService,
            UsuarioRepository usuarioRepository) {

        this.tokenService = tokenService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String encabezado = request.getHeader("Authorization");

        if (encabezado != null
                && encabezado.startsWith("Bearer ")
                && SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            String token = encabezado.substring(7);

            tokenService.validarToken(token)
                    .flatMap(usuarioRepository::findByEmail)
                    .ifPresent(usuario -> {

                        var permisos = List.of(
                                new SimpleGrantedAuthority(
                                        "ROLE_" + usuario.getRol()));

                        var autenticacion =
                                new UsernamePasswordAuthenticationToken(
                                        usuario.getEmail(),
                                        null,
                                        permisos);

                        SecurityContextHolder.getContext()
                                .setAuthentication(autenticacion);
                    });
        }

        filterChain.doFilter(request, response);
    }
}