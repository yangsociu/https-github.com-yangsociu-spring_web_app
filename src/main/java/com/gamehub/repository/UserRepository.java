// Note: Repository để truy vấn bảng users trong MySQL.
package com.gamehub.repository;

import com.gamehub.model.User;
import com.gamehub.model.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByStatus(UserStatus status); // Thêm phương thức này

    // Note: Truy vấn top người chơi theo total_points
    @Query("SELECT u FROM User u WHERE u.role = 'PLAYER' ORDER BY u.totalPoints DESC")
    List<User> findTopPlayersByPoints();
}
