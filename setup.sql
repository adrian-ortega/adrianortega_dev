-- Contact form database for adrianortega.dev
-- Run this on the MySQL container on 234:
--   mysql -u root -p < setup.sql
-- Separate from parkedsite: that DB collects submissions for parked/subdomain-only
-- domains; this one is solely for adrianortega.dev.

CREATE DATABASE IF NOT EXISTS adrianortegadev
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE adrianortegadev;

CREATE TABLE IF NOT EXISTS contact_submissions (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name  VARCHAR(100),
    email      VARCHAR(255) NOT NULL,
    message    TEXT,
    ip         VARCHAR(45),                    -- supports IPv6
    user_agent TEXT,
    referrer   VARCHAR(500),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User for the adrianortega.dev container on 202
-- Only INSERT + SELECT — no admin rights
CREATE USER IF NOT EXISTS 'aodev'@'192.168.0.202' IDENTIFIED BY 'CHANGE_ME';
GRANT SELECT, INSERT ON adrianortegadev.contact_submissions TO 'aodev'@'192.168.0.202';
FLUSH PRIVILEGES;
