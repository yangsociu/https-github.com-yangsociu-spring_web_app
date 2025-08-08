// Note: Xử lý logic bảng xếp hạng dựa trên tổng điểm tích lũy.
package com.gamehub.service;

import com.gamehub.dto.LeaderboardResponse;
import com.gamehub.model.User;
import com.gamehub.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class LeaderboardService {

    private static final Logger logger = LoggerFactory.getLogger(LeaderboardService.class);

    @Autowired
    private UserRepository userRepository;

    public List<LeaderboardResponse> getLeaderboard() {
        logger.info("Fetching leaderboard");

        List<User> players = userRepository.findTopPlayersByPoints();
        return IntStream.range(0, Math.min(players.size(), 10)) // Giới hạn top 10
                .mapToObj(index -> new LeaderboardResponse(
                        players.get(index).getId(),
                        players.get(index).getFullName(),
                        players.get(index).getTotalPoints(),
                        index + 1 // Rank bắt đầu từ 1
                ))
                .collect(Collectors.toList());
    }
}
