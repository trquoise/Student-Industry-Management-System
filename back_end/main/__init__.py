import os
from flask import Flask

from .utils.config import config_type
from .api import api_bp
from .utils.extension import db, cors, mail, swagger, scheduler
from .utils.models import User
from flask_cors import *


basedir = os.path.abspath(os.path.dirname(__file__))

def create_app(config_class='default'):
    app = Flask(__name__)
    setup_app(app, config_class)
    setup_blueprints(app)
    setup_extension(app)
    return app

def setup_app(app, config_class):
    app.config.from_object(config_type[config_class])
    config_type[config_class].init_app(app)
    app.url_map.strict_slashes = False

def setup_blueprints(app):
    app.register_blueprint(api_bp, url_prefix='/api')

def setup_extension(app):
    db.init_app(app)
    cors.init_app(app, resources=r'/*')
    cors.init_app(app)
    mail.init_app(app)
    swagger.init_app(app)
    scheduler.init_app(app)
    scheduler.start()


