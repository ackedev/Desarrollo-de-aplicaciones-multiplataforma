"""Pruebas reales por consola. Todos los datos se copian a carpetas temporales."""
import json
import os
import selectors
import time
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path
import xml.etree.ElementTree as ET

PROYECTO = Path(__file__).resolve().parents[1]


class CatalogoTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.compilacion = tempfile.TemporaryDirectory(prefix="jackson-clases-")
        cls.clases = cls.compilacion.name
        fuentes = list(PROYECTO.glob("*.java"))
        if fuentes:
            subprocess.run(["javac", "-encoding", "UTF-8", "-Xlint:all", "-cp",
                            str(PROYECTO / "lib/*"), "-d", cls.clases,
                            *map(str, fuentes)], check=True)
        cls.classpath = cls.clases + ":" + str(PROYECTO / "lib/*")

    @classmethod
    def tearDownClass(cls):
        cls.compilacion.cleanup()

    def setUp(self):
        self.temporal = tempfile.TemporaryDirectory(prefix="jackson-datos-")
        self.raiz = Path(self.temporal.name)
        self.datos = self.raiz / "Datos"
        self.datos.mkdir()
        self.xml = self.datos / "peliculas.xml"
        self.json = self.datos / "peliculas.json"
        shutil.copyfile(PROYECTO / "Datos/peliculas.xml", self.xml)

    def tearDown(self):
        self.datos.chmod(0o755)
        self.temporal.cleanup()

    def ejecutar(self, entrada):
        resultado = subprocess.run(["java", "-cp", self.classpath, "Actividad3JsonJackson.Main"],
                                   cwd=self.raiz, input=entrada, text=True,
                                   capture_output=True, timeout=10)
        self.assertEqual(resultado.returncode, 0, resultado.stderr)
        self.assertEqual(resultado.stderr, "")
        return resultado.stdout

    def migrar(self):
        self.ejecutar("1\n0\n")
        return json.loads(self.json.read_text())

    def test_migracion_conserva_todos_los_datos_y_tipos(self):
        catalogo = self.migrar()
        esperado = []
        for p in ET.parse(self.xml).getroot().findall("pelicula"):
            esperado.append(dict(id=int(p.attrib["id"]), titulo=p.findtext("titulo"),
                                 director=p.findtext("director"), año=int(p.findtext("anio")),
                                 genero=p.findtext("genero")))
        self.assertEqual(catalogo, {"peliculas": esperado})
        self.assertGreater(len(self.json.read_text().splitlines()), 10)
        for p in catalogo["peliculas"]:
            self.assertIs(type(p["id"]), int)
            self.assertIs(type(p["año"]), int)

    def test_crud_persistente_y_xml_sin_cambios(self):
        self.migrar()
        xml_original = self.xml.read_bytes()
        self.ejecutar('4\nPrueba "JSON"\nDirección ñ\n2026\nPrueba\n0\n')
        pelicula = json.loads(self.json.read_text())["peliculas"][-1]
        self.assertEqual(pelicula["id"], 48)
        self.assertEqual(pelicula["titulo"], 'Prueba "JSON"')
        self.assertIn('Prueba "JSON"', self.ejecutar("3\n48\n0\n"))
        self.ejecutar("5\n48\nTítulo modificado\nOtro director\n2025\nDrama\n0\n")
        self.assertEqual(json.loads(self.json.read_text())["peliculas"][-1]["año"], 2025)
        self.assertIn("Título modificado", self.ejecutar("2\n0\n"))
        salida = self.ejecutar("6\n48\n0\n")
        self.assertIn("borrado físico", salida)
        self.assertNotIn(48, [p["id"] for p in json.loads(self.json.read_text())["peliculas"]])
        self.assertEqual(self.xml.read_bytes(), xml_original)

    def test_id_maximo_actual_y_catalogo_vacio(self):
        self.xml.write_text('<peliculas ultimoId="100"><pelicula id="7"><titulo>A</titulo>'
                            '<director>B</director><anio>2000</anio><genero>C</genero>'
                            '</pelicula></peliculas>')
        self.migrar()
        self.ejecutar("4\nNueva\nDirector\n2026\nDrama\n0\n")
        self.assertEqual(json.loads(self.json.read_text())["peliculas"][-1]["id"], 8)
        self.ejecutar("6\n8\n4\nOtra\nDirector\n2026\nDrama\n0\n")
        self.assertEqual(json.loads(self.json.read_text())["peliculas"][-1]["id"], 8)
        self.json.write_text('{"peliculas": []}')
        self.ejecutar("4\nPrimera\nDirector\n2026\nDrama\n0\n")
        self.assertEqual(json.loads(self.json.read_text())["peliculas"][0]["id"], 1)

    def test_json_ausente_no_cierra_y_xml_ausente_si(self):
        salida = self.ejecutar("2\n0\n")
        self.assertIn("XML", salida)
        self.assertIn("Saliendo", salida)
        self.assertFalse(self.json.exists())
        self.xml.unlink()
        salida = self.ejecutar("1\n0\n")
        self.assertIn("no existe", salida)
        self.assertNotIn("Selecciona una opción", salida)

    def test_id_inexistente_no_escribe(self):
        self.migrar()
        original = self.json.read_bytes()
        for opcion in (3, 5, 6):
            salida = self.ejecutar(f"{opcion}\n999999\n0\n")
            self.assertIn("No se ha encontrado", salida)
            self.assertEqual(self.json.read_bytes(), original)

    def test_repite_dato_invalido_y_opcion_invalida(self):
        self.migrar()
        salida = self.ejecutar("99\nabc\n4\n\nTítulo\n  \nDirector\nabc\n-1\n2026\n\nDrama\n0\n")
        self.assertIn("Opción no válida", salida)
        self.assertIn("entero válido", salida)
        self.assertIn("no puede estar vacío", salida)
        self.assertEqual(json.loads(self.json.read_text())["peliculas"][-1]["titulo"], "Título")

    def test_json_invalido_no_se_sobrescribe(self):
        self.migrar()
        for invalido in ('{mal', 'null', '{}', '{"peliculas":null}',
                         '{"peliculas":[null]}',
                         '{"peliculas":[{"id":1,"titulo":"A","director":"B","año":2000,"genero":"C"},'
                         '{"id":1,"titulo":"D","director":"E","año":2001,"genero":"F"}]}'):
            with self.subTest(json=invalido):
                self.json.write_text(invalido)
                salida = self.ejecutar("2\n4\n0\n")
                self.assertIn("Error", salida)
                self.assertEqual(self.json.read_text(), invalido)

    def test_no_acepta_enteros_como_texto_decimales_ni_null(self):
        for valor in ('"2000"', '2000.5', 'null'):
            with self.subTest(valor=valor):
                original = ('{"peliculas":[{"id":1,"titulo":"A","director":"B",'
                            '"año":' + valor + ',"genero":"C"}]}')
                self.json.write_text(original)
                self.assertIn("Error", self.ejecutar("2\n0\n"))
                self.assertEqual(self.json.read_text(), original)

    def test_xml_invalido_no_destruye_json(self):
        self.migrar()
        original = self.json.read_bytes()
        for invalido in ('<roto', '<otra/>', '<peliculas><pelicula id="1"/></peliculas>'):
            self.xml.write_text(invalido)
            self.assertIn("Error", self.ejecutar("1\ns\n0\n"))
            self.assertEqual(self.json.read_bytes(), original)

    def test_no_reconvierte_sin_confirmacion(self):
        self.migrar()
        self.ejecutar("4\nSolo JSON\nDirector\n2026\nDrama\n0\n")
        original = self.json.read_bytes()
        self.assertIn("cancelada", self.ejecutar("1\nn\n0\n"))
        self.assertEqual(self.json.read_bytes(), original)

    def test_crud_no_lee_contenido_xml(self):
        self.migrar()
        self.xml.write_text("XML ya no utilizado")
        self.assertIn("Interstellar", self.ejecutar("2\n0\n"))

    def test_id_maximo_no_desborda(self):
        self.json.write_text('{"peliculas":[{"id":2147483647,"titulo":"A",'
                             '"director":"B","año":2000,"genero":"C"}]}')
        original = self.json.read_bytes()
        self.assertIn("identificadores", self.ejecutar("4\n0\n"))
        self.assertEqual(self.json.read_bytes(), original)

    def test_menu_reaparece_sin_pedir_entrada_a_ciegas(self):
        self.migrar()
        proceso = subprocess.Popen(["java", "-cp", self.classpath, "Actividad3JsonJackson.Main"],
                                   cwd=self.raiz, stdin=subprocess.PIPE,
                                   stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        selector = selectors.DefaultSelector()
        selector.register(proceso.stdout, selectors.EVENT_READ)

        def esperar_menu():
            recibido = b""
            limite = time.monotonic() + 3
            while time.monotonic() < limite:
                if selector.select(timeout=0.1):
                    recibido += os.read(proceso.stdout.fileno(), 65536)
                    if "Selecciona una opción:".encode() in recibido:
                        return True
            return False

        try:
            self.assertTrue(esperar_menu(), "No se muestra el menú inicial")
            proceso.stdin.write(b"2\n")
            proceso.stdin.flush()
            self.assertTrue(esperar_menu(), "El menú espera otra entrada antes de mostrarse")
        finally:
            selector.close()
            proceso.communicate(b"0\n", timeout=5)
            proceso.stdout.close()
            proceso.stderr.close()

    def test_entrada_interrumpida_no_guarda(self):
        self.migrar()
        original = self.json.read_bytes()
        self.ejecutar("4\nTítulo\n")
        self.assertEqual(self.json.read_bytes(), original)

    def test_fallo_guardado_conserva_catalogo_y_limpia_temporal(self):
        self.migrar()
        original = self.json.read_bytes()
        self.datos.chmod(0o555)
        try:
            salida = self.ejecutar("4\nNo guardar\nDirector\n2026\nDrama\n2\n0\n")
            self.assertIn("Error", salida)
            self.assertNotIn("Película añadida con ID", salida)
            self.assertEqual(self.json.read_bytes(), original)
            self.assertEqual(sorted(p.name for p in self.datos.iterdir()),
                             ["peliculas.json", "peliculas.xml"])
        finally:
            self.datos.chmod(0o755)


if __name__ == "__main__":
    unittest.main(verbosity=2)
