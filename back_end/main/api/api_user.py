import random
import re

from flask import request, jsonify, current_app
from flask_restful import Resource
from flask_mail import Message
from email_validator import validate_email, EmailNotValidError

from ..utils.models import User, EmailVerification, create_token, verify_token, logout
from ..utils.extension import db, mail
from ..utils.forms import LoginForm, RegisterForm, json_to_dict

'''
    Use validate_email to valiate email format
'''


def email_format_verification(email):
    try:
        validate_email(email)
        return True
    except EmailNotValidError as e:
        print(e)
        return False


'''
    Use str.endwith to check if the user's email meets the demands of each role
    role 1 - student's email should be endwith @ad.unsw.edu.au or @student.unsw.edu.au
    role 2 - Academic advisor's email should be endwith @unsw.edu.au
'''


def email_suffix_verification(email, role):
    if ((role == 0 or role == 1) and not email.endswith('@unsw.edu.au')) \
            or (role == '1' and not (email.endswith('@ad.unsw.edu.au') or email.endswith('@student.unsw.edu.au'))):
        return 400, "UNSW email required"
    else:
        return 200, "Success"


class userLoginView(Resource):
    def post(self):
        """
            API for user to Login
            ---
            parameters:
              - in: body
                name: Input
                type: object
                required: true
                schema:
                  properties:
                    email:
                      type: string
                      example: no-reply@unsw.edu.au
                    password:
                      type: string
                      example: admin
            responses:
              200:
                description: Login Succeed
                schema:
                  properties:
                    code:
                      type: integer
                      example: 200
                    data:
                      type: object
                      properties:
                          token:
                            type: string
                            example: IjAi.ZSkx-Q.aw_N3ys6fhA107TzvbaHCYNY0Zo
                          role:
                            type: integer
                            example: 0
                    msg:
                      type: string
                      example: Login Succeed
        """
        login_info = request.get_json()
        current_app.logger.info(login_info)
        login_form = LoginForm(data=json_to_dict(login_info))
        if login_form.validate():
            email = login_form.email.data
            password = login_form.password.data
            if not email_format_verification(email):
                current_app.logger.error("Email format error")
                return jsonify({"code": 400,
                                "msg": "Email format error"})
            user = User.query.filter_by(email=email).first()
            if user and user.verify_password(password):
                token = create_token(user.id)
                current_app.logger.info("Login Succeed -> User ID: %d", user.id)
                return jsonify({"code": 200,
                                "data": {
                                    "token": token,
                                    "username": user.username,
                                    "role": user.role,
                                    "user_id": user.id
                                },
                                "msg": "Login Succeed"})
            else:
                current_app.logger.error("Username or Password Error")
                return jsonify({"code": 401,
                                "msg": "Username or Password Error"})
        else:
            return jsonify(login_form.errors)


class userRegisterView(Resource):
    def post(self):
        """
            API for user to register
            ---
            parameters:
              - in: body
                name: Input
                type: object
                required: true
                schema:
                  properties:
                    username:
                      type: string
                      example: admin
                    password:
                      type: string
                      example: admin
                    email:
                      type: string
                      example: no-reply@unsw.edu.au
                    verify_code:
                      type: string
                      example: admin
                    role:
                      type: integer
                      example: 0
            responses:
              201:
                description: Register Succeed
                schema:
                  properties:
                    code:
                      type: integer
                      example: 201
                    msg:
                      type: string
                      example: Register Succeed
        """
        register_info = request.get_json()
        current_app.logger.info(register_info)
        register_form = RegisterForm(data=json_to_dict(register_info))
        if register_form.validate():
            username = register_form.username.data
            password = register_form.password.data
            email = register_form.email.data
            verify_code = int(register_form.verify_code.data)
            role = register_form.role.data
            user = User.query.filter_by(email=email).first()
            email_verification = EmailVerification.query.filter_by(email=email).first()
            email_code, email_msg = email_suffix_verification(email, role)
            if not re.match(r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)', password):
                current_app.logger.error("Password must contain uppercase and lowercase letters, numbers, and symbols")
                return jsonify({"code": 400,
                                "msg": "Password must contain uppercase and lowercase letters, numbers, and symbols"})
            elif not email_format_verification(email):
                current_app.logger.error("Email format error")
                return jsonify({"code": 400,
                                "msg": "Email format error"})
            elif not email_verification or verify_code != email_verification.verification_code:
                current_app.logger.error("Verify your email first")
                return jsonify({"code": 400,
                                "msg": "Verify your email first"})
            elif email_code == 400:
                current_app.logger.error(email_msg)
                return jsonify({"code": email_code,
                                "msg": email_msg})
            elif user:
                current_app.logger.error("Username already exists")
                return jsonify({"code": 400,
                                "msg": "Username already exists"})
            else:
                # Add new user into User table
                new_user = User()
                new_user.username = username
                new_user.password = password
                new_user.email = email
                new_user.role = role
                db.session.add(new_user)
                db.session.commit()
                # Add new user's permission into UserPermission table
                new_user_id = User.query.filter_by(email=email).first().id
                return jsonify({"code": 201,
                                "data": {
                                    "token": create_token(new_user_id)
                                },
                                "msg": "Register Succeed"})
        else:
            return jsonify(register_form.errors)


class generateEmailRandomCodeView(Resource):
    def post(self):
        """
            API for user to let verify code sent to their email
            ---
            parameters:
              - in: body
                name: Input
                type: object
                required: true
                schema:
                  properties:
                    email:
                      type: string
                      example: no-reply@unsw.edu.au
            responses:
              201:
                description: Register Succeed
                schema:
                  properties:
                    code:
                      type: integer
                      example: 200
                    msg:
                      type: string
                      example: Email Sending Succeed
        """
        register_info = request.get_json()
        receiver_email = register_info["email"]
        current_app.logger.info(register_info)
        if email_format_verification(receiver_email):
            random_code = random.randint(100000, 999999)
            msg = Message('PeriPeriChicken', sender='boxuan.guo.personal@gmail.com', recipients=[receiver_email])
            msg.body = str(random_code)
            mail.send(msg)
            email_verification = EmailVerification.query.filter_by(email=receiver_email).first()
            if email_verification:
                email_verification.verification_code = str(random_code)
                db.session.commit()
            else:
                new_email_verification = EmailVerification()
                new_email_verification.email = receiver_email
                new_email_verification.verification_code = random_code
                db.session.add(new_email_verification)
                db.session.commit()
            current_app.logger.info("Email Sending Succeed")
            return jsonify({"code": 200,
                            "msg": "Email Sending Succeed"})
        else:
            current_app.logger.error("Email format error")
            return jsonify({"code": 400,
                            "msg": "Email format error"})


class logoutView(Resource):
    def post(self):
        """
            API for user to logout
            ---
            parameters:
              - in: body
                name: Input
                type: object
                required: true
                schema:
                  properties:
                    token:
                      type: string
                      example: IjAi.ZSa6WA.599-kWuAzCeZW8LaMCk-URHXdiU
            responses:
              201:
                description: Logout Succeed
                schema:
                  properties:
                    code:
                      type: integer
                      example: 200
                    msg:
                      type: string
                      example: Logout Succeed
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            logout(request.authorization.token)
            return jsonify({
                'code': 200,
                'msg': "Logout Succeed"
            })
        else:
            return jsonify({
                'code': 400,
                'msg': "Login first"
            })


class accountDetailView(Resource):
    def get(self):
        """
            API for user to get current account detail
            ---
            responses:
              201:
                description: Current account detail sent
                schema:
                  properties:
                    code:
                      type: integer
                      example: 200
                    data:
                      type: object
                      properties:
                        email:
                          type: string
                          example: no-reply@unsw.edu.au
                        username:
                          type: string
                          example: admim
                    msg:
                      type: string
                      example: Current account detail sent
        """
        curr_userID = verify_token(request.authorization.token)
        curr_user = User.query.filter_by(id=curr_userID).first()
        return jsonify({
            "code": 200,
            "data": {
                "email": curr_user.email,
                "username": curr_user.username
            },
            "msg": "Current account detail sent"
        })


