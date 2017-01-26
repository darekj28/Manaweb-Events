import smtplib
from py2neo import authenticate, Graph, Node, Relationship
from users import Users
import time

def sendConfirmationEmail(email, confirmationPin = None):
	#to send from temporary gmail 
	"""
	sender = "manaweb.noreply@gmail.com"
	passW = "powerplay"
	smtpserver = smtplib.SMTP('smtp.gmail.com', 587)
	"""
	if confirmationPin == None:
		confirmationPin = generatePin()
	
	# to send from manaweb
	sender = 'darek@manaweb.com'
	passW = "sqwcc23mrbnnjwcz"
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	
	receiver = email
	message = "Please confirm your account by clicking the following link "
	# will change to manaweb.com when online
	# hostName = "www.manaweb.com"
	# confirmationURL = hostName + '/' + 'confirmation' + '/' + confirmationPin
	# fullMessage = message + "\n" + "\n" + confirmationURL
	fullMessage = "Below is your confirmation pin " + "\n"
	fullMessage = fullMessage + " " + confirmationPin
	msg = "From: noreply@manaweb.com <darek@manaweb.com>" + "\n"
	msg = msg + "To: " + email + "\n"
	msg = msg + "Subject: " + "Please Confirm" + "\n"
	msg = msg + "\n" + fullMessage
	smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.ehlo
	smtpserver.login(sender, passW)
	smtpserver.sendmail(sender, receiver, msg)
	smtpserver.close()
	return confirmationPin

def generatePin():
	return hashString(str(time.time()))
def hashString(s):
	hash_id = abs(hash(s))
	# hex_hash_id = hex(hash_id)
	hex_hash_id = str(hash_id)
	confirmationPin = ""
	for i in range(2,len(hex_hash_id)):
		confirmationPin = confirmationPin + hex_hash_id[i]
	return confirmationPin[0:5].upper()