package cl.duoc.smartpark.service;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final long expiration;

    private final Map<String, Instant> tokensRevocados =
            new ConcurrentHashMap<>();

    public TokenService(
            @Value("${smartpark.jwt.secret}") String secret,
            @Value("${smartpark.jwt.expiration}") long expiration) {

        byte[] bytes = Base64.getDecoder().decode(secret);

        SecretKey clave = new SecretKeySpec(
                bytes, "HmacSHA256");

        this.encoder = new NimbusJwtEncoder(
                new ImmutableSecret<>(clave));

        this.decoder = NimbusJwtDecoder
                .withSecretKey(clave)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();

        this.expiration = expiration;
    }

    // Generar un JWT firmado
    public String generarToken(String email) {

        Instant ahora = Instant.now();

        limpiarTokensRevocados();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(email)
                .issuedAt(ahora)
                .expiresAt(ahora.plusSeconds(expiration))
                .id(UUID.randomUUID().toString())
                .build();

        JwsHeader encabezado = JwsHeader
                .with(MacAlgorithm.HS256)
                .build();

        return encoder.encode(
                JwtEncoderParameters.from(encabezado, claims))
                .getTokenValue();
    }

    // Validar firma, vencimiento y revocacion
    public Optional<String> validarToken(String token) {

        try {

            Jwt jwt = decoder.decode(token);

            Instant vencimiento = jwt.getExpiresAt();

            if (vencimiento == null
                    || !vencimiento.isAfter(Instant.now())
                    || jwt.getId() == null
                    || tokensRevocados.containsKey(jwt.getId())) {

                return Optional.empty();
            }

            return Optional.ofNullable(jwt.getSubject());

        } catch (JwtException | IllegalArgumentException e) {

            return Optional.empty();
        }
    }

    // Invalidar el JWT al cerrar sesion
    public void eliminarToken(String token) {

        try {

            Jwt jwt = decoder.decode(token);

            if (jwt.getId() != null
                    && jwt.getExpiresAt() != null
                    && jwt.getExpiresAt().isAfter(Instant.now())) {

                tokensRevocados.put(
                        jwt.getId(),
                        jwt.getExpiresAt());
            }

            limpiarTokensRevocados();

        } catch (JwtException | IllegalArgumentException e) {

            // El token ya es invalido.
        }
    }

    // Eliminar revocaciones de tokens vencidos
    private void limpiarTokensRevocados() {

        Instant ahora = Instant.now();

        tokensRevocados.entrySet().removeIf(
                entrada -> !entrada.getValue().isAfter(ahora));
    }
}