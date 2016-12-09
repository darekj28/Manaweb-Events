


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

	file_url = table_name + '.csv'
	with open(file_url, 'w') as f:
	    udb.copy_expert(outputquery, f)




user_info_table = "user_info"
output_info(user_info_table)
user_action_table = "user_actions"
output_info(user_action_table)

udb.close()
user_db.close()

print("Complete!")