import jwt
from datetime import datetime
from flask import current_app
from flask_login import UserMixin
from sqlalchemy import PrimaryKeyConstraint, ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash
from .extension import db
import redis

r = redis.Redis(
  host='4.147.168.55',
  port=6379,
  decode_responses=True)

"""
    User token generate
"""
def create_token(user_id):
    token_dict = {
        'iat': int(datetime.now().timestamp()),  # token的生成时间
        'user_id': user_id,  # 自定义参数，用户名
        'exp': int(datetime.now().timestamp()) + 3600  # token的有效截至时间
    }

    token = jwt.encode(
        token_dict,
        current_app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )
    current_app.logger.info(token)
    # curr_token = Token().query.filter_by(user_id=user_id).first()
    # if curr_token:
    #     curr_token.token = token
    # else:
    #     new_token = Token()
    #     new_token.user_id = user_id
    #     new_token.token = token
    #     db.session.add(new_token)
    # db.session.commit()
    r.set(user_id, token, ex=3600)
    return token


'''
    User token verify
'''


def verify_token(token):
    try:
        data = jwt.decode(token, current_app.config.get('SECRET_KEY'), algorithms = 'HS256')['user_id']
        current_app.logger.info(data)
        # token = Token.query.filter_by(token=token)
        # if token:
        if r.get(data) == token:
            return data
        else:
            return None
    except:
        return None


def logout(token):
    # with current_app.app_context():
    #     token = Token.query.filter_by(token=token).first()
    #     db.session.delete(token)
    #     db.session.commit()
    user_id = verify_token(token)
    r.delete(user_id)


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    email = db.Column(db.String(128))
    role = db.Column(db.Integer)

    # Admin-0, Students-1, Academic Supervisors-2, Industry Partners-3

    @property
    def password(self):
        raise AttributeError('password is not readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password_hash': self.password_hash,
            'email': self.email,
            'role': self.role
        }


# class Token(db.Model):
#     __tablename__ = 'token'
#     user_id = db.Column(db.String(128), ForeignKey('users.id'), primary_key=True)
#     token = db.Column(db.String(128))


class EmailVerification(db.Model):
    __tablename__ = 'email_verification'
    email = db.Column(db.String(128), ForeignKey('users.email'), primary_key=True)
    verification_code = db.Column(db.Integer)

    def to_dict(self):
        return {
            'email': self.email,
            'verification_code': self.verification_code
        }


class ProjectInformation(db.Model):
    __tablename__ = 'project_information'
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(64), index=True, unique=True)
    owner_username = db.Column(db.String(128), ForeignKey('users.username'), index=True)
    academic_researcher = db.Column(db.String(128), ForeignKey('users.username'))
    brief_problem_statement = db.Column(db.String(128))
    desired_outcomes = db.Column(db.String(128))
    required_skills = db.Column(db.String(128))
    potential_deliverables = db.Column(db.String(128))
    project_start_date = db.Column(db.Date, nullable=True)
    project_end_date = db.Column(db.Date, nullable=True)
    num_of_candidate = db.Column(db.Integer, default=0)
    curr_candidate = db.Column(db.Integer, default=0)
    apply_start_date = db.Column(db.Date, nullable=True)
    apply_end_date = db.Column(db.Date, nullable=True)
    project_status = db.Column(db.String(128),default="1")
    #1: not start yet    2: in progress  3: completes

    def to_dict(self):
        dict = {
            'id': self.id,
            'name': self.project_name,
            'owner': self.owner_username,
            'academic_researcher': self.academic_researcher,
            'brief_problem_statement': self.brief_problem_statement,
            'desired_outcomes': self.desired_outcomes,
            'required_skills': self.required_skills,
            'potential_deliverables': self.potential_deliverables,
            # 'project_start_date': self.project_start_date.strftime('%d-%m-%Y'),
            # 'project_end_date': self.project_end_date.strftime('%d-%m-%Y'),
            'num_of_candidate': self.num_of_candidate,
            'curr_candidate': self.curr_candidate,
            'project_status': self.project_status
            # 'apply_start_date': self.apply_start_date.strftime('%d-%m-%Y'),
            # 'apply_end_date': self.apply_end_date.strftime('%d-%m-%Y'),
        }
        if self.apply_start_date:
            dict['apply_start_date'] = self.apply_start_date.strftime('%d-%m-%Y')
        else:
            dict['apply_start_date'] = None
        if self.apply_end_date:
            dict['apply_end_date'] = self.apply_end_date.strftime('%d-%m-%Y')
        else:
            dict['apply_end_date'] = None
        if self.project_start_date:
            dict['project_start_date'] = self.project_start_date.strftime('%d-%m-%Y')
        else:
            dict['project_start_date'] = None
        if self.project_end_date:
            dict['project_end_date'] = self.project_end_date.strftime('%d-%m-%Y')
        else:
            dict['project_end_date'] = None

        return dict


class Tags(db.Model):
    __tablename__ = "tags"
    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(128), index=True)

    def to_dict(self):
        return {
            'id': self.id,
            'tag_name': self.tag_name
        }


class PersonalInfo(db.Model):
    __tablename__ = 'personal_info'
    user_id = db.Column(db.Integer, ForeignKey('users.id'), primary_key=True)
    name = db.Column(db.String(64), index=True)
    phone = db.Column(db.String(128))
    location = db.Column(db.String(128))
    personal_summary = db.Column(db.Text)
    degree = db.Column(db.String(64))
    major = db.Column(db.String(64))
    #company&area is only for industry partner
    company = db.Column(db.String(64))
    area = db.Column(db.String(64))
    average_rate = db.Column(db.String(64),default="0")
    rate_num = db.Column(db.Integer, default=0)
    avatar = db.Column(db.Text)
    def to_dict(self):
        return {
            'name': self.name,
            'phone': self.phone,
            'location': self.location,
            'personal_summary': self.personal_summary,
            'degree': self.degree,
            'major': self.major,
            'company': self.company,
            'area': self.area,
            'average_rate': self.average_rate,
            'rate_num': self.rate_num,
            'avatar': self.avatar
        }


class UserEducation(db.Model):
    __tablename__ = 'user_education'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    degree = db.Column(db.String(120), nullable=False)
    major = db.Column(db.String(120), nullable=False)

    # def str_to_list:

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'degree': self.degree,
            'major': self.major
        }


class UserProjectExperience(db.Model):
    __tablename__ = 'user_project_experience'
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(64))
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    discipline = db.Column(db.String(120), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    # def str_to_list:

    def to_dict(self):
        return {
            'id': self.id,
            'project_name': self.project_name,
            'user_id': self.user_id,
            'discipline': self.discipline,
            'start_date': self.start_date.strftime('%d-%m-%Y'),
            'end_date': self.end_date.strftime('%d-%m-%Y')
        }


class StudentResume(db.Model):
    __tablename__ = 'student_resume'
    user_id = db.Column(db.Integer, ForeignKey('users.id'), primary_key=True)
    resume_file = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'resume_file': self.resume_file,
        }


class Company(db.Model):
    __tablename__ = 'company'
    user_id = db.Column(db.Integer, ForeignKey('users.id'), primary_key=True)
    company_name = db.Column(db.String(64), index=True, unique=True)
    company_area = db.Column(db.String(128))
    company_summary = db.Column(db.Text)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'company_name': self.company_name,
            'company_area': self.company_area,
            'company_summary': self.company_summary
        }


class Certification(db.Model):
    __tablename__ = 'certification'
    user_id = db.Column(db.Integer, ForeignKey('users.id'), primary_key=True)
    certification_file = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'certification_file': self.certification_file
        }


class UserTags(db.Model):
    __tablename__ = 'user_tags'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    tag_id = db.Column(db.Integer, ForeignKey('tags.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'tag_id': self.tag_id
        }


class ProjectApplication(db.Model):
    __tablename__ = 'project_application'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, ForeignKey('project_information.id'), nullable=False)
    status = db.Column(db.Integer, nullable=True)  # None for pending, 0 for False, 1 for True
    apply_time = db.Column(db.DateTime, nullable=True)
    tag_score = db.Column(db.Integer, nullable=True,default=0)


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'status': self.status
        }


class MileStoneContent(db.Model):
    __tablename__ = 'milestone_content'
    project_id = db.Column(db.Integer, ForeignKey('project_information.id'), primary_key=True)
    content = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'project_id': self.project_id,
            'content': self.content
        }


class MileStone(db.Model):
    __tablename__ = 'milestone'
    project_id = db.Column(db.Integer, ForeignKey('project_information.id'))
    milestone_id = db.Column(db.Integer)
    milestone_name = db.Column(db.String, nullable=False)
    __table_args__ = (
        PrimaryKeyConstraint('project_id', 'milestone_id'),
    )

    def to_dict(self):
        return {
            'project_id': self.project_id,
            'milestone_id': self.milestone_id,
            'milestone_name': self.milestone_name
        }


class ProjectFeedBack(db.Model):
    __tablename__ = 'project_feedback'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, ForeignKey('project_information.id'), nullable=False)
    milestone_id = db.Column(db.Integer, ForeignKey('milestone.milestone_id'), nullable=True)
    milestone_name = db.Column(db.String, ForeignKey('milestone.milestone_name'), nullable=True)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    user_name = db.Column(db.String, ForeignKey('users.username'), nullable=False)
    rater_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    rater_name = db.Column(db.String, ForeignKey('users.username'), nullable=False)
    rater_role = db.Column(db.Integer, ForeignKey('users.role'), nullable=False)
    content = db.Column(db.Text, nullable=True)
    rate = db.Column(db.Integer, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'milestone_id': self.milestone_id,
            'milestone_name': self.milestone_name,
            'user_id': self.user_id,
            'user_name': self.user_name,
            'rater_id': self.rater_id,
            'rater_role': self.rater_role,
            'rater_name': self.rater_name,
            'content': self.content,
            'rate': self.rate
        }


class ProjectForum(db.Model):
    __tablename__ = 'project_forum'
    post_id = db.Column(db.Integer, primary_key=True)
    # id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, ForeignKey('project_information.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    creator = db.Column(db.String, ForeignKey('users.username'), nullable=False) # _username
    create_date = db.Column(db.Date, nullable=False)
    num_of_reply = db.Column(db.Integer, nullable=False)
    reply_json = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            # 'id': self.id,
            'post_id': self.post_id,
            'project_id': self.project_id,
            'title': self.title,
            'creator': self.creator,
            'create_date': self.create_date,
            'num_of_reply': self.num_of_reply,
            'reply_json': self.reply_json
        }


class ProjectInvitation(db.Model):
    __tablename__ = 'project_invitation'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, ForeignKey('project_information.id'), nullable=False)
    invited_user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)
    invited_name = db.Column(db.Integer, ForeignKey('users.username'), nullable=False)
    invited_email = db.Column(db.Integer, ForeignKey('users.email'), nullable=False)
    inviter_user_id = db.Column(db.String, ForeignKey('users.id'), nullable=False)
    inviter_name = db.Column(db.String, ForeignKey('users.username'), nullable=False)
    inviter_email = db.Column(db.Integer, ForeignKey('users.email'), nullable=False)
    status = db.Column(db.Integer)


    def to_dict(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "invited_user_id": self.invited_user_id,
            "invited_name": self.invited_name,
            "invited_email": self.invited_email,
            "inviter_user_id": self.inviter_user_id,
            "inviter_name": self.inviter_name,
            "inviter_email": self.inviter_email,
            "status": self.status  # None 未处理 0 被项目拒绝 1 加入项目
        }
