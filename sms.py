from twilio.rest import TwilioRestClient 
import users 

# put your own credentials here 
ACCOUNT_SID = "AC9fd48a9574442d6cbad3b2e8775be710" 
AUTH_TOKEN = "90df7dbbc3aff7c39f66abe2ee5b7397" 
Twilio_Number =  "+16466796455"

client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN) 
 
# client.messages.create(
# 	to="6122455469", 
# 	from_="+16466796455", 
# 	body="hey hey hey!",  
# ) 




def sendMessage(sender, receiver, body):
	client.messages.create(to = receiver, from_ = sender, body = body)

def sendConfirmationPin(userID, user_phone_number):
	message_template = "Your confirmation pin is : " 
	confirmationPin = hashUserID(userID)
	message = message_template + confirmationPin 
	users.updateInfo(userID, "confirmationPin", confirmationPin)
	sendMessage(Twilio_Number, user_phone_number, message)



def hashUserID(userID):
	hash_id = abs(hash(userID))
	hex_hash_id = hex(hash_id)
	confirmationPin = ""
	for i in range(2,len(hex_hash_id)):
		confirmationPin = confirmationPin + hex_hash_id[i]
	return confirmationPin[0:5].upper()

def test():
	sender = "6122455469"
	sendConfirmationPin('darekj', sender)


test()