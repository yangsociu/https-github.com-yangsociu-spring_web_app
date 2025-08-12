// Note: Xử lý logic tích điểm cho người chơi (tải game, viết review).
package com.gamehub.service;

import com.gamehub.exception.GameException;
import com.gamehub.model.Game;
import com.gamehub.model.PointTransaction;
import com.gamehub.model.User;
import com.gamehub.model.enums.PointActionType;
import com.gamehub.repository.GameRepository;
import com.gamehub.repository.PointTransactionRepository;
import com.gamehub.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class PointService {

    private static final Logger logger = LoggerFactory.getLogger(PointService.class);

    @Autowired
    private PointTransactionRepository pointTransactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    public void awardPoints(Long playerId, Long gameId, String actionType, Long points) throws GameException {
        logger.info("Awarding {} points to player {} for action {}", points, playerId, actionType);

        User player = userRepository.findById(playerId)
                .orElseThrow(() -> {
                    logger.warn("User not found: {}", playerId);
                    return new GameException("User not found");
                });

        Game game = null;
        if (gameId != null) {
            game = gameRepository.findById(gameId)
                    .orElseThrow(() -> {
                        logger.warn("Game not found: {}", gameId);
                        return new GameException("Game not found");
                    });
            if (!game.isSupportPoints()) {
                logger.warn("Game does not support points: {}", gameId);
                throw new GameException("Game does not support points");
            }
        }

        PointActionType pointActionType;
        try {
            pointActionType = PointActionType.valueOf(actionType.toUpperCase());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid action type: {}", actionType);
            throw new GameException("Invalid action type");
        }

        // Kiểm tra để tránh cộng điểm trùng lặp (Cơ chế tích điểm 1 lần check ID đã có action tíchdideeiem -> ném ra ngoại lệ)
        if (gameId != null && pointTransactionRepository.existsByPlayerIdAndGameIdAndActionType(playerId, gameId, pointActionType)) {
            logger.warn("Points already awarded for player {} and game {} for action {}", playerId, gameId, actionType);
            throw new GameException("Points already awarded for this action");
        }

        PointTransaction transaction = new PointTransaction(
                player,
                game,
                pointActionType,
                points,
                LocalDateTime.now()
        );

        try {
            pointTransactionRepository.save(transaction);
            player.setTotalPoints(player.getTotalPoints() + points);
            userRepository.save(player);
            logger.info("Points awarded successfully: PlayerID={}, Points={}, Action={}", playerId, points, actionType);
        } catch (Exception e) {
            logger.error("Error awarding points: {}", e.getMessage());
            throw new GameException("Error awarding points");
        }
    }
}
