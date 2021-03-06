from twilio.rest import TwilioRestClient 
from users import Users
import time

# put your own credentials here 
ACCOUNT_SID = "AC14aa2c80e770d77439ccde10800e206b" 
AUTH_TOKEN = "17cefd81ceb38d3ac03ad3c732e4883d"
Twilio_Number =  "+16466307655"
client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN) 
# client.messages.create(
# 	to="6122455469", 
# 	from_="+16466796455", 
# 	body="hey hey hey!",  
# ) 
def sendMessage(sender, receiver, body):
	client.messages.create(to = receiver, from_ = sender, body = body)

def sendTextConfirmationPin(user_phone_number, confirmationPin = None):
	message_template = "Sent from Manaweb - \n Your confirmation pin is : " 
	timeStamp = time.time()
	if confirmationPin == None:
		confirmationPin = generatePin()
	message = message_template + confirmationPin
	# we comment this out so Dareks phone doesn't get spammed
	raw_phone_number = formatRawPhoneNumber(user_phone_number)
	try:
		sendMessage(Twilio_Number, raw_phone_number, message)
	except:
		return {'error' : 'invalid phone'}
	return {'pin' : confirmationPin}

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

def formatRawPhoneNumber(phoneNumberWithDashes):
	raw_phone_number = ""
	for char in phoneNumberWithDashes:
		if char.isdigit():
			raw_phone_number = raw_phone_number + char
	return raw_phone_number

def test():
	user_phone_number = "6122455469"
	sendTextConfirmationPin(user_phone_number)

# test()