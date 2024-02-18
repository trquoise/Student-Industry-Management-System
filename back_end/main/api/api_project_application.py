from flask import session, request, jsonify, current_app
from flask_restful import Resource
from sqlalchemy import func
from ..utils.models import Tags, verify_token, User, UserTags, ProjectInformation, ProjectApplication, ProjectFeedBack, \
    ProjectInvitation
from ..utils.forms import TagsForm, IndustryProjectApplicationForm
from ..utils.extension import db
from datetime import datetime

class ProjectApplicationView(Resource):
    def get(self):
        """
          API for user to get all applications
          ---
          responses:
            200:
              description: All projects application sent
              schema:
                properties:
                  code:
                    type: integer
                    example: 200
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        project_id:
                          type: integer
                          example: 0
                        project_name:
                          type: string
                          example: project_name
                        applicant_emails:
                          type: integer
                          example: no-reply@unsw.edu.au
                        status:
                          type: integer
                          example: 0
                  msg:
                    type: string
                    example: All projects application sent
        """
        curr_userID = verify_token(request.authorization.token)
        # curr_userID = 3
        if curr_userID is not None:
            curr_user = User.query.filter_by(id=curr_userID).first()
            curr_user_role = curr_user.role
            if curr_user_role == 1 or curr_user_role == 2:
                # Current user is Student. -> Obtain current student sent application
                # Current user is Academic Researcher. -> Obtain current Academic Researcher sent application
                # Obtain all the projects applied by current user
                curr_user_applications = ProjectApplication.query.filter_by(user_id=curr_userID).all()
                # Because of personal information GET method requirement, return applicant's email is needed.
                output_applications = []
                for application in curr_user_applications:
                    curr_project = ProjectInformation.query.filter_by(id=application.project_id).first()
                    # --------------------------calculate tag_score----------------------------------------------#
                    all_tags = Tags.query.all()
                    curr_user_tag_id_list = []
                    curr_user_tag_name_list = []
                    curr_project_tag_name_list = curr_project.required_skills.split(",")
                    curr_user_tags = UserTags.query.filter_by(user_id=curr_userID)
                    for user_tag in curr_user_tags:
                        curr_user_tag_id_list.append(user_tag.tag_id)
                    for tag in all_tags:
                        for curr_user_tag_id in curr_user_tag_id_list:
                            if curr_user_tag_id == tag.id:
                                curr_user_tag_name_list.append(tag.tag_name)
                    cleaned_curr_user_tag_list = [''.join(tag.split()).lower() for tag in curr_user_tag_name_list]  # ignore space&case
                    set1 = set(cleaned_curr_user_tag_list)
                    cleaned_curr_project_tag_name_list = [''.join(tag.split()).lower() for tag in curr_project_tag_name_list]
                    set2 = set(cleaned_curr_project_tag_name_list)
                    num_of_common_tags = len(set1.intersection(set2))
                    application.tag_score = num_of_common_tags
                    db.session.commit()
                    # ------------------------------------------------------------------------#
                    output_applications.append({
                        'project_id': application.project_id,
                        'project_name': curr_project.project_name,
                        'applicant_id': curr_user.id,
                        'applicant_emails': curr_user.email,
                        'status': application.status,
                        'apply_time': application.apply_time,
                        'tag_score': application.tag_score
                    })
                return jsonify({
                    "code": 200,
                    "data": output_applications,
                    "msg": "Current user applied projects' applications sent"
                })
            elif curr_user_role == 3:  # Current user is Industry Partner. -> Obtain current Industry Partner received application
                # Obtain all the projects owned by current user
                curr_user_owned_projects = ProjectInformation.query.filter_by(owner_username=curr_user.username).all()
                curr_user_owned_project_ids = [project.id for project in curr_user_owned_projects]
                output_applications = []
                # Because of personal information GET method requirement, return applicant's email is needed.
                for pID in curr_user_owned_project_ids:
                    project_applications = ProjectApplication.query.filter_by(project_id=pID).all()
                    curr_project = ProjectInformation.query.filter_by(id=pID).first()
                    for curr_application in project_applications:
                        curr_applicant = User.query.filter_by(id=curr_application.user_id).first()
                        #--------------------------calculate tag_score----------------------------------------------#
                        all_tags = Tags.query.all()
                        curr_user_tag_id_list = []
                        curr_user_tag_name_list = []
                        curr_project_tag_name_list = curr_project.required_skills.split(",")
                        curr_user_tags = UserTags.query.filter_by(user_id=curr_application.user_id)
                        for user_tag in curr_user_tags:
                            curr_user_tag_id_list.append(user_tag.tag_id)
                        for tag in all_tags:
                            for curr_user_tag_id in curr_user_tag_id_list:
                                if curr_user_tag_id == tag.id:
                                    curr_user_tag_name_list.append(tag.tag_name)
                        cleaned_curr_user_tag_list = [''.join(tag.split()).lower() for tag in curr_user_tag_name_list]  # ignore space&case
                        set1 = set(cleaned_curr_user_tag_list)
                        cleaned_curr_project_tag_name_list = [''.join(tag.split()).lower() for tag in curr_project_tag_name_list]
                        set2 = set(cleaned_curr_project_tag_name_list)
                        num_of_common_tags = len(set1.intersection(set2))
                        curr_application.tag_score = num_of_common_tags
                        db.session.commit()
                        #------------------------------------------------------------------------#
                        output_applications.append({
                            'project_id': pID,
                            'project_name': curr_project.project_name,
                            'applicant_id': curr_application.user_id,
                            'applicant_emails': curr_applicant.email,
                            'status': curr_application.status,
                            'apply_time': curr_application.apply_time,
                            'tag_score': curr_application.tag_score
                        })
                return jsonify({
                    "code": 200,
                    "data": output_applications,
                    "msg": "Current user owned projects' applications sent"
                })
            else:
                return jsonify({
                    "code": 400,
                    "msg": "Admin cannot do apply"
                })

        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })

    def post(self):
        """
          API for user to apply project
          ---
          parameters:
            - in: body
              name: Input
              type: object
              required: true
              schema:
                properties:

                  project_id:
                    type: integer
                    example: 0

          responses:
            201:
              description: Application submit
              schema:
                properties:
                  code:
                    type: integer
                    example: 201
                  msg:
                    type: string
                    example: Application submit
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            curr_user_applying_project_id = request.get_json().get('project_id')
            status = request.get_json().get('status')
            applicant_user_id = request.get_json().get('applicant_user_id')
            tag_score = request.get_json().get('tag_score')
            apply_time = datetime.now()
            application_form = IndustryProjectApplicationForm()
            application_form.participant_id = curr_userID
            application_form.project_id = curr_user_applying_project_id
            application_form.status = status
            application_form.tag_score = tag_score
            application_form.apply_time = apply_time
            if applicant_user_id:  # Assess apply, if we get applicant_user_id
                applicant = User.query.filter_by(id=applicant_user_id).first()
                curr_invitation = ProjectInvitation().query.filter_by(project_id=curr_user_applying_project_id, invited_user_id=applicant_user_id).first()
                curr_application = ProjectApplication.query.filter_by(project_id=curr_user_applying_project_id,
                                                                      user_id=applicant_user_id).first()
                if not curr_application:
                    return jsonify({
                        'code': 401,
                        'msg': 'Application not exists!'
                    })
                if status == 1:
                    rator = User.query.filter_by(id=curr_userID).first()
                    applying_project = ProjectInformation.query.filter_by(id=curr_user_applying_project_id).first()
                    student_still_need = applying_project.num_of_candidate - applying_project.curr_candidate
                    # Get all applications for current project
                    applications = ProjectApplication.query.filter_by(project_id=curr_user_applying_project_id).all()
                    # Go through all applications if this user is input applicant, make it academic researcher of current project
                    for apl in applications:
                        temp_user = User.query.filter_by(id=apl.user_id).first()
                        # Get current user applicant, if current user is academic then update
                        if temp_user.id == applicant_user_id:
                            curr_application = apl
                            if applicant.role == 2:
                                applying_project.academic_researcher = temp_user.username
                                db.session.commit()
                            if applicant.role == 1 and student_still_need > 0:
                                applying_project.curr_candidate += 1
                                db.session.commit()
                        # Check if temp user role 2
                        elif (temp_user.role == 2 and applicant.role == 2) or (
                                applicant.role == 1 and temp_user.role == 1 and student_still_need == 1 and apl.status == None):
                            # reject all others
                            apl.status = 0
                            db.session.commit()
                            temp_invitation = ProjectInvitation.query.filter_by(project_id=curr_user_applying_project_id, invited_user_id=temp_user.id).first()
                            if temp_invitation:
                                temp_invitation.status = 0
                                db.session.commit()

                    # Check if we have enough student for this project

                    if applying_project.num_of_candidate:
                        if applicant.role == 1 and student_still_need == 0:
                            return jsonify({
                                "code": 401,
                                "msg": "Student num enough!"
                            })
                    # Add feedback
                    to_add_feedback = ProjectFeedBack()
                    to_add_feedback.project_id = application_form.project_id
                    to_add_feedback.user_id = applicant_user_id
                    to_add_feedback.user_name = applicant.username
                    to_add_feedback.rater_id = curr_userID
                    to_add_feedback.rater_name = rator.username
                    to_add_feedback.rater_role = rator.role
                    db.session.add(to_add_feedback)
                    db.session.commit()
                    curr_application.status = 1
                    if curr_invitation:
                        curr_invitation.status = 1
                    db.session.commit()

                elif status == 0:
                    temp_application = ProjectApplication.query.filter_by(project_id=curr_user_applying_project_id,
                                                                          user_id=applicant_user_id).first()
                    temp_application.status = 0
                    db.session.commit()
                    if curr_invitation:
                        curr_invitation.status = 0
                        db.session.commit()
            else:
                curr_application = ProjectApplication.query.filter_by(project_id=curr_user_applying_project_id,
                                                                      user_id=curr_userID).first()
                if not curr_application:
                    new_application = ProjectApplication()
                    new_application.user_id = curr_userID
                    new_application.project_id = application_form.project_id
                    new_application.tag_score = application_form.tag_score
                    new_application.apply_time = application_form.apply_time
                    db.session.add(new_application)
                db.session.commit()
            return jsonify({
                "code": 201,
                "msg": "Application submit"
            })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })


class CurrentProjectView(Resource):
    def get(self):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            curr_user = User.query.filter_by(id=curr_userID).first()
            curr_user_role = curr_user.role
            if curr_user_role == 1:  # student
                curr_user_applications = ProjectApplication.query.filter_by(user_id=curr_userID).all()
                output_current_project = []
                for application in curr_user_applications:
                    curr_project = ProjectInformation.query.filter_by(id=application.project_id).first()
                    if application.status == 1:
                        output_current_project.append({
                            'project_id': application.project_id,
                            'project_name': curr_project.project_name,
                            'status': curr_project.project_status
                        })
                if len(output_current_project) > 0:
                    return jsonify({
                        "code": 200,
                        "data": output_current_project,
                        "msg": "Current student involed projects sent"
                    })
                else:
                    return jsonify({
                        "code": 400,
                        "msg": "Current student has no involed projects yet"
                    })
            if curr_user_role == 2:  # acadamic rearchear/supervisor
                curr_researcher_projects = ProjectInformation.query.filter_by(academic_researcher=curr_user.username).all()
                output_current_project = []
                for project in curr_researcher_projects:
                        output_current_project.append({
                                'project_id': project.id,
                                'project_name': project.project_name,
                                'status': project.project_status
                            })
                if len(output_current_project) > 0:
                    return jsonify({
                        "code": 200,
                        "data": output_current_project,
                        "msg": "Current researvher involed projects sent"
                    })
                else:
                    return jsonify({
                        "code": 400,
                        "msg": "Current researvher has no involed projects yet"
                    })
            if curr_user_role == 3:  # induxtry partner, return posted projects
                curr_industrypartner_projects = ProjectInformation.query.filter_by(
                    owner_username=curr_user.username).all()
                output_current_project = []
                for project in curr_industrypartner_projects:
                    output_current_project.append({
                        'project_id': project.id,
                        'project_name': project.project_name,
                        'status': project.project_status
                    })
                if len(output_current_project) > 0:
                    return jsonify({
                        "code": 200,
                        "data": output_current_project,
                        "msg": "Current industry parten posted projects sent"
                    })
                else:
                    return jsonify({
                        "code": 400,
                        "msg": "Current industry parten has not post projects yet"
                    })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })


# as a project member, im able to see projects' info
class CurrentProjectDetailView(Resource):
    def get(self):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            curr_user = User.query.filter_by(id=curr_userID).first()
            curr_user_role = curr_user.role
            if curr_user_role == 1:  # student
                curr_user_applications = ProjectApplication.query.filter_by(user_id=curr_userID).all()
                project_info = []
                for application in curr_user_applications:
                    curr_project = ProjectInformation.query.filter_by(id=application.project_id).first()
                    if application.status == 1:
                        project_info.append({
                            'project_id': application.project_id,
                            'project_name': curr_project.project_name,
                            'owner_username': curr_project.owner_username,
                            'academic_researcher': curr_project.academic_researcher,
                            'brief_problem_statement': curr_project.brief_problem_statement,
                            "desired_outcomes": curr_project.desired_outcomes,
                            "required_skills": curr_project.required_skills,
                            "potential_deliverables": curr_project.potential_deliverables,
                            "project_start_date": curr_project.project_start_date,
                            "project_end_date": curr_project.project_end_date,
                            "apply_start_date": curr_project.apply_start_date,
                            "apply_end_date": curr_project.apply_end_date,
                            "project_status": curr_project.project_status,
                            "num_of_candidate": curr_project.num_of_candidate
                        })
                if len(project_info) > 0:
                    return jsonify({
                        "code": 200,
                        "data": project_info,
                        "msg": "Current student involed projects sent"
                    })
                else:
                    return jsonify({
                        "code": 400,
                        "msg": "Current student has no involed projects yet"
                    })
            if curr_user_role == 2:  # academic researcjer
                curr_researcher_projects = ProjectInformation.query.filter_by(
                    academic_researcher=curr_user.username).all()
                project_info = []
                for project in curr_researcher_projects:
                    project_info.append({
                        'project_id': project.id,
                        'project_name': project.project_name,
                        'owner_username': project.owner_username,
                        'academic_researcher': project.academic_researcher,
                        'brief_problem_statement': project.brief_problem_statement,
                        "desired_outcomes": project.desired_outcomes,
                        "required_skills": project.required_skills,
                        "potential_deliverables": project.potential_deliverables,
                        "project_start_date": project.project_start_date,
                        "project_end_date": project.project_end_date,
                        "apply_start_date": project.apply_start_date,
                        "apply_end_date": project.apply_end_date,
                        "project_status": project.project_status,
                        "num_of_candidate": project.num_of_candidate
                    })
                if len(project_info) > 0:
                    return jsonify({
                        "code": 200,
                        "data": project_info,
                        "msg": "Current researcher involed projects info sent"
                    })
                else:
                    return jsonify({
                        "code": 400,
                        "msg": "Current researcher has no involed projects  yet"
                    })
            if curr_user_role == 3:  # industry partner/ project onwer
                curr_industrypartner_projects = ProjectInformation.query.filter_by(
                    owner_username=curr_user.username).all()
                project_info = []
                for project in curr_industrypartner_projects:
                    project_info.append({
                        'project_id': project.id,
                        'project_name': project.project_name,
                        'owner_username': project.owner_username,
                        'academic_researcher': project.academic_researcher,
                        'brief_problem_statement': project.brief_problem_statement,
                        "desired_outcomes": project.desired_outcomes,
                        "required_skills": project.required_skills,
                        "potential_deliverables": project.potential_deliverables,
                        "project_start_date": project.project_start_date,
                        "project_end_date": project.project_end_date,
                        "apply_start_date": project.apply_start_date,
                        "apply_end_date": project.apply_end_date,
                        "project_status": project.project_status,
                        "num_of_candidate": project.num_of_candidate
                    })
                if len(project_info) > 0:
                    return jsonify({
                        "code": 200,
                        "data": project_info,
                        "msg": "Current industry parbner posted projects info sent"
                    })
                else:
                    return jsonify({
                        "code": 400,
                        "msg": "Current industry partner has no posted projects  yet"
                    })
