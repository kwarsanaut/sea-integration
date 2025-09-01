-- Create database schema for Sea UIL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tier VARCHAR(50) DEFAULT 'bronze',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User insights table
CREATE TABLE user_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(user_id),
    insight_type VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    data_sources TEXT[] NOT NULL,
    recommendation TEXT NOT NULL,
    potential_revenue BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Actions table
CREATE TABLE cross_platform_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(50) REFERENCES users(user_id),
    target_platforms TEXT[] NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    expected_outcome TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending',
    executed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (user_id, name, email, phone, tier) VALUES
('user_001', 'Ahmad Rizki', 'ahmad.rizki@email.com', '+62812345678', 'gold'),
('user_002', 'Siti Nurhaliza', 'siti.nur@email.com', '+62856789012', 'platinum'),
('user_003', 'Budi Santoso', 'budi.santoso@email.com', '+62887654321', 'silver');

-- Create indexes for performance
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_insights_user_id ON user_insights(user_id);
CREATE INDEX idx_insights_created_at ON user_insights(created_at);
CREATE INDEX idx_actions_user_id ON cross_platform_actions(user_id);
CREATE INDEX idx_actions_status ON cross_platform_actions(status);
CREATE INDEX idx_analytics_recorded_at ON analytics_metrics(recorded_at);
