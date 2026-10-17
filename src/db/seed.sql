-- Datos de ejemplo: solo se insertan si la tabla está vacía
INSERT INTO libros (titulo, autor, genero, anio, disponible, prestado_a)
SELECT * FROM (VALUES
    ('Cien años de soledad', 'Gabriel García Márquez', 'Novela', 1967, TRUE, NULL),
    ('Raza de bronce', 'Alcides Arguedas', 'Novela', 1919, FALSE, 'Ana Rojas'),
    ('El principito', 'Antoine de Saint-Exupéry', 'Infantil', 1943, TRUE, NULL),
    ('Clean Code', 'Robert C. Martin', 'Programación', 2008, TRUE, NULL),
    ('1984', 'George Orwell', 'Ciencia ficción', 1949, FALSE, 'Luis Pérez'),
    ('Juan de la Rosa', 'Nataniel Aguirre', 'Novela histórica', 1885, TRUE, NULL)
) AS v(titulo, autor, genero, anio, disponible, prestado_a)
WHERE NOT EXISTS (SELECT 1 FROM libros);
