import os
from pathlib import Path

OUTPUT_FILE = "salida.md"
BASE_DIR = "."  # directorio actual


def encontrar_extensiones(base_dir):
    base_path = Path(base_dir)
    exts = set()

    for root, _, files in os.walk(base_path):
        for f in files:
            ext = Path(f).suffix.lower()
            if ext:  # solo ficheros con extensión
                exts.add(ext)
    return sorted(exts)


def mostrar_menu(extensiones):
    print("Elige los tipos de fichero que deseas incluir (puedes elegir varios separados por espacio):")
    for idx, ext in enumerate(extensiones, start=1):
        print(f"  {idx}: {ext}")

    seleccion = input("Tu selección (ejemplo: 1 2 4): ").strip()
    if not seleccion:
        return []

    indices_str = seleccion.split()
    indices = []
    for s in indices_str:
        if s.isdigit():
            i = int(s)
            if 1 <= i <= len(extensiones):
                indices.append(i)
            else:
                print(f"Ignorando índice fuera de rango: {s}")
        else:
            print(f"Ignorando entrada no numérica: {s}")

    elegidas = [extensiones[i - 1] for i in indices]
    return sorted(set(elegidas))


def listar_ficheros(base_dir, extensiones):
    base_path = Path(base_dir)
    archivos = []

    for root, _, files in os.walk(base_path):
        for f in files:
            ext = Path(f).suffix.lower()
            if ext in extensiones:
                file_path = Path(root) / f
                rel_path = file_path.relative_to(base_path)
                archivos.append((rel_path, file_path))

    # Opcional: ordenar por ruta relativa
    archivos.sort(key=lambda x: str(x[0]))
    return archivos


def generar_markdown(archivos, output_file):
    with open(output_file, "w", encoding="utf-8") as out:
        # Índice
        out.write("------\n")
        out.write("Índice\n")
        out.write("---\n")
        for rel_path, _ in archivos:
            out.write(f"{rel_path}\n")
        out.write("------\n\n")

        # Contenido de cada fichero
        for rel_path, file_path in archivos:
            out.write("----\n")
            out.write(f"{rel_path}\n")
            out.write("--\n")
            with open(file_path, "r", encoding="utf-8", errors="ignore") as infile:
                out.write(infile.read())
            out.write("\n\n")  # separación entre ficheros


def main():
    base_dir = BASE_DIR

    print(f"Escaneando directorio base: {base_dir}")
    extensiones = encontrar_extensiones(base_dir)

    if not extensiones:
        print("No se han encontrado ficheros con extensión en el directorio.")
        return

    elegidas = mostrar_menu(extensiones)

    if not elegidas:
        print("No se ha elegido ninguna extensión. Saliendo.")
        return

    print(f"Extensiones seleccionadas: {', '.join(elegidas)}")

    archivos = listar_ficheros(base_dir, elegidas)

    if not archivos:
        print("No se han encontrado ficheros con las extensiones seleccionadas.")
        return

    generar_markdown(archivos, OUTPUT_FILE)
    print(f"Archivo Markdown generado: {OUTPUT_FILE}")
    print(f"Total ficheros incluidos: {len(archivos)}")


if __name__ == "__main__":
    main()
