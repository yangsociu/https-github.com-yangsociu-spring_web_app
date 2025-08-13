// Note: Tạo bảng users trong MySQL để lưu thông tin người dùng.
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,

    //information
    full_name VARCHAR(100),
    portfolio_url VARCHAR(255),
    experience_years INT,
    status VARCHAR(50) NOT NULL

    // Note: Lưu tổng điểm tích lũy của người chơi
    total_points BIGINT NOT NULL DEFAULT 0
);

// Note: Tạo bảng games trong MySQL để lưu thông tin game do Developer upload.
CREATE TABLE IF NOT EXISTS games (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    preview_image_url VARCHAR(255),
    apk_file_url VARCHAR(255),
    support_leaderboard BOOLEAN NOT NULL DEFAULT FALSE,
    support_points BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL,
    developer_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (developer_id) REFERENCES users(id)
);

// Note: Tạo bảng reviews để lưu đánh giá của người chơi về game.
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    game_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

// Note: Tạo bảng point_transactions để lưu lịch sử giao dịch điểm (tải game, viết review).
CREATE TABLE IF NOT EXISTS point_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    game_id BIGINT, // Note: Có thể null nếu hành động không liên quan đến game cụ thể
    action_type VARCHAR(50) NOT NULL, // Note: Loại hành động: DOWNLOAD_GAME, WRITE_REVIEW
    points BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

// Bảng gifts lưu thông tin quà tặng do Developer upload.
CREATE TABLE IF NOT EXISTS gifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    point_cost BIGINT NOT NULL CHECK (point_cost > 0),
    quantity BIGINT NOT NULL CHECK (quantity >= 0), // Thêm trường quantity để giữ số lượng quà
    developer_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (developer_id) REFERENCES users(id)
);

// Bảng gift_transactions để lưu lịch sử đổi quà của người chơi.
CREATE TABLE IF NOT EXISTS gift_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_id BIGINT NOT NULL,
    gift_id BIGINT NOT NULL,
    points_spent BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES users(id),
    FOREIGN KEY (gift_id) REFERENCES gifts(id)
);
