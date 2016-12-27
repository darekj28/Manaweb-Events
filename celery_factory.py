from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for, Response
from celery import Celery



def create_celery(app):

	celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])

	# celery.conf.update(app.config)
	return celery




