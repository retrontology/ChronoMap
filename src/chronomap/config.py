from os import getenv

MYSQL_HOST = getenv("MYSQL_HOST")
MYSQL_PORT = getenv("MYSQL_PORT", 3306)
MYSQL_USER = getenv("MYSQL_USER")
MYSQL_PASS = getenv("MYSQL_PASS")
MYSQL_DB = getenv("MYSQL_DB")
