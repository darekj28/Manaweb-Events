from celery_factory import create_celery
from app_factory import create_app
from users import Users
from posts import Posts


celery = create_celery(create_app())

@celery.task(bind=True)
def asyncGetPosts(self):
	"""Background task that runs a long function with progress reports."""
	print("bro")
	feed_name = "BALT"
	post_manager = Posts()
	post_list = post_manager.getPosts(feed_name)
	post_manager.sortAscending(post_list)
	post_manager.closeConnection()

	# updates the status, but not using right now
	# self.update_state(state='PROGRESS',
	#                   meta={'current': i, 'total': total,
	#                         'status': message})

	return {'post_list' : post_list, 'status': 'Task completed!','result': 42}

@celery.task
def test(a,b):
	answer = a + b
	return {'answer' : answer}