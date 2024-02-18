from flasgger import swag_from
from flask import request, jsonify
from flask_restful import Resource
from datetime import datetime
from ..utils.models import ProjectInformation, verify_token, ProjectFeedBack, User, PersonalInfo, ProjectInvitation
from ..utils.extension import db, scheduler


class projectView(Resource):
    def get(self):
        """
          API for user to get posted project information
          ---
          responses:
            200:
              description: all project information sent
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
                        id:
                          type: integer
                          example: 0
                        project_name:
                          type: string
                          example:
                        owner:
                          type: string
                          example: #unknown
                        academic_researcher:
                          type: string
                          example: admin
                        brief_problem_statement:
                          type: string
                          example: this is a problem
                        desired_outcomes:
                          type: string
                          example: this is a outcome
                        required_skills:
                          type: string
                          example: these are skills
                        potential_deliverables:
                          type: string
                          example: this is protential deliverables

                  msg:
                    type: string
                    example: all project information sent
        """
        projects = ProjectInformation.query.all()
        return jsonify([project.to_dict() for project in projects])

    def post(self):
        """
          API for user to upload their user project experience
          ---
          parameters:
            - in: body
              name: Input
              type: object
              required: true
              schema:
                properties:
                  project_name:
                    type: string
                    example: project_name
                  owner:
                    type: string
                    example: owner
                  academic_researcher:
                    type: string
                    example: academic_researcher
                  brief_problem_statement:
                    type: string
                    example: brief_problem_statement
                  desired_outcomes:
                    type: string
                    example: desired_outcomes
                  required_skills:
                    type: string
                    example: required_skills
                  potential_deliverables:
                    type: string
                    example: potential_deliverables
          responses:
            200:
              description: User project experience submit
              schema:
                properties:
                  code:
                    type: integer
                    example: 200
                  msg:
                    type: string
                    example: User project experience submit
        """
        data = request.get_json()
        if verify_token(request.authorization.token) is not None:
            if not data:
                return {'message': 'No input data provided'}, 400

            # Extracting data from the request
            project_name = data.get('project_name')
            owner = data.get('owner_username')
            academic_researcher = data.get('academic_researcher')
            brief_problem_statement = data.get('brief_problem_statement')
            desired_outcomes = data.get('desired_outcomes')
            required_skills = data.get('required_skills')
            potential_deliverables = data.get('potential_deliverables')
            project_start_date = data.get('project_start_date')
            project_end_date = data.get('project_end_date')
            num_of_candidate = data.get('num_of_candidate')
            apply_start_date = data.get('apply_start_date')
            apply_end_date = data.get('apply_end_date')
            now = datetime.now().date()
            project_status = data.get('project_status')

            if apply_start_date:
                apply_start_date_object = datetime.strptime(apply_start_date, '%d-%m-%Y').date()
            else:
                apply_start_date_object = None
            if apply_end_date:
                apply_end_date_object = datetime.strptime(apply_end_date, '%d-%m-%Y').date()
            else:
                apply_end_date_object = None
            if project_start_date:
                project_start_date_object = datetime.strptime(project_start_date, '%d-%m-%Y').date()
            else:
                project_start_date_object = None
            if project_end_date:
                project_end_date_object = datetime.strptime(project_end_date, '%d-%m-%Y').date()
            else:
                project_end_date_object = None

            if now < project_start_date_object:
                project_status = 1
            if now >= project_start_date_object and now <= project_end_date_object:
                project_status = 2
            if now > project_end_date_object:
                project_status = 3

            if project_end_date_object < project_start_date_object or apply_start_date_object > apply_end_date_object:
                return jsonify({
                    "code": 401,
                    "msg": "start date must prior to end date"
                })

            # Creating a new ProjectInformation object
            project = ProjectInformation(
                project_name=project_name,
                owner_username=owner,
                academic_researcher=academic_researcher,
                brief_problem_statement=brief_problem_statement,
                desired_outcomes=desired_outcomes,
                required_skills=required_skills,
                potential_deliverables=potential_deliverables,
                project_start_date=project_start_date_object,
                project_end_date=project_end_date_object,
                apply_start_date=apply_start_date_object,
                apply_end_date=apply_end_date_object,
                num_of_candidate=num_of_candidate,
                project_status=project_status

            )

            # Adding the new project to the session and committing it to the database
            db.session.add(project)
            db.session.commit()
            return jsonify({
                "code": 200,
                "msg": "ProjectInfo submit"
            })
            # Returning the project data as a JSON response
            # return project.to_dict(), 201
        else:
            return jsonify({
                "code": 401,
                "msg": "Please Login first"
            })


class ProjectFeedBackView(Resource):
    @swag_from({
        'parameters': [
            {
                'name': 'project_id',
                'in': 'query',
                'type': 'string',
                'description': 'project_id',
                'required': True,
            }
        ],
        'responses': {
            200: {
                'description': 'Project milestones feedback sent',
                'schema': {
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 200
                        },
                        'data': {
                            'type': 'array',
                            'items': [
                                'milestone'
                            ]
                        },
                        'msg': {
                            'type': 'string',
                            'example': 'Project milestones feedback sent'
                        },
                    }
                }
            }
        },
    })
    def get(self):
        curr_userID = verify_token(request.authorization.token)
        curr_projID = request.args.get('project_id')
        if curr_userID is not None:
            if curr_projID is not None:
                curr_milestones_feedbacks = ProjectFeedBack.query.filter_by(project_id=curr_projID).all()
                if curr_milestones_feedbacks:
                    return jsonify({
                        'code': 200,
                        'data': [curr_milestones_feedback.to_dict() for curr_milestones_feedback in
                                 curr_milestones_feedbacks],
                        'msg': 'Project milestones feedback sent'
                    })
                else:
                    return jsonify({
                        'code': 404,
                        'msg': 'Unable to find milestones feedback of this project'
                    })
        else:
            return jsonify({
                'code': 400,
                'msg': 'Login first'
            })

    @swag_from({
        'parameters': [
            {
                'in': 'body',
                'name': 'Input',
                'type': 'object',
                'required': True,
                'schema': {
                    'properties': {
                        'project_id': {
                            'type': 'integer',
                            'example': 0
                        },
                        'milestones': {
                            'type': 'array',
                            'items': {
                                'milestone': 'milestone',
                            }
                        }
                    }
                }
            },
        ],
        'responses': {
            200: {
                'description': 'Milestons submit!',
                'schema': {
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 200
                        },
                        'msg': {
                            'type': 'string',
                            'example': 'Milestons submit!'
                        },
                    }
                }
            }
        },
    })
    def post(self):
        curr_userID = verify_token(request.authorization.token)
        curr_user = User().query.filter_by(id=curr_userID).first()
        if curr_userID is not None or curr_user is not None:
            feedback = request.get_json().get("feedback")
            milestone_feedback = ProjectFeedBack().query.filter_by(id=feedback.get('id')).first()
            milestone_feedback.content = feedback.get('content')
            milestone_feedback.rate = feedback.get('rate')
            db.session.commit()
            # Update average rate
            curr_feedbacks = ProjectFeedBack.query.filter_by(user_id=milestone_feedback.user_id, milestone_name=None).all()
            rate_sum = 0
            rate_num = 0
            for temp_feedback in curr_feedbacks:
                if temp_feedback.rate is not None or temp_feedback.rate != 0:
                    rate_num += 1
                    rate_sum += temp_feedback.rate
            average_rate = round(rate_sum/rate_num, 1)
            targe_user_info = PersonalInfo().query.filter_by(user_id=milestone_feedback.user_id).first()
            if targe_user_info:
                targe_user_info.average_rate = average_rate
                targe_user_info.rate_num = rate_num
                db.session.commit()
            else:
                target_user_info = PersonalInfo()
                target_user_info.user_id = milestone_feedback.user_id
                target_user_info.average_rate = average_rate
                target_user_info.rate_num = rate_num
                db.session.add(target_user_info)
                db.session.commit()

            return jsonify({
                'code': 201,
                'msg': 'Feedback sent'
            })
        else:
            return jsonify({
                'code': 400,
                'msg': 'Login first'
            })


class ProjectInvitationView(Resource):
    @swag_from({
        'responses': {
            200: {
                'description': 'Get invitation',
                'schema': {
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 200
                        },
                        'data': {
                            'type': 'object',
                            'properties': {
                                "invited_infos":{
                                    "type": "array",
                                    "items":{
                                        "type": 'object',
                                        "properties": {
                                            'id': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'project_id': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'invited_user_id': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'invited_name': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'invited_email': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'inviter_user_id': {
                                                'type': 'string',
                                                "example": "1"
                                            },
                                            'inviter_name': {
                                                'type': 'string',
                                                "example": "1"
                                            },
                                            'inviter_email': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'status': {
                                                'type': 'integer',
                                                "example": "null"
                                            },
                                        }
                                    }
                                },
                                "inviter_infos": {
                                    "type": "array",
                                    "items":{
                                        "type": 'object',
                                        "properties": {
                                            'id': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'project_id': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'invited_user_id': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'invited_name': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'invited_email': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'inviter_user_id': {
                                                'type': 'string',
                                                "example": "1"
                                            },
                                            'inviter_name': {
                                                'type': 'string',
                                                "example": "1"
                                            },
                                            'inviter_email': {
                                                'type': 'integer',
                                                "example": "1"
                                            },
                                            'status': {
                                                'type': 'integer',
                                                "example": "null"
                                            },
                                        }
                                    }
                                }
                            }
                        },
                        'msg': {
                            'type': 'string',
                            'example': 'Invitation info sent!'
                        },
                    }
                }
            }
        },
    })
    def get(self):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID:
            # curr_user = User().query.filter_by(id=curr_userID).first()
            invited_infos = ProjectInvitation().query.filter_by(invited_user_id=curr_userID).all()
            inviter_infos = ProjectInvitation().query.filter_by(inviter_user_id=curr_userID).all()
            return jsonify({
                "code": 200,
                "data": {
                    "invited_infos": [invited.to_dict() for invited in invited_infos],
                    "inviter_infos": [inviter.to_dict() for inviter in inviter_infos]
                },
                "msg": "Invitation info sent!"
            })
        else:
            return jsonify({
                "code": 200,
                "msg": "Login first!"
            })

    @swag_from({
        'parameters': [
            {
                'in': 'body',
                'name': 'Input',
                'type': 'object',
                'required': True,
                'schema': {
                    'properties': {
                        'project_id': {
                            'type': 'integer',
                            'example': 0
                        },
                        'invited_userID': {
                            'type': 'integer',
                            'example': 0
                        }
                    }
                }
            },
        ],
        'responses': {
            200: {
                'description': 'Send invitation.',
                'schema': {
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 200
                        },
                        'msg': {
                            'type': 'string',
                            'example': 'Invitation info sent!'
                        },
                    }
                }
            }
        },
    })
    def post(self):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID:
            curr_user = User().query.filter_by(id=curr_userID).first()
            project_id = request.get_json().get("project_id")
            invited_userID = request.get_json().get("invited_userID")
            invited_user = User().query.filter_by(id=invited_userID).first()
            invitation = ProjectInvitation().query.filter_by(project_id=project_id, invited_user_id=invited_user.id, inviter_user_id=curr_userID).first()
            if not invitation:
                invitation = ProjectInvitation()
                invitation.project_id = project_id
                invitation.invited_user_id = invited_user.id
                invitation.invited_name = invited_user.username
                invitation.invited_email = invited_user.email
                invitation.inviter_user_id = curr_userID
                invitation.inviter_name = curr_user.username
                invitation.inviter_email = curr_user.email
                db.session.add(invitation)
                db.session.commit()
                scheduler.add_job(id='InvitationExpire-'+ str(project_id) + str(invited_user.id) + str(curr_userID), func=InvitationExpire, args=(project_id, invited_user.id, curr_userID, ), trigger='interval',
                                  seconds=3600, replace_existing=True)
                return jsonify({
                    "code": 200,
                    "msg": "Invitation info sent!"
                })
            else:
                return jsonify({
                    "code": 200,
                    "msg": "Invitation info already exist!"
                })
        else:
            return jsonify({
                "code": 200,
                "msg": "Login first!"
            })

def InvitationExpire(project_id, invited_userID, curr_userID):
    invitation = ProjectInvitation().query.filter_by(project_id=project_id, invited_user_id=invited_userID,
                                                     inviter_user_id=curr_userID).first()

    db.session.delete(invitation)
    db.session.commit()