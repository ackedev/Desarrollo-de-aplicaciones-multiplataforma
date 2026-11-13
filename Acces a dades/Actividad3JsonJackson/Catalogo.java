package Actividad3JsonJackson;

import java.util.ArrayList;
import java.util.List;

public class Catalogo {
    private List<Pelicula> peliculas;

    public Catalogo() {
    }

    public Catalogo(List<Pelicula> peliculas) {
        this.peliculas = new ArrayList<>(peliculas);
    }

    public List<Pelicula> getPeliculas() {
        return peliculas;
    }

    public void setPeliculas(List<Pelicula> peliculas) {
        this.peliculas = peliculas;
    }
}
