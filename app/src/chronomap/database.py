import mysql.connector
from . import config
from .frame import Frame


FRAME_TABLE = "atlas_frame"
DATA_TABLE = "atlas_data"

def get_db() -> mysql.connector.connection.MySQLConnection:
   """
   Get a MySQL connection to the database.

   Return:
      mysql.connector.connection.MySQLConnection: A MySQL connection object.
   """
   return mysql.connector.connect(
      host=config.MYSQL_HOST,
      port=config.MYSQL_PORT,
      user=config.MYSQL_USER,
      password=config.MYSQL_PASS,
      database=config.MYSQL_DB,
   )


def get_regions() -> list[str]:
   """
   Get all unique regions from the database.

   Return:
      list[str]: A list of unique regions.
   """
   connection = get_db()
   cursor = connection.cursor()
   query = f"SELECT UNIQUE(region) FROM {FRAME_TABLE};"
   cursor.execute(query)
   result = cursor.fetchall()
   regions = [row[0] for row in result]
   cursor.close()
   connection.close()
   return regions


def get_region_frames(region) -> list[Frame]:
   """
   Get all frames from the database that belong to a specific region.

   Args:
      region (str): The name of the region to filter by.
   Return:
      list[Frame]: A list of Frame objects.
   """
   connection = get_db()
   cursor = connection.cursor()
   query = f"SELECT * FROM {FRAME_TABLE} WHERE region = %s ORDER BY date ASC;"
   cursor.execute(query, (region,))
   result = cursor.fetchall()
   frames = [Frame(*row) for row in result]
   cursor.close()
   connection.close()
   return frames


def get_frame_by_id(frame_id: int) -> Frame|None:
   """
   Get a frame from the database by its ID.

   Args:
      frame_id (int): The ID of the frame to retrieve.

   Return:
      Frame|None: A Frame object. If the frame does not exist in the database, returns None.
    """
   connection = get_db()
   cursor = connection.cursor()
   query = f"SELECT data FROM {DATA_TABLE} WHERE id = %s;"
   cursor.execute(query, (frame_id,))
   result = cursor.fetchone()
   cursor.close()
   connection.close()
   return result[0] if result else None
