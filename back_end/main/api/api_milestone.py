import json

from flasgger import swag_from
from flask import request, jsonify, current_app
from flask_restful import Resource

from ..utils.extension import db
from ..utils.forms import json_to_dict, MileStoneFeedBackForm, MileStoneForm
from ..utils.models import verify_token, MileStone, ProjectFeedBack, User, MileStoneContent, ProjectApplication, \
    ProjectInformation


class MileStoneView(Resource):
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
                'description': 'Project milestones sent',
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
                            'example': 'Project milestones sent'
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
                curr_milestones = MileStoneContent.query.filter_by(project_id=curr_projID).first()
                if curr_milestones:
                    return jsonify({
                        'code': 200,
                        'data': json.loads(curr_milestones.content),
                        'msg': 'Project milestones sent'
                    })
                else:
                    return jsonify({
                        'code': 404,
                        'msg': 'Unable to find milestones of this project'
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
        curr_data = request.get_json().get('data').get('data')
        curr_project_id = request.get_json().get('data').get('project_id')
        curr_milestones = request.get_json().get('data').get('milestones')
        if curr_userID is not None:
            if curr_project_id is not None:
                # Get all applications
                curr_project_applications = ProjectApplication.query.filter_by(project_id=curr_project_id,
                                                                               status=1).all()
                curr_project_feedbacks = ProjectFeedBack.query.filter_by(project_id=curr_project_id).all()
                student_num = ProjectInformation.query.filter_by(id = curr_project_id).first().curr_candidate
                milestone_num = len(curr_milestones)
                feedback_num = len(curr_project_feedbacks)
                ar_id = None
                init_feedback_flag = False
                if student_num > 0 and student_num * milestone_num + student_num + 1 != feedback_num:
                    init_feedback_flag = True
                ar_rating_people_list = []
                for apl in curr_project_applications:
                    target_user = User.query.filter_by(id=apl.user_id).first()
                    if target_user.role == 1:
                        ar_rating_people_list.append([target_user.id, target_user.username])
                    elif target_user.role == 2:
                        ar_username = target_user.username
                        ar_id = target_user.id
                mile_stone_content = MileStoneContent.query.filter_by(project_id=curr_project_id).first()
                if mile_stone_content is None:
                    mile_stone_content = MileStoneContent()
                    mile_stone_content.project_id = curr_project_id
                    mile_stone_content.content = json.dumps(curr_data)
                    db.session.add(mile_stone_content)
                else:
                    mile_stone_content.content = json.dumps(curr_data)
                db.session.commit()

                for ms in curr_milestones:
                    milestone_form = MileStoneForm()
                    milestone_form.id = ms.get('id')
                    milestone_form.name = ms.get('name')
                    milestone = MileStone.query.filter_by(project_id=curr_project_id,
                                                          milestone_id=milestone_form.id).first()
                    if milestone is not None:
                        milestone_feedbacks = ProjectFeedBack.query.filter_by(project_id=curr_project_id,
                                                                              milestone_id=milestone.milestone_id).all()
                        if milestone_feedbacks:
                            for fb in milestone_feedbacks:
                                fb.milestone_name = milestone_form.name
                                db.session.commit()
                            milestone.milestone_name = milestone_form.name
                        milestone.milestone_name = milestone_form.name
                    else:
                        if init_feedback_flag and ar_id:
                            for arpl in ar_rating_people_list:
                                curr_fb = ProjectFeedBack.query.filter_by(project_id=curr_project_id,
                                                                          milestone_id=milestone_form.id,
                                                                          user_id=arpl[0], rater_role=2).first()
                                if not curr_fb:
                                    fb = ProjectFeedBack()
                                    fb.project_id = curr_project_id
                                    fb.milestone_id = milestone_form.id
                                    fb.milestone_name = milestone_form.name
                                    fb.user_id = arpl[0]
                                    fb.rater_id = ar_id
                                    fb.rater_role = 2
                                    fb.rater_name = ar_username
                                    fb.user_name = arpl[1]
                                    fb.content = None
                                    fb.rate = None
                                    db.session.add(fb)
                                    db.session.commit()
                        milestone = MileStone()
                        milestone.project_id = curr_project_id
                        milestone.milestone_id = milestone_form.id
                        milestone.milestone_name = milestone_form.name
                        db.session.add(milestone)
                    db.session.commit()
                return jsonify({
                    'code': 200,
                    'msg': "Milestons submit!"
                })
            else:
                return jsonify({
                    'code': 400,
                    'msg': "Project_id needed!"
                })
        else:
            return jsonify({
                'code': 400,
                'msg': 'Login first'
            })


