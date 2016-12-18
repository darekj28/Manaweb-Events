import smtplib
from py2neo import authenticate, Graph, Node, Relationship
from users import Users

def sendConfirmationEmail(thisUser):
	#to send from temporary gmail 
	"""
	sender = "manaweb.noreply@gmail.com"
	passW = "powerplay"
	smtpserver = smtplib.SMTP('smtp.gmail.com', 587)
	"""

	
	userID = thisUser['userID']	
	email = thisUser['email']

	confirmationPin = thisUser['confirmationPin']
	
	# to send from manaweb
	sender = 'darek@manaweb.com'
	passW = "sqwcc23mrbnnjwcz"
	smtpserver = smtplib.SMTP('smtp.fastmail.com',587)
	
	receiver = email
	message = "Please confirm your account by clicking the following link "
	# will change to manaweb.com when online
	hostName = "127.0.0.1:5000"

	confirmationURL = hostName + '/' + 'confirmation' + '/' + confirmationPin
	fullMessage = message + "\n" + "\n" + confirmationURL

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


def hashUserID(userID):
	hash_id = abs(hash(userID))
	hex_hash_id = hex(hash_id)
	confirmationPin = ""
	for i in range(2,len(hex_hash_id)):
		confirmationPin = confirmationPin + hex_hash_id[i]
	return confirmationPin[0:4]