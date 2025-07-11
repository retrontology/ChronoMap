import mysql.connector
from . import config
from .frame import Frame


FRAME_TABLE = "atlas_frame"

print(
   f"""
   connection = mysql.connector.connect(
      host={config.MYSQL_HOST},
      port={config.MYSQL_PORT},
      user={config.MYSQL_USER},
      password={config.MYSQL_PASS},
      database={config.MYSQL_DB},
   )
   """
)

connection = mysql.connector.connect(
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
    cursor = connection.cursor()
    query = f"SELECT UNIQUE(region) FROM {FRAME_TABLE};"
    cursor.execute(query)
    result = cursor.fetchall()
    regions = [row[0] for row in result]
    cursor.close()
    return regions


def get_region_frames(region) -> list[Frame]:
    """
    Get all frames from the database that belong to a specific region.

    Args:
       region (str): The name of the region to filter by.
    Return:
       list[Frame]: A list of Frame objects.
    """
    cursor = connection.cursor()
    query = f"SELECT * FROM {FRAME_TABLE} WHERE region = %s ORDER BY date ASC;"
    cursor.execute(query, (region,))
    result = cursor.fetchall()
    frames = [Frame(*row) for row in result]
    cursor.close()
    return frames
