CREATE TABLE sms_callbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message_id VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    status_code VARCHAR(10),
    done_date DATETIME,
    operator VARCHAR(100),
    length INT,
    page INT,
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
