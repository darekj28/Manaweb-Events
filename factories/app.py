from flask import Flask

def create_app():
	# initialize app
	app = Flask(__name__)

	# NOTE !!!!  this should definitely be randomly generated and look like some crazy impossible to guess hash
	# but for now we'll keep is simple and easy to remember
	app.secret_key = "powerplay"
	app.config['CELERY_BROKER_URL'] = "broker='amqp://localhost'"

	# for now the result backend is going to be this sqlite db
	app.config['CELERY_RESULT_BACKEND'] = 'celery/celery.db'


	return app