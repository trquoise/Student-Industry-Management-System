import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, '../project.db')
    # MAIL_SERVER = 'smtp-relay.sendinblue.com'
    # MAIL_PORT = 587
    # MAIL_USERNAME = 'boxuan.guo.personal@gmail.com'
    # MAIL_PASSWORD = 'U9kCdRQqx28mp6M0'
    # MAIL_USE_TLS = False
    # MAIL_USE_SSL = False
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USERNAME = 'boxuan.guo.personal@gmail.com'
    MAIL_PASSWORD = 'ksvr eqdy trci hiba'
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    pass


class TestingConfig(Config):
    pass


class ProductionConfig(Config):
    pass


config_type = {
    'dev': DevelopmentConfig,
    'test': TestingConfig,
    'prod': ProductionConfig,
    'default': DevelopmentConfig
}
