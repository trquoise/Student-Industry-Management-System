from wtforms import Form, StringField, PasswordField, FieldList, validators, FileField, TextAreaField, DateField, IntegerField, DateTimeField
from werkzeug.datastructures import MultiDict
from wtforms.validators import Optional


def json_to_dict(data):
    return MultiDict(data)


class LoginForm(Form):
    email = StringField('Email', [validators.Length(min=4, max=80)])
    password = PasswordField('Password', [validators.Length(min=5, max=80)])


class RegisterForm(Form):
    username = StringField('Username', [validators.Length(min=4, max=25)])
    password = PasswordField('Password', [validators.Length(min=6, max=80)])
    email = StringField('Email', [validators.Length(min=5, max=80)])
    verify_code = StringField('verify_code', [validators.Length(6)])
    role = StringField('Role', [validators.Length(min=0, max=80)])


# This one is just an example for getProjectInformation API, for the development,
# These two attributes can be None, we may need to remove validators or modify it.
class GetProjectForm(Form):
    search_input = StringField('Search Input', [validators.Length(min=1, max=25)])
    filter = FieldList(StringField('Filter'), min_entries=1)


# class GetUserPermissionForm(Form):
#     username = StringField('Username', validators=[Optional()])
#     email = StringField('Email', validators=[Optional()])


# class EditUserPermissionForm(Form):
#     user_id = StringField('user_id', [validators.Length(min=0, max=80)])
#     permission_level = StringField('permission_level', [validators.Length(min=0, max=80)])
#
#
# class ApplyUserPermissionForm(Form):
#     user_id = StringField('user_id', [validators.Length(min=0, max=80)])
#     permission_level = StringField('permission_level', [validators.Length(min=0, max=80)])
#     img_identification = FileField('img_identification', [validators.DataRequired()])
#     user_id = StringField('Role', [validators.Length(min=0, max=80)])
#     permission_level = StringField('Role', [validators.Length(min=0, max=80)])


class ProjectForm(Form):
    project_name = StringField('Project Name', [validators.Length(min=1, max=255)])
    owner_username = StringField('Owner_username', [validators.Length(min=1, max=255)])
    academic_researcher = StringField('Academic Researcher', [validators.Length(min=1, max=255)])
    brief_problem_statement = TextAreaField('Brief Problem Statement', [validators.Length(min=10, max=1000)])
    desired_outcomes = TextAreaField('Desired Outcomes', [validators.Length(min=10, max=1000)])
    required_skills = TextAreaField('Required Skills', [validators.Length(min=10, max=1000)])
    potential_deliverables = TextAreaField('Potential Deliverables', [validators.Length(min=10, max=1000)])
    project_start_date = DateField('Project Start Date', [validators.DataRequired()])
    project_end_date = DateField('Project End Date', [validators.DataRequired()])
    num_of_candidate = IntegerField('Number of Candidates', [validators.NumberRange(min=1)])
    apply_start_date = DateField('Apply Start Date', [validators.DataRequired()])
    apply_end_date = DateField('Apply End Date', [validators.DataRequired()])
    project_status = StringField('Project Status', [validators.Length(min=1, max=80)])



class UserEducationForm(Form):
    id = StringField('id', validators=[Optional()])
    degree = StringField('degree', [validators.Length(min=1, max=80)])
    major = StringField('major', [validators.Length(min=1, max=80)])


class UserProjectExperienceForm(Form):
    id = StringField('id', validators=[Optional()])
    project_name = StringField('project_name', [validators.Length(min=1, max=80)])
    discipline = StringField('Discipline', [validators.Length(min=1, max=80)])
    start_date = DateField('start_date', [validators.DataRequired()])
    end_date = DateField('end_date', [validators.DataRequired()])


class PostStudentResumeForm(Form):
    user_id = StringField('user_id', validators=[Optional()])
    resume_file = TextAreaField('resume_file', [validators.DataRequired()])


class CompanyForm(Form):
    user_id = StringField('company_id', validators=[Optional()])
    company_name = StringField('company_name', validators=[Optional()])
    company_area = StringField('company_name', validators=[Optional()])
    company_summary = TextAreaField('company_summary', validators=[Optional()])


class PersonalInfoForm(Form):
    user_id = StringField('id', validators=[Optional()])
    name = StringField('name', [validators.Length(min=1, max=80)])
    phone = StringField('phone', [validators.Length(min=1, max=80)])
    location = StringField('location', [validators.Length(min=1, max=80)])
    personal_summary = StringField('personal_summary', [validators.Length(min=1, max=800)])
    degree = StringField('degree', [validators.Length(min=1, max=80)])
    major = StringField('major', [validators.Length(min=1, max=80)])
    #comapny&area is only filled when user role is industry partner
    company = StringField('company', [validators.Length(min=1, max=80)])
    area = StringField('area', [validators.Length(min=1, max=80)])




class TagsForm(Form):
    tag_name = StringField('tag_name', [validators.Length(min=1, max=80)])


class CertificationForm(Form):
    user_id = StringField('user_id', validators=[Optional()])
    certification_file = TextAreaField('certification_file', [validators.DataRequired()])


class IndustryProjectApplicationForm(Form):
    project_id = StringField('project_id', [validators.Length(min=0, max=80)])
    participant_id = StringField('participant_id', [validators.Length(min=0, max=80)])
    status = StringField('status', validators=[Optional()])
    apply_time = DateTimeField('Apply Date', format='%Y-%m-%dT%H:%M:%SZ')
    tag_score = IntegerField('tag_score', [validators.Length(min=1, max=80)])


class MileStoneFeedBackForm(Form):
    # project_id = StringField('project_id', [validators.Length(min=0, max=80)])
    # milestone_name = StringField('milestone_name', validators=[Optional()])
    # user_id = StringField('user_id', [validators.Length(min=0, max=80)])
    # user_name = StringField('user_name', [validators.Length(min=0, max=80)])
    id = StringField('id', [validators.Length(min=0, max=80)])
    content = TextAreaField('feedback_content', validators=[Optional()])
    rate = StringField('rate', [validators.Length(min=0, max=80)])

class MileStoneForm(Form):
    id = StringField('id', [validators.Length(min=0, max=80)])
    name = StringField('name',[validators.Length(min=0, max=80)])


class ProjectForumForm(Form):
    post_id = StringField('post_id', validators=[Optional()])
    title = StringField('title', [validators.Length(min=0, max=80)])
    creator = StringField('creator', [validators.Length(min=0, max=80)])
    create_date = StringField('create_date', validators=[Optional()])
    num_of_reply = StringField('num_of_reply', [validators.Length(min=0, max=80)])
    reply_json = TextAreaField('reply_json', validators=[Optional()])