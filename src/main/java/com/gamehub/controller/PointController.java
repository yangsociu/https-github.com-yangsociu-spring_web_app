// Note: Controller xử lý các request liên quan đến tích điểm (tải game).
package com.gamehub.controller;

import com.gamehub.dto.GameResponse;
import com.gamehub.exception.GameException;
import com.gamehub.repository.UserRepository;
import com.gamehub.service.GameService;
import com.gamehub.service.PointService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/v1/points")
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
        logger.info("Track download request: PlayerID={}, GameID={}", playerId, gameId);

        // Kiểm tra người dùng đăng nhập
        if (authentication == null || !authentication.getName().equals(userRepository.findById(playerId).orElseThrow().getEmail())) {
            logger.warn("Unauthorized download tracking attempt: PlayerID={}", playerId);
            throw new GameException("Unauthorized");
        }

        try {
            // Thử cộng điểm, nếu đã cộng rồi thì bỏ qua
            pointService.awardPoints(playerId, gameId, "DOWNLOAD_GAME", 10L);
            logger.info("Points awarded successfully for download");
        } catch (Exception e) {
            logger.info("Points not awarded (may have been awarded before): {}", e.getMessage());
            // Không throw exception, vẫn cho phép download
        }

        String apkFileUrl = gameService.getGameById(gameId).getApkFileUrl();
        logger.info("Redirecting to APK URL: {}", apkFileUrl);

        // Tạo RedirectView với external URL
        RedirectView redirectView = new RedirectView(apkFileUrl);
        redirectView.setStatusCode(HttpStatus.FOUND); // 302 redirect
        return redirectView;
    }
}
