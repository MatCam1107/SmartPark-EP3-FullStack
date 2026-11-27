package cl.duoc.smartpark.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            TokenAuthenticationFilter tokenFilter) throws Exception {

        http.cors(cors ->
                cors.configurationSource(corsConfigurationSource()));

        http.csrf(csrf -> csrf.disable());

        http.sessionManagement(session ->
                session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS));

        http.exceptionHandling(excepciones -> excepciones

                .authenticationEntryPoint(
                        (request, response, exception) ->
                                response.setStatus(
                                        HttpServletResponse.SC_UNAUTHORIZED))

                .accessDeniedHandler(
                        (request, response, exception) ->
                                response.setStatus(
                                        HttpServletResponse.SC_FORBIDDEN))
        );

        http.authorizeHttpRequests(auth -> auth

                // Permitir solicitudes de verificacion CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                // Permitir acceso a Swagger y OpenAPI
                .requestMatchers(HttpMethod.GET,
                        "/swagger-ui.html",
                        "/swagger-ui/**",
                        "/v3/api-docs",
                        "/v3/api-docs/**")
                .permitAll()

                // Registro e inicio de sesion publicos
                .requestMatchers(HttpMethod.POST,
                        "/api/auth/registro",
                        "/api/auth/login")
                .permitAll()

                // Consulta publica de estacionamientos
                .requestMatchers(HttpMethod.GET,
                        "/api/estacionamientos",
                        "/api/estacionamientos/**")
                .permitAll()

                // Creacion exclusiva del administrador
                .requestMatchers(HttpMethod.POST,
                        "/api/estacionamientos")
                .hasRole("ADMIN")

                // Actualizacion exclusiva del administrador
                .requestMatchers(HttpMethod.PUT,
                        "/api/estacionamientos/**")
                .hasRole("ADMIN")

                // Eliminacion exclusiva del administrador
                .requestMatchers(HttpMethod.DELETE,
                        "/api/estacionamientos/**")
                .hasRole("ADMIN")

                // Las demas solicitudes requieren autenticacion
                .anyRequest().authenticated()
        );

        http.addFilterBefore(
                tokenFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public FilterRegistrationBean<TokenAuthenticationFilter>
            tokenFilterRegistration(TokenAuthenticationFilter filtro) {

        FilterRegistrationBean<TokenAuthenticationFilter> registro =
                new FilterRegistrationBean<>(filtro);

        registro.setEnabled(false);

        return registro;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173"));

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(
                List.of("Content-Type", "Authorization"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/api/**", configuration);

        return source;
    }
}