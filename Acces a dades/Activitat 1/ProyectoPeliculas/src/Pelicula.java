public class Pelicula {
    private int id;
    private String titulo;
    private String director;
    private int anio;
    private String genero;

    public Pelicula(int id, String titulo, String director, int anio, String genero) {
        this.id = id;
        this.titulo = titulo;
        this.director = director;
        this.anio = anio;
        this.genero = genero;
    }

    public String getTitulo() {
        return titulo;
    }

    public int getId() {
        return id;
    }

    public String getDirector() {
        return director;
    }

    public int getAnio() {
        return anio;
    }

    public String getGenero() {
        return genero;
    }

    @Override
    public String toString() {
        return id + " - " + titulo + " - " + director + " - " + anio + " - " + genero;
    }
}
