import urllib
import pytz
import os

# for when we upload to heroku
# comment out if testing
urllib.parse.uses_netloc.append("postgres")
os.environ["DATABASE_URL"] = "postgres://spkgochzoicojm:y0MABz523D1H-zMqeZVvplCuC2@ec2-54-163-252-55.compute-1.amazonaws.com:5432/d15b0teu2kkhek"
url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

print(url.path[1:])
print(url.username)
print(url.password)
print(url.hostname)
print(url.port)