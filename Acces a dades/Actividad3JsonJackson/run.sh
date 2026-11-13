#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out
javac -encoding UTF-8 -Xlint:all -cp 'lib/*' -d out Main.java Pelicula.java Catalogo.java FicherosCatalogo.java
java -cp 'out:lib/*' Actividad3JsonJackson.Main
