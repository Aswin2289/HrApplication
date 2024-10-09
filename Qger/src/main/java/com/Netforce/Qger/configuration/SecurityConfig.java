package com.Netforce.Qger.configuration;

import com.Netforce.Qger.security.JwtAuthenticationEntryPoint;
import com.Netforce.Qger.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;
    private final JwtFilter filter;

    public static final String ADMIN = "ADMIN";

    @Autowired
    public SecurityConfig(JwtAuthenticationEntryPoint authenticationEntryPoint, JwtFilter filter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.filter = filter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(c -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(e -> e.authenticationEntryPoint(authenticationEntryPoint))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
//                        .requestMatchers("/api/v1/user/add").permitAll()
                        .requestMatchers("/api/v1/user/login").permitAll())
                .authorizeHttpRequests(a -> a
                        .requestMatchers(HttpMethod.POST, "/api/v1/role").hasAnyAuthority(ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/v1/department").hasAnyAuthority(ADMIN)
                        .anyRequest().authenticated());

        http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }



    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/v1/**") // Cleaned up the path pattern
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Specify allowed HTTP methods
//                        .allowedOrigins("http://192.168.1.196:3000","http://10.5.17.110:3000","*")
//                        .allowedOrigins("*")
                        .allowedOrigins("http://qgerhr.com", "http://www.qgerhr.com", "https://qgerhr.com", "https://www.qgerhr.com","http://159.65.157.0:3000","http://192.168.1.196:3000")
                        .allowedOriginPatterns("*")
                        .allowCredentials(true);
            }
        };
    }
}
