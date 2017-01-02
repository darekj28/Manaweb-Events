# used for time stamps 
import time
import datetime
import pytz
from pytz import timezone
import hashlib
import string
import random
import os
import sys
import psycopg2
import urllib
from passlib.hash import argon2
import requests
	

class Security:
	# automatically opens the connection
	def __init__(self):				
		self.USER_TABLE = "user_info"
		self.RECOVERY_TABLE = "recovery_table"
		self.LOGIN_ATTEMPT_TABLE = "login_attempt_table"
		self.FREEGEOPIP_URL = "http://freegeoip.net/json"
		urllib.parse.uses_netloc.append("postgres")
		os.environ["DATABASE_URL"] = "postgres://spkgochzoicojm:y0MABz523D1H-zMqeZVvplCuC2@ec2-54-163-252-55.compute-1.amazonaws.com:5432/d15b0teu2kkhek"
		url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
		self.security_db =  psycopg2.connect(
		    database=url.path[1:],
		    user=url.username,
		    password=url.password,
		    host=url.hostname,
		    port=url.port
		)
		self.security_db.autocommit = True
		self.db = self.security_db.cursor()

	def closeConnection(self):
		self.db.close()
		self.security_db.close()

	def getTimeString(self):
		return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

	def createLoginAttemptsTable(self):
		sql = "CREATE TALBE IF NOT EXISTS " + self.LOGIN_ATTEMPT_TABLE + " (login_id TEXT, isSuccessLogin BOOLEAN, ip TEXT, country_code TEXT, \
		city TEXT, region_code TEXT, zip_code TEXT, timeString TEXT, timeStamp FLOAT)"
		self.db.execute(self.db.mogrify(sql))
		addIndexCode = 'CREATE INDEX IF NOT EXISTS login_id ON ' + table_name + ' (login_id)'
		self.db.execute(addIndexCode)

	def recordLoginAttempt(self, login_id, isSuccess, ip):
		timeStamp = time.time()
		timeString = self.getTimeString()
		location_info = self.get_geolocation_for_ip(ip)
		country_code = location_info['country_code']
		city = location_info['city']
		region_code = location_info['region_code']
		zip_code = location_info['zip_code']
		sql = "INSERT INTO " + self.LOGIN_ATTEMPT_TABLE + " (login_id, isSuccessfulLogin, ip, country_code, city, region_code, \
		zip_code, timeString, timeStamp) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
		self.db.execute(self.db.mogrify(sql, (login_id, isSuccess, ip, country_code, city, region_code,
		zip_code, timeString, timeStamp)))



	# given an ip address returns their json file with the following parameters
	# ip, country_code, country_name, region_code, region_name, city, zipcode, lataitude, longitude, metro_code, area_code
	"""
	SAMPLE_RESPONSE = {
	    "ip":"108.46.131.77",
	    "country_code":"US",
	    "country_name":"United States",
	    "region_code":"NY",
	    "region_name":"New York",
	    "city":"Brooklyn",
	    "zip_code":"11249",
	    "time_zone":"America/New_York",
	    "latitude":40.645,
	    "longitude":-73.945,
	    "metro_code":501
	}
	"""
	def get_geolocation_for_ip(self, ip):
		url = '{}/{}'.format(self.FREEGEOPIP_URL, ip)
		response = requests.get(url)
		response.raise_for_status()
		return response.json()


def test():
	security_manager = Security()
	print(security_manager.get_geolocation_for_ip('69.119.62.67'))
	security_manager.closeConnection()

test()
