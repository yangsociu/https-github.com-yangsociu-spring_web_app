//
//             _oo0oo_
//            o8888888o
//            88" . "88
//            (| -_- |)
//            0\  =  /0
//         ____/`---'\____
//       .'  \\|     |//  `.
//      /  \\|||  :  |||//  \
//     /  _||||| -:- |||||_  \
//     |   | \\\  -  /// |   |
//     | \_|  ''\---/''  |_/ |
//     \  .-\__  `-`  ___/-. /
//   ___`. .'  /--.--\  `. . __
//."" '<  `.___\_<|>_/___.'  >'"".
//| | :  `- \`.;`\ _ /`;.`/ - ` : | |
//\  \ `-.   \_ __\ /__ _/   .-` /  /
//=====`-.____`-.___\_____/___.-`____.-'======
//             `=---='
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//        Phật phù hộ, không bao giờ Bug
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//

// Note: Cấu hình bảo mật với Spring Security, bật CORS và JWT authentication.
package com.gamehub.config;

import com.gamehub.security.JwtAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        logger.info("Initializing PasswordEncoder");
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring SecurityFilterChain");
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // Cho phép tất cả truy cập các endpoint công khai
                        .requestMatchers("/api/v1/auth/register", "/api/v1/auth/login").permitAll()
                        .requestMatchers("/api/v1/games/public", "/api/v1/games/{id}", "/api/v1/reviews/{gameId}", "/api/v1/leaderboard").permitAll()
                        // Endpoint cho ADMIN
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ADMIN")
                        // Endpoint cho DEVELOPER
                        .requestMatchers("/api/v1/games/**").hasAuthority("DEVELOPER")
                        // Endpoint cho PLAYER
                        .requestMatchers("/api/v1/games/**", "/api/v1/reviews", "/api/v1/points/**").hasAuthority("PLAYER")
                        // Tất cả các request khác yêu cầu xác thực
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        logger.info("Configuring CORS");
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
