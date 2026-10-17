class Libro {
    constructor(id, titulo, autor, genero, anio, disponible, prestadoA, createdAt) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
        this.anio = anio === null ? null : Number(anio);
        this.disponible = Boolean(disponible);
        this.prestadoA = prestadoA;
        this.createdAt = createdAt;
    }

    static fromRow(row) {
        if (!row) return null;
        return new Libro(
            row.id,
            row.titulo,
            row.autor,
            row.genero,
            row.anio,
            row.disponible,
            row.prestado_a,
            row.created_at
        );
    }
}

module.exports = Libro;
