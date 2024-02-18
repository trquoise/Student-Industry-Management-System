from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail
from flasgger import Swagger
from flask_apscheduler import APScheduler

db = SQLAlchemy()
cors = CORS()
mail = Mail()
swagger = Swagger()
scheduler = APScheduler()
