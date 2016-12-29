


# used for time stamps 
import time


import os
import sys
import csv

import string
import psycopg2
import urllib
import urllib.parse

# this is for when we load to heroku
# comment this out when testing locally
urllib.parse.uses_netloc.append("postgres")
os.environ["DATABASE_URL"] = "postgres://spkgochzoicojm:y0MABz523D1H-zMqeZVvplCuC2@ec2-54-163-252-55.compute-1.amazonaws.com:5432/d15b0teu2kkhek"


url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

user_db =  psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)




udb = user_db.cursor()


def output_info(table_name):
	query = "SELECT * FROM " + table_name
	outputquery = "COPY ({0}) TO STDOUT WITH CSV HEADER".format(query)

	file_url = 'database/' + table_name + '.csv'
	with open(file_url, 'w') as f:
	    udb.copy_expert(outputquery, f)






udb.execute("ALTER TABLE BALT ALTER COLUMN timeStamp SET DATA TYPE FLOAT")

ADMIN_TABLE = "admin_table"
REPORT_TABLE = "report_table"
COMMENT_ID_TABLE = "c_id"
FEED_NAMES = "feed_names"
EVENT_TABLE = "BALT"
COMMENT_TABLE = "c_" + EVENT_TABLE
NOTIFICATION_TABLE = "notification_table"
NOTIFICAITON_ID_TABLE = "n_id"

# table_list = ["user_info", "user_actions","BALT", "c_BALT", "report_table", "admin_table", "feed_names", "c_id"]
table_list = [ADMIN_TABLE, REPORT_TABLE, COMMENT_ID_TABLE, FEED_NAMES, EVENT_TABLE, COMMENT_TABLE, NOTIFICATION_TABLE, NOTIFICAITON_ID_TABLE]
for table_name in table_list:
	output_info(table_name)



udb.close()
user_db.close()

print("Complete!")