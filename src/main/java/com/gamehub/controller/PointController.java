// Note: Controller xử lý các request liên quan đến tích điểm (tải game).
package com.gamehub.controller;

import com.gamehub.exception.GameException;
import com.gamehub.model.User;
import com.gamehub.repository.UserRepository;
import com.gamehub.service.GameService;
import com.gamehub.service.PointService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/points")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class PointController {

    private static final Logger logger = LoggerFactory.getLogger(PointController.class);

    @Autowired
    private PointService pointService;

    @Autowired
    private GameService gameService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/track-download")
    public RedirectView trackDownload(@RequestParam Long playerId, @RequestParam Long gameId, Authentication authentication) throws GameException {
        logger.info("Track download request: PlayerID={}, GameID={}, Auth={}", playerId, gameId, authentication != null ? authentication.getName() : "null");

        // Check if user is authenticated
        if (authentication == null) {
            logger.warn("Unauthenticated download tracking attempt: PlayerID={}", playerId);
            throw new GameException("Authentication required");
        }

        // Verify the authenticated user matches the playerId
        String authenticatedEmail = authentication.getName();
        Optional<User> userOptional = userRepository.findById(playerId);

        if (userOptional.isEmpty()) {
            logger.warn("User not found: PlayerID={}", playerId);
            throw new GameException("User not found");
        }

        User user = userOptional.get();
        if (!user.getEmail().equals(authenticatedEmail)) {
            logger.warn("Unauthorized download tracking attempt: PlayerID={}, AuthenticatedUser={}, UserEmail={}",
                    playerId, authenticatedEmail, user.getEmail());
            throw new GameException("Unauthorized - user mismatch");
        }

        // Check if user is a PLAYER
        if (!"PLAYER".equals(user.getRole().name())) {
            logger.warn("Non-player attempting to earn points: PlayerID={}, Role={}", playerId, user.getRole());
            throw new GameException("Only players can earn points");
        }

        try {
            pointService.awardPoints(playerId, gameId, "DOWNLOAD_GAME", 10L);
            logger.info("Points awarded successfully for download: PlayerID={}, GameID={}", playerId, gameId);
        } catch (Exception e) {
            logger.warn("Failed to award points (continuing with download): PlayerID={}, GameID={}, Error={}",
                    playerId, gameId, e.getMessage());
            // Continue with download even if points fail (might be duplicate download)
        }

        // Get the download URL and redirect
        try {
            String apkFileUrl = gameService.getGameById(gameId).getApkFileUrl();
            logger.info("Redirecting to APK URL: {}", apkFileUrl);
            return new RedirectView(apkFileUrl);
        } catch (Exception e) {
            logger.error("Failed to get game download URL: GameID={}, Error={}", gameId, e.getMessage());
            throw new GameException("Failed to get download URL");
        }
    }

    @PostMapping("/award-points")
    public ResponseEntity<String> awardPoints(
            @RequestParam Long playerId,
            @RequestParam Long gameId,
            @RequestParam String actionType,
            @RequestParam Long points,
            Authentication authentication) {

        try {
            logger.info("Manual point award request: PlayerID={}, GameID={}, Action={}, Points={}",
                    playerId, gameId, actionType, points);

            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
            }

            pointService.awardPoints(playerId, gameId, actionType, points);
            return ResponseEntity.ok("Points awarded successfully");
        } catch (GameException e) {
            logger.error("Failed to award points: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
