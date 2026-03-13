import sqlite3

# Ruta de la base de datos
db_path = r"C:\Users\INGENIERO RAMON\Herd\rmryoutube01\database\database.sqlite"

def buscar_categoria_por_playlist():
    try:
        # Conectar a la base de datos
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Solicitar término de búsqueda
        termino = input("Ingrese el nombre o parte del nombre de la playlist: ")

        # Consulta con JOIN y parámetro seguro
        query = """
        SELECT p.title, c.name
        FROM playlists p
        INNER JOIN playlist_category pc 
            ON p.id = pc.playlist_id
        INNER JOIN playlist_categories c 
            ON pc.category_id = c.id
        WHERE p.title LIKE '%' || ? || '%';
        """

        cursor.execute(query, (termino,))
        resultados = cursor.fetchall()

        if resultados:
            print("\nResultados encontrados:\n")
            for title, category in resultados:
                print(f"Playlist: {title}")
                print(f"Categoría: {category}")
                print("-" * 40)
        else:
            print("\nNo se encontraron resultados.")

    except sqlite3.Error as e:
        print("Error al conectar o consultar la base de datos:", e)

    finally:
        if conn:
            conn.close()

# Ejecutar función
if __name__ == "__main__":
    buscar_categoria_por_playlist()