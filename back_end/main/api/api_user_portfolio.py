import base64
import datetime
import io

from flask import request, jsonify, current_app, make_response, send_file
from flask_restful import Resource

from ..utils.extension import db
from ..utils.forms import UserEducationForm, UserProjectExperienceForm, PostStudentResumeForm, PersonalInfoForm, \
    CertificationForm, CompanyForm
from ..utils.models import PersonalInfo, UserEducation, UserProjectExperience, StudentResume, verify_token, User, \
    Certification, Company


class personalInfoView(Resource):
    def get(self):
        """
          API for user to upload their user information
          ---
          responses:
            200:
              description: User project experience submit
              schema:
                properties:
                  code:
                    type: integer
                    example: 200
                  data:
                    type: object
                    properties:
                      name:
                        type: string
                        example: NullPointerException
                      email:
                        type: string
                        example: null@pointer.exception
                      location:
                        type: string
                        example: Sydney
                      personal_summary:
                        type: string
                        example: Nothing here~
                  msg:
                    type: string
                    example: Personal information sent
        """
        # Step 1: Obtain the current user's id from the session
        user_id = verify_token(request.authorization.token)
        if user_id is None:
            return jsonify({
                "code": 401,
                'msg': 'Not logged in'
            })  # Return a 401 Unauthorized response if not logged in
        target_user_email = request.args.get("email")
        if target_user_email:
            target_user = User.query.filter_by(email=target_user_email).first()
            user_id = target_user.id
        # Step 2: Query the PersonalInfo table to find the record associated with the current user's id
        personal_info_record = PersonalInfo.query.filter_by(user_id=user_id).first()
        if personal_info_record is None:
            return jsonify({
                "code": 400,
                'msg': 'No personal info found for the current user'
            })  # Return a 404 Not Found response if no personal info record exists for the current user

        # Step 3: Return the personal info record of the current user
        return jsonify({
            "code": 200,
            "data": personal_info_record.to_dict(),
            "msg": "Personal information sent"
        })

    def post(self):
        """
          API for user to upload their user information
          ---
          parameters:
            - in: body
              name: Input
              type: object
              required: true
              schema:
                properties:
                  name:
                    type: string
                    example: NullPointerException
                  phone:
                    type: string
                    example: 1008611
                  location:
                    type: string
                    example: Sydney
                  personal_summary:
                    type: string
                    example: Nothing here~
          responses:
            201:
              description: User project experience submit
              schema:
                properties:
                  code:
                    type: integer
                    example: 200
                  msg:
                    type: string
                    example: Personal information submit
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            personal_info = PersonalInfo.query.filter_by(user_id=curr_userID).delete()
            db.session.commit()
            curr_personalinfo_JSON = request.get_json()
            form = PersonalInfoForm()

            # Populate form fields directly from curr_personalinfo_JSON
            form.user_id = curr_personalinfo_JSON.get('user_id', None)  # Assuming user_id might be optional
            form.name = curr_personalinfo_JSON.get('name', '')
            form.phone = curr_personalinfo_JSON.get('phone', '')
            form.location = curr_personalinfo_JSON.get('location', '')
            form.personal_summary = curr_personalinfo_JSON.get('personal_summary', '')
            form.degree = curr_personalinfo_JSON.get('degree','')
            form.major = curr_personalinfo_JSON.get('major', '')
            form.company = curr_personalinfo_JSON.get('company', '')
            form.area = curr_personalinfo_JSON.get('area', '')

            personalInfo = PersonalInfo()
            personalInfo.user_id = curr_userID
            personalInfo.name = form.name
            personalInfo.phone = form.phone
            personalInfo.location = form.location
            personalInfo.personal_summary = form.personal_summary
            personalInfo.degree = form.degree
            personalInfo.major = form.major
            personalInfo.company = form.company
            personalInfo.area = form.area
            db.session.add(personalInfo)
            db.session.commit()

            return jsonify({
                "code": 201,
                "msg": "persoanl info submited"
            })
        else:
            return jsonify({
                "code": 401,
                "msg": "Login first"
            })


class userEducationInfoView(Resource):
    def get(self):
        """
          API for user to get their Education
          ---
          responses:
            200:
              description: User education info sent
              schema:
                properties:
                  code:
                    type: integer
                    example: 201
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                          required: false
                          example: 0
                        degree:
                          type: string
                          example: degree
                        major:
                          type: string
                          example: major
                        user_id:
                          type: string
                          example: user_id
                  msg:
                    type: string
                    example: User education info sent
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            target_user_email = request.args.get("email")
            if target_user_email:
                target_user = User.query.filter_by(email=target_user_email).first()
                curr_userID = target_user.id
            user_educaiton_list = UserEducation.query.filter_by(user_id=curr_userID)
            return jsonify({
                "code": 200,
                "data": [user_educaiton.to_dict() for user_educaiton in user_educaiton_list],
                "msg": "User education info sent"
            })
        else:
            return jsonify({
                "code": 401,
                "msg": "Login first"
            })

    def post(self):
        """
          API for user to upload their user Education
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
                        id:
                          type: integer
                          required: false
                          example: 0
                        degree:
                          type: string
                          example: degree
                        major:
                          type: string
                          example: major
                        user_id:
                          type: string
                          example: user_id
          responses:
            201:
              description: User education info submit
              schema:
                properties:
                  code:
                    type: integer
                    example: 201
                  msg:
                    type: string
                    example: User education info submit
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            UserEducation.query.filter_by(user_id=curr_userID).delete()
            db.session.commit()
            curr_userEducation_JSON = request.get_json()
            curr_userEducation_Forms = []
            for item in curr_userEducation_JSON['data']:
                form = UserEducationForm()
                try:
                    form.id = item['id']
                except KeyError:
                    form.id = None
                form.degree = item['degree']
                form.major = item['major']
                curr_userEducation_Forms.append(form)
            for form in curr_userEducation_Forms:
                if form.id != None:
                    userEducationInfo = UserEducation.query.filter_by(id=form.id).first()
                    if userEducationInfo:
                        userEducationInfo.id = form.id
                        userEducationInfo.user_id = curr_userID
                        userEducationInfo.degree = form.degree
                        userEducationInfo.major = form.major
                        db.session.commit()
                    else:
                        return jsonify({
                            "code": 400,
                            "msg": "No such a user education record exists"
                        })
                else:
                    userEducationInfo = UserEducation()
                    userEducationInfo.user_id = curr_userID
                    userEducationInfo.degree = form.degree
                    userEducationInfo.major = form.major
                    db.session.add(userEducationInfo)
                    db.session.commit()

            return jsonify({
                "code": 201,
                "msg": "User education info submit"
            })
        else:
            return jsonify({
                "code": 401,
                "msg": "Login first"
            })


class userProjectExperienceView(Resource):
    def get(self):
        """
          API for user to get their project experience
          ---
          responses:
            200:
              description: Get user project experience
              schema:
                properties:
                  code:
                    type: integer
                    example: 201
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                          required: false
                          example: 0
                        project_name:
                          type: integer
                          required: false
                          example: 0
                        discipline:
                          type: string
                          example: discipline
                        end_date:
                          type: string
                          example: 13-12-1999
                        start_date:
                          type: string
                          example: 13-12-1999
                        user_id:
                          type: string
                          example: user_id
                  msg:
                    type: string
                    example: User project experience sent
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            target_user_email = request.args.get("email")
            if target_user_email:
                target_user = User.query.filter_by(email=target_user_email).first()
                curr_userID = target_user.id
            user_project_experience_list = UserProjectExperience.query.filter_by(user_id=curr_userID)
            return jsonify({
                "code": 200,
                "data": [user_project_experience.to_dict() for user_project_experience in user_project_experience_list],
                "msg": "User project experience sent"
            })
        else:
            return jsonify({
                "code": 401,
                "msg": "Login first"
            })

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
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: integer
                          required: false
                          example: 0
                        project_name:
                          type: string
                          example: project_name
                        discipline:
                          type: string
                          example: discipline
                        start_data:
                          type: string
                          example: 13-12-1999
                        end_data:
                          type: string
                          example: 13-12-1999

          responses:
            201:
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
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            projects = UserProjectExperience.query.filter_by(user_id=curr_userID).delete()
            db.session.commit()
            curr_userProject_JSON = request.get_json()
            curr_userProject_Forms = []
            for item in curr_userProject_JSON['data']:
                form = UserProjectExperienceForm()
                try:
                    form.id = item['id']
                except KeyError:
                    form.id = None
                form.project_name = item['project_name']
                form.discipline = item['discipline']
                print(type(item['start_date']), item['start_date'])
                form.start_date = datetime.datetime.strptime(item['start_date'], "%d-%m-%Y")
                form.end_date = datetime.datetime.strptime(item['end_date'], "%d-%m-%Y")
                curr_userProject_Forms.append(form)
            for form in curr_userProject_Forms:
                if form.id != None:
                    userProjectExperience = UserProjectExperience.query.filter_by(id=form.id).first()
                    if userProjectExperience:
                        userProjectExperience.id = form.id
                        userProjectExperience.user_id = curr_userID
                        userProjectExperience.project_name = form.project_name
                        userProjectExperience.discipline = form.discipline
                        userProjectExperience.start_date = form.start_date
                        userProjectExperience.end_date = form.end_date
                        db.session.commit()
                    else:
                        return jsonify({
                            "code": 400,
                            "msg": "No such a user project experience record exists"
                        })
                else:
                    userProjectExperience = UserProjectExperience()
                    userProjectExperience.user_id = curr_userID
                    userProjectExperience.user_id = curr_userID
                    userProjectExperience.project_name = form.project_name
                    userProjectExperience.discipline = form.discipline
                    userProjectExperience.start_date = form.start_date
                    userProjectExperience.end_date = form.end_date
                    db.session.add(userProjectExperience)
                    db.session.commit()

            # user_educaiton_list = PersonalInfo.query.filter_by(user_id=curr_userID)
            return jsonify({
                "code": 201,
                # "data": [user_educaiton.to_dict() for user_educaiton in user_educaiton_list],
                "msg": "User project experience submit"
            })
        else:
            return jsonify({
                "code": 401,
                "msg": "Login first"
            })


class studentResumeView(Resource):
    def get(self):
        """
          API for user to get their resume
          ---
          responses:
            200:
              description: Student resume sent
              schema:
                properties:
                  code:
                    type: integer
                    example: 200
                  data:
                    type: string
                  msg:
                    type: string
                    example: Student resume sent
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            target_user_email = request.args.get("email")
            if target_user_email:
                target_user = User.query.filter_by(email=target_user_email).first()
                curr_userID = target_user.id
            studentResume = StudentResume.query.filter_by(user_id=curr_userID).first()
            if studentResume:
                getStudentResumeFile_Text = studentResume.resume_file
                getStudentResumeFile_Bytes = base64.b64decode(getStudentResumeFile_Text)
                getStudentResumeFile_IO = io.BytesIO(getStudentResumeFile_Bytes)

                response = make_response(
                    send_file(getStudentResumeFile_IO, mimetype='application/pdf', as_attachment=True,
                              attachment_filename=f'{curr_userID}.pdf'))  # 将文件名设置为 user_id.pdf
                response.headers['Content-Disposition'] = f'inline; filename={curr_userID}.pdf'
                return response

                return jsonify({
                    "code": 200,
                    "data": studentResume.resume_file,
                    "msg": "Student resume sent"
                })
            else:
                return jsonify({
                    "code": 400,
                    "msg": "No such student resume"
                })
        else:
            return jsonify({
                "code": 401,
                "msg": "Login first"
            })

    def post(self):
        """
          API for user to upload their resume
          ---
          parameters:
            - in: body
              name: Input
              type: object
              required: true
              schema:
                properties:
                  resume_file:
                    type: string
          responses:
            201:
              description: Student resume uploaded
              schema:
                properties:
                  code:
                    type: integer
                    example: 200
                  msg:
                    type: string
                    example: Student resume uploaded
        """
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            postStudentResumeFile = request.files.get('resume_file')
            postStudentResumeFile_Bytes = postStudentResumeFile.read()
            postStudentResumeFile_Base64 = base64.b64encode(postStudentResumeFile_Bytes)
            postStudentResumeFile_Text = postStudentResumeFile_Base64.decode('ascii')

            postStudentResumeForm = PostStudentResumeForm()
            postStudentResumeForm.user_id = curr_userID
            postStudentResumeForm.resume_file = postStudentResumeFile_Text

            studentResume = StudentResume.query.filter_by(user_id=curr_userID).first()
            if studentResume:
                studentResume.resume_file = postStudentResumeForm.resume_file
                db.session.commit()
            else:
                studentResume = StudentResume()
                studentResume.user_id = curr_userID
                studentResume.resume_file = postStudentResumeForm.resume_file
                db.session.add(studentResume)
                db.session.commit()
            return jsonify({
                "code": 200,
                "msg": "Student resume uploaded"
            })
        else:
            return jsonify({
                "code": 401,
                "msg": "Login first"
            })


class certificateView(Resource):
    def post(self):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            certificationFile = request.files.get('certification_file')
            certificationFile_Bytes = certificationFile.read()
            certificationFile_Base64 = base64.b64encode(certificationFile_Bytes)
            certificationFile_Text = certificationFile_Base64.decode('ascii')

            certificationForm = CertificationForm()
            certificationForm.user_id = curr_userID
            certificationForm.certification_file = certificationFile_Text

            certification = Certification.query.filter_by(user_id=curr_userID).first()
            if certification:
                certification.certification_file = certificationForm.certification_file
                db.session.commit()
            else:
                certification = Certification()
                certification.user_id = curr_userID
                certification.certification_file = certificationForm.certification_file
                db.session.add(certification)
                db.session.commit()
            return jsonify({
                "code": 200,
                "msg": "Academic Advisor or Industry Partner certification uploaded"
            })
        else:
            return jsonify({
                "code": 401,
                "msg": "Login first"
            })


class companyView(Resource):
    def get(self):
        """
          API for user to get their company information
          ---
          responses:
            200:
              description: company information gotten
              schema:
                properties:
                  code:
                    type: integer
                    example: 200
                  data:
                    type: object
                    properties:
                      company_id:
                        type: integer
                        required: false
                        example: 0
                      company_name:
                        type: string
                        example: NullPointerException
                      company_email:
                        type: string
                        example: null@pointer.exception
                  msg:
                    type: string
                    example: company information gotten
        """
        user_id = verify_token(request.authorization.token)
        if user_id is not None:
            # Step 2: Query the comapny table to find the record associated with the current user's id
            target_user_email = request.args.get("email")
            if target_user_email:
                target_user = User.query.filter_by(email=target_user_email).first()
                user_id = target_user.id
            Company_record = Company.query.filter_by(user_id=user_id).first()
            if Company_record is None:
                return jsonify({
                    'code': 400,
                    'message': 'No personal info found for the current user'
                })  # Return a 404 Not Found response if no personal info record exists for the current user

            # Step 3: Return the personal info record of the current user
            return jsonify({
                "code": 200,
                "data": Company_record.to_dict(),
                "msg": "company information gotten"
            })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })

    def post(self):
        """
          API for user to upload their company information
          ---
          parameters:
            - in: body
              name: Input
              type: object
              required: true
              schema:
                properties:
                  company_id:
                    type: integer
                    required: false
                    example: 0
                  company_name:
                    type: string
                    example: NullPointerException
                  company_email:
                    type: string
                    example: null@pointer.exception
          responses:
            201:
              description: company posted
              schema:
                properties:
                  code:
                    type: integer
                    example: 200
                  msg:
                    type: string
                    example: company posted
        """
        user_id = verify_token(request.authorization.token)
        if user_id is None:
            return jsonify({
                'code': 400,
                'message': 'Not logged in'
            })  # Return a 401 Unauthorized response if not logged in
        data = request.get_json()
        if not data:
            return jsonify({
                'code': 400,
                'message': 'No input data provided'
            })
        companyForm = CompanyForm()
        companyForm.company_name = data.get('company_name')
        companyForm.company_area = data.get('company_area')

        # Attempt to fetch the existing PersonalInfo record for the current user
        existing_company = Company.query.filter_by(user_id=user_id).first()

        if existing_company is None:
            # No existing record found, so create a new one
            new_company = Company()
            new_company.user_id = user_id
            new_company.company_name = companyForm.company_name
            new_company.company_area = companyForm.company_area
            db.session.add(new_company)
        else:
            # Existing record found, so update it
            existing_company.company_name = companyForm.company_name
            existing_company.company_area = companyForm.company_area
        # Commit the changes
        db.session.commit()
        # Return the updated or newly-created personal info
        return jsonify({
            "code": 200,
            # "data": Company.query.filter_by(company_id=user_id).first().to_dict(),
            "msg": "company posted"
        })


class companySummrayView(Resource):
    def get(self):
        """
          API for user to get their company summary
          ---
          responses:
            200:
              description: Company information submit
              schema:
                properties:
                  code:
                    type: integer
                    example: 201
                  data:
                    type: object
                    properties:
                      company_summary:
                        type: string
                        example: This is a summary for company
                  msg:
                    type: string
                    example: Company summary submit
        """
        user_id = verify_token(request.authorization.token)
        if user_id is not None:
            target_user_email = request.args.get("email")
            if target_user_email:
                target_user = User.query.filter_by(email=target_user_email).first()
                user_id = target_user.id
            # Step 2: Query the comapny table to find the record associated with the current user's id
            Company_record = Company.query.filter_by(user_id=user_id).first()
            if Company_record is None:
                return jsonify({
                    'code': 400,
                    'message': 'No personal info found for the current user'
                })  # Return a 404 Not Found response if no personal info record exists for the current user

            # Step 3: Return the personal info record of the current user
            return jsonify({
                "code": 200,
                "data": Company_record.to_dict().get('company_summary'),
                "msg": "company information gotten"
            })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })

    def post(self):
        """
          API for user to upload their company summary
          ---
          parameters:
            - in: body
              name: Input
              type: object
              required: true
              schema:
                properties:
                  company_summary:
                    type: text
                    required: false
                    example: 0
          responses:
            201:
              description: Company information submit
              schema:
                properties:
                  code:
                    type: integer
                    example: 201
                  msg:
                    type: string
                    example: Company summary submit
        """
        user_id = verify_token(request.authorization.token)
        if user_id is not None:
            data = request.get_json()
            if not data:
                return jsonify({
                    'code': 400,
                    'message': 'No input data provided'
                })
            companyForm = CompanyForm()
            companyForm.company_summary = data.get('company_summary')
            # Attempt to fetch the existing PersonalInfo record for the current user
            existing_company = Company.query.filter_by(user_id=user_id).first()
            if existing_company is None:
                # No existing record found, so create a new one
                new_company = Company(
                    user_id=user_id,
                    company_summary=companyForm.company_summary
                )
                db.session.add(new_company)
            else:
                existing_company.company_summary = companyForm.company_summary
            db.session.commit()
            return jsonify({
                "code": 201,
                "msg": "Company summary submit"
            })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })


class PersonAvatar(Resource):
    def get(self):
        # curr_userID = request.args.get('user_id')
        target_user_email = request.args.get("email")
        if target_user_email:
            target_user = User.query.filter_by(email=target_user_email).first()
            curr_userID = target_user.id
        else:
            curr_userID = verify_token(request.authorization.token)
        curr_user_info = PersonalInfo.query.filter_by(user_id = curr_userID).first()
        if not curr_user_info:
            curr_user_info = PersonalInfo()
            curr_user_info.user_id = curr_userID;
            db.session.add(curr_user_info)
            db.session.commit()
        return jsonify({
            'code': 200,
            'data': curr_user_info.avatar,
            'msg': 'User avatar sent'
        })

    def post(self):
        curr_userID = verify_token(request.authorization.token)
        avatar_text = request.get_json().get('avatar')
        if curr_userID:
            curr_user_info = PersonalInfo.query.filter_by(user_id=curr_userID).first()
            if curr_user_info:
                curr_user_info.avatar = avatar_text
                db.session.commit()
            else:
                curr_user_info = PersonalInfo()
                curr_user_info.avatar = avatar_text
                db.session.add(curr_user_info)
                db.session.commit()
        else:
            return jsonify({
                'code': 401,
                'msg': 'Login first!'
            })
