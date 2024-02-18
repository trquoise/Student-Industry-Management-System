import json
from datetime import datetime

from flasgger import swag_from
from flask import request, jsonify, current_app
from flask_restful import Resource
from ..utils.extension import db
from ..utils.forms import json_to_dict, MileStoneFeedBackForm, MileStoneForm, ProjectForumForm
from ..utils.models import verify_token, MileStone, ProjectFeedBack, User, MileStoneContent, ProjectApplication, \
    ProjectInformation, ProjectForum


class ProjectForumView(Resource):
    @swag_from({
        'parameters': [
            {
                'project id': 'project_id'
            }
        ],
        'responses': {
            200: {
                'description': 'Project forum sent',
                'schema': {
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 200
                        },
                        'data': {
                            'type': 'array',
                            'items': [
                                'forum_object'
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
                curr_forums = ProjectForum.query.filter_by(project_id=curr_projID).all()
                return jsonify({
                    'code': 200,
                    'data': [forum.to_dict() for forum in curr_forums],
                    'msg': 'Login first'
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
                        'post': {
                            'type': 'object',
                            'properties': {
                                'post_id': {
                                    'type': 'integer',
                                    'example': 0
                                },
                                'title': {
                                    'type': 'integer',
                                    'example': 0
                                },
                                'create_date': {
                                    'type': 'integer',
                                    'example': 0
                                },
                                'number_of_reply': {
                                    'type': 'integer',
                                    'example': 0
                                },
                                'reply_json': {
                                    'type': 'object',
                                    'example': '{fake: content}'
                                }
                            }
                        }
                    }
                }
            },
        ],
        'responses': {
            200: {
                'description': 'projectforum submit!',
                'schema': {
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 200
                        },
                        'msg': {
                            'type': 'string',
                            'example': 'Project forum submit!'
                        },
                    }
                }
            }
        },
    })
    def post(self):
        curr_userID = verify_token(request.authorization.token)
        curr_projectID = request.get_json().get('project_id')
        curr_data = request.get_json().get('post')
        curr_postID = curr_data.get('post_id')
        if curr_userID is not None:
            projectForumForm = ProjectForumForm()
            projectForumForm.title = curr_data.get('title')
            projectForumForm.creator = curr_data.get('creator')
            projectForumForm.create_date = curr_data.get('create_date')
            projectForumForm.num_of_reply = curr_data.get('num_of_reply')
            projectForumForm.reply_json = json.dumps(curr_data.get('reply_json'))
            if curr_postID is None:
                newProjectForum = ProjectForum()
                newProjectForum.project_id = curr_projectID
                newProjectForum.title = projectForumForm.title
                newProjectForum.creator = projectForumForm.creator
                newProjectForum.create_date = datetime.strptime(str(projectForumForm.create_date), "%d-%m-%Y")
                newProjectForum.num_of_reply = projectForumForm.num_of_reply
                newProjectForum.reply_json = projectForumForm.reply_json
                db.session.add(newProjectForum)
                db.session.commit()
                return jsonify({
                    'code': 200,
                    'msg': "Project forum submit!"
                })
            else:
                curr_projectForum = ProjectForum.query.filter_by(post_id=curr_postID).first()
                curr_projectForum.project_id = curr_projectID
                curr_projectForum.title = projectForumForm.title
                curr_projectForum.creator = projectForumForm.creator
                curr_projectForum.create_date = datetime.strptime(str(projectForumForm.create_date), "%d-%m-%Y")
                curr_projectForum.num_of_reply = projectForumForm.num_of_reply
                curr_projectForum.reply_json = projectForumForm.reply_json
                db.session.commit()
                return jsonify({
                    'code': 200,
                    'msg': "Project forum submit!"
                })
        else:
            return jsonify({
                'code': 400,
                'msg': 'Login first'
            })


class ProjectForumPostView(Resource):
    @swag_from({
        'parameters': [
            {
                'name': 'project_id',
                'in': 'path',
                'type': 'string',
                'required': 'true',
            },
            {
                'name': 'post_id',
                'in': 'path',
                'type': 'string',
                'required': 'true',
            },
        ],
        'responses': {
            200: {
                'description': 'Project forum sent',
                'schema': {
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 200
                        },
                        'data': {
                            'type': 'array',
                            'items': [
                                'forum_object'
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
    def get(self, project_id, post_id):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            curr_forum = ProjectForum().query.filter_by(project_id=project_id, post_id=post_id).first()
            if curr_forum:
                return jsonify({
                    'code': 200,
                    'data': json.loads(curr_forum.reply_json),
                    'msg': 'Forum sent'
                })
            else:
                return jsonify({
                    'code': 200,
                    'msg': 'No forum info'
                })
        else:
            return jsonify({
                'code': 400,
                'msg': 'Login first'
            })

    @swag_from({
        'parameters': [
            {
                'name': 'project_id',
                'in': 'path',
                'type': 'string',
                'required': 'true',
            },
            {
                'name': 'post_id',
                'in': 'path',
                'type': 'string',
                'required': 'true',
            },
        ],
        'responses': {
            200: {
                'description': 'Project forum sent',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 200
                        },
                        'data': {
                            'type': 'array',
                            'items': {
                                'type': 'object',
                                'properties': {
                                    'forum_object': {
                                        'type': 'string',
                                        'example': 'Example forum object'
                                    }
                                }
                            }
                        },
                        'msg': {
                            'type': 'string',
                            'example': 'Project milestones sent'
                        },
                    }
                }
            },
            400: {
                'description': 'Login first',
                'schema': {
                    'type': 'object',
                    'properties': {
                        'code': {
                            'type': 'integer',
                            'example': 400
                        },
                        'msg': {
                            'type': 'string',
                            'example': 'Login first'
                        },
                    }
                }
            }
        },
    })
    def post(self, project_id, post_id):
        curr_userID = verify_token(request.authorization.token)
        curr_postID = request.get_json().get('post_id')
        curr_num_of_reply = request.get_json().get('num_of_reply')
        curr_reply_json = request.get_json().get('reply_json')
        if curr_userID is not None:
            projectForum = ProjectForum().query.filter_by(post_id=curr_postID).first()
            if projectForum:
                projectForum.post_id = curr_postID
                projectForum.num_of_reply = curr_num_of_reply
                projectForum.reply_json = json.dumps(curr_reply_json)
                db.session.commit()
                return jsonify({
                    'code': 200,
                    'msg': "Project forum submit!"
                })
            else:
                return jsonify({
                    'code': 401,
                    'msg': "Project forum not found!"
                })
        else:
            return jsonify({
                'code': 400,
                'msg': 'Login first'
            })


