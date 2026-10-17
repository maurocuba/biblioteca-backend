CREATE TABLE IF NOT EXISTS libros (
    id         SERIAL PRIMARY KEY,
    titulo     VARCHAR(150) NOT NULL,
    autor      VARCHAR(100) NOT NULL,
    genero     VARCHAR(50)  NOT NULL DEFAULT 'General',
    anio       INTEGER,
    disponible BOOLEAN      NOT NULL DEFAULT TRUE,
    prestado_a VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);
