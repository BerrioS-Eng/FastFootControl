-- FastFoodControl Database Schema - Simplified
-- Este script crea las tablas básicas necesarias

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
    payment_method VARCHAR(20) DEFAULT 'CASH' CHECK (payment_method IN ('CASH', 'CARD', 'TRANSFER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role) 
VALUES (
    'admin', 
    'admin@fastfoodcontrol.com', 
    '$2b$10$47cSOV/HLklNSnJhLxPzLeO1F94VZgaSgJg/tBw1SEFW4KMOxSCOO', 
    'Administrador del Sistema', 
    'ADMIN'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample user (password: user123)
INSERT INTO users (username, email, password_hash, full_name, role) 
VALUES (
    'usuario1', 
    'usuario1@fastfoodcontrol.com', 
    '$2b$10$StRRCbHiJQFS7xiSLnCmHuYu0rSiePD/FhpGT.EDTToV1eORgm9FS', 
    'Usuario de Prueba', 
    'USER'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, cost, category, is_available, stock_quantity) VALUES
('Hamburguesa Clásica', 'Hamburguesa con carne, lechuga, tomate y salsas', 15000.00, 8000.00, 'Hamburguesas', true, 50),
('Papas Fritas', 'Papas fritas crujientes', 8000.00, 3000.00, 'Acompañamientos', true, 100),
('Gaseosa 350ml', 'Bebida gaseosa de 350ml', 5000.00, 2000.00, 'Bebidas', true, 200),
('Pizza Personal', 'Pizza personal de pepperoni', 18000.00, 9000.00, 'Pizzas', true, 30),
('Alitas BBQ', '6 alitas de pollo con salsa BBQ', 20000.00, 10000.00, 'Alitas', true, 25)
ON CONFLICT DO NOTHING;