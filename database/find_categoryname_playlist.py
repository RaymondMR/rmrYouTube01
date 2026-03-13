import sqlite3

# Ruta de la base de datos
db_path = r"C:\Users\INGENIERO RAMON\Herd\rmryoutube01\database\database.sqlite"

def buscar_playlist():
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        print("Seleccione tipo de búsqueda:")
        print("1 - By title")
        print("2 - By description")
        print("3 - By url")

        opcion = input("Ingrese opción (1, 2 o 3): ").strip()

        if opcion == "1":
            campo = "p.title"
        elif opcion == "2":
            campo = "p.description"
        elif opcion == "3":
            campo = "p.url"
        else:
            print("Opción inválida.")
            return

        termino = input("Ingrese el texto a buscar: ").strip()

        # Consulta dinámica segura (solo cambia el nombre del campo)
        query = f"""
        SELECT 
            p.id AS playlist_id,
            p.title,
            p.url,
            c.id AS category_id,
            c.name AS category_name
        FROM playlists p
        INNER JOIN playlist_category pc 
            ON p.id = pc.playlist_id
        INNER JOIN playlist_categories c 
            ON pc.category_id = c.id
        WHERE {campo} LIKE '%' || ? || '%';
        """

        cursor.execute(query, (termino,))
        resultados = cursor.fetchall()

        if resultados:
            print("\nResultados encontrados:\n")
            for row in resultados:
                print(f"Playlist ID: {row[0]}")
                print(f"Título: {row[1]}")
                print(f"URL: {row[2]}")
                print(f"Categoría: {row[4]}")
                print("-" * 40)
        else:
            print("\nNo se encontraron resultados.")

    except sqlite3.Error as e:
        print("Error en la base de datos:", e)

    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    buscar_playlist()