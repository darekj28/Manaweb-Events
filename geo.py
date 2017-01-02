import zipcode
import re
# from googlemaps import client as GoogleMaps
# from geopy.geocoders import Nominatim
import time


# given the 2 lattitude and longitude coordinates, returns the distance in miles (lattitude and longitude are numbers, not strings)
def getDistance(lat1, lon1, lat2, lon2):
	# radius of the Earth in miles
	R = 3959

	dlon = lon2 - lon1
	dlat = lat2 - lat1
	a = (sin(dlat/2))**2 + cos(lat1) * cos(lat2) * (sin(dlon/2))**2
	c = 2 * atan2(sqrt(a), sqrt(1-a))
	distance = R * c
	return distance	

# given two zip code strings i.e. ('08544')
# returns the distance between the 2 
# reference "http://pythonhosted.org/zipcode/"
def zipDistance(zip1, zip2):
	zipcode1 = zipcode.isequal(zip1)
	zipcode2 = zipcode.isequal(zip2)
	return getDistance(zipcode1.lat, zipcode1.lon, zipcode2.lat, zipcode2.lon)


# zipcode.isinradius given a lattitude and longitude tuple, and a mile radius return a list of zip code objects within that mile radius



# the following method
# takes in zipcode as a string plus mile radius, then uses "zipcode.isinradius" 
# r is a float
def getNearbyZips(zip, r):
	zip_obj = zipcode.isequal(zip)
	lat = zip_obj.lat
	lon = zip_obj.lon
	zipList = zipcode.isinradius((lat,lon), r)
	zipList.append(zip_obj)
	return zipList


# given the zip code as a string
# returns the city and state in 
# Princeton, NJ# format
def toString(zip):
	zip_obj = zipcode.isequal(zip)
	s = zip_obj.city + ", " + zip_obj.state
	return s



# validate zipcode
# returns true if valid
# returns false if invalid
def postalValidate(zip):

	x = re.match('^[0-9]{5}$', zip)
	if x is None:
		return False
	else:
		zip_obj = zipcode.isequal(zip)
		if (zip_obj == None):
			return False
		else:
			return True





# t1 = time.time()

# geolocator = Nominatim()

# app_key = "AIzaSyDkUdoq04Rdr0MIvgCl67vdMV7A5izOi7g"


# address = "3850 Lancaster Ave, Philadelphia, PA 19104"

# t1 = time.time()

# gmaps = GoogleMaps.Client(key = app_key)
# geocode_result = gmaps.geocode(address)
# print("")

# t2 = time.time()

# total = t2-t1
# print(total)