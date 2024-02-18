from flask import request, jsonify, current_app
from flask_restful import Resource
from sqlalchemy import func
from ..utils.models import Tags, verify_token, User, UserTags
from ..utils.forms import TagsForm
from ..utils.extension import db


class userTagsView(Resource):
    def get(self):
        """
          API for user to get all the tags
          ---
          responses:
            200:
              description: All tags sent
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
                        tag_name:
                          type: string
                          example: tag0
                  msg:
                    type: string
                    example: All tags sent
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            target_user_email = request.args.get("email")
            if target_user_email:
                target_user = User.query.filter_by(email=target_user_email).first()
                curr_userID = target_user.id
            tags = Tags.query.join(UserTags, UserTags.tag_id == Tags.id).filter(UserTags.user_id == curr_userID).all()
            return jsonify({
                "code": 200,
                "data": [tag.to_dict() for tag in tags],
                "msg": "All tags sent"
            })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })

    def post(self):
        """
          API for user to upload tags
          ---
          parameters:
            - in: body
              name: Input
              type: object
              required: true
              schema:
                properties:
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        tag_name:
                          type: string
                          example: tagName

          responses:
            201:
              description: User tags submit
              schema:
                properties:
                  code:
                    type: integer
                    example: 201
                  msg:
                    type: string
                    example: User tags submit
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            curr_tags_JSON = request.get_json()
            curr_tags_forms = []
            for item in curr_tags_JSON['data']:
                form = TagsForm()
                form.tag_name = item['tag_name']
                curr_tags_forms.append(form)
            curr_user_tag = UserTags.query.filter_by(user_id=curr_userID).delete()
            db.session.commit()
            for form in curr_tags_forms:
                tag_name = form.tag_name.lower().replace(' ', '')
                curr_tag = Tags.query.filter(func.lower(func.replace(Tags.tag_name, ' ', '')) == tag_name).first()
                if curr_tag:
                    current_app.logger.info("Containing this tag, continue %s", tag_name)
                else:
                    new_tag = Tags()
                    new_tag.tag_name = form.tag_name
                    current_app.logger.info("Not containing this tag, adding %s", tag_name)
                    db.session.add(new_tag)
                    db.session.commit()
                # curr_tag = Tags.query.filter(func.lower(func.replace(Tags.tag_name, ' ', '')) == tag_name).first()
                # curr_user_tag = UserTags.query.filter_by(user_id=curr_userID, tag_id=curr_tag.id).first()
                # if curr_user_tag:
                #     current_app.logger.info("Containing this user_tag, continue")
                # else:
                #     current_app.logger.info("Not containing this user_tag, adding")
                #     new_user_tag = UserTags()
                #     new_user_tag.user_id = curr_userID
                #     new_user_tag.tag_id = curr_tag.id
                #     db.session.add(new_user_tag)
                #     db.session.commit()
                curr_tag = Tags.query.filter(func.lower(func.replace(Tags.tag_name, ' ', '')) == tag_name).first()
                new_user_tag = UserTags()
                new_user_tag.user_id = curr_userID
                new_user_tag.tag_id = curr_tag.id
                db.session.add(new_user_tag)
                db.session.commit()
            return jsonify({
                "code": 201,
                "msg": "User tags submit"
            })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })
