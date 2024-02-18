from flask import request, jsonify, current_app
from flask_restful import Resource
from sqlalchemy import func
from ..utils.models import Tags, verify_token, User, UserTags, ProjectInformation, PersonalInfo
from ..utils.forms import TagsForm
from ..utils.extension import db

class Recommendate_Researcher_View(Resource):
    #AS stucent& project partner  user login, recommanded academaic researher
    def get(self):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            curr_user = User.query.filter_by(id=curr_userID).first()
            if curr_user.role==1 or curr_user.role==3:               # student & industry partner only
                all_researchers = User.query.filter_by(role=2).all()#all researchers   #all projects
                all_tags = Tags.query.all()
                researchers_scores = []
                curr_user_tag_id_list = []
                curr_user_tag_name_list = []    #compare it with researcher tag_name_list & append score

                curr_user_tags = UserTags.query.filter_by(user_id=curr_userID)
                for user_tag in curr_user_tags:
                    curr_user_tag_id_list.append(user_tag.tag_id)
                for tag in all_tags:
                    for curr_user_tag_id in curr_user_tag_id_list:
                        if curr_user_tag_id==tag.id:
                            curr_user_tag_name_list.append(tag.tag_name)
                cleaned_curr_user_tag_list = [''.join(tag.split()).lower() for tag in curr_user_tag_name_list] #ignore space&case
                set1 = set(cleaned_curr_user_tag_list)
                for researcher in all_researchers:
                    researcher_user_tags = UserTags.query.filter_by(user_id=researcher.id)
                    researcher_tag_id_list =[]
                    researcher_tag_name_list = []
                    for researcher_user_tag in researcher_user_tags:
                        researcher_tag_id_list.append(researcher_user_tag.tag_id)
                    for tag in all_tags:
                        for researcher_tag_id in researcher_tag_id_list:
                            if researcher_tag_id == tag.id:
                                researcher_tag_name_list.append(tag.tag_name)
                    cleaned_researcher_tag_list = [''.join(tag.split()).lower() for tag in researcher_tag_name_list]
                    set2 = set(cleaned_researcher_tag_list)
                    num_of_common_tags = len(set1.intersection(set2))
                    researcher_info = PersonalInfo.query.filter_by(user_id=researcher.id).first()
                    final_score = num_of_common_tags + float(researcher_info.average_rate)/10
                    researchers_scores.append(final_score)


                # Create a list of tuples (index, value) and then sort by value
                indexed_researchers_scores = sorted(enumerate(researchers_scores), key=lambda x: x[1], reverse=True)

                # Get indices of the top three values
                indices_of_top_three_researcher = [index for index, value in indexed_researchers_scores[:3]]
                data = []

                for index in indices_of_top_three_researcher:
                    researcher = all_researchers[index]
                    data.append({
                        'academic_researcher_name': researcher.username,
                        'researcher_user_id': researcher.id,
                        'tag_score': researchers_scores[index],
                        'researcher_email': researcher.email
                    })
                return jsonify({
                    "code": 201,
                    "data": data,
                    "msg": "most 3 suitable academic researchers  sent"

                })
            else:
                return jsonify({
                    "code": 400,
                    "msg": "researcher user has no recommandation of researcher "
                })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })
class Recommendate_Project_View(Resource):
    #AS student user & supervisor login, recommanded with projects based on tag
    def get(self):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            curr_user = User.query.filter_by(id=curr_userID).first()
            if curr_user.role == 1 or curr_user.role == 2:    #student &supervisor only
                all_projects = ProjectInformation.query.all()
                all_tags = Tags.query.all()
                projects_scores = []
                curr_user_tag_id_list = []
                curr_user_tag_name_list = []  # compare it with researcher tag_name_list & append score
                curr_user_tags = UserTags.query.filter_by(user_id=curr_userID)
                for user_tag in curr_user_tags:
                    curr_user_tag_id_list.append(user_tag.tag_id)
                for tag in all_tags:
                    for curr_user_tag_id in curr_user_tag_id_list:
                        if curr_user_tag_id == tag.id:
                            curr_user_tag_name_list.append(tag.tag_name)
                cleaned_curr_user_tag_list = [''.join(tag.split()).lower() for tag in curr_user_tag_name_list]  # ignore space&case
                set1 = set(cleaned_curr_user_tag_list)
                for project in all_projects:
                    project_tag_name_list = project.required_skills.split(",")
                    cleaned_researcher_tag_list = [''.join(tag.split()).lower() for tag in project_tag_name_list]
                    set2 = set(cleaned_researcher_tag_list)
                    num_of_common_tags = len(set1.intersection(set2))
                    projects_scores.append(num_of_common_tags)
                    # Create a list of tuples (index, value) and then sort by value
                    indexed_projects_scores = sorted(enumerate(projects_scores), key=lambda x: x[1], reverse=True)

                # Get indices of the top three values
                indices_of_top_three_project = [index for index, value in indexed_projects_scores[:3]]
                data = []

                for index in indices_of_top_three_project:
                    project = all_projects[index]
                    data.append({
                        'project_name': project.project_name,
                        'owner_username': project.owner_username,
                        'tag_score': projects_scores[index],
                        'project_id': project.id
                    })
                return jsonify({
                    "code": 201,
                    "data": data,
                    "msg": "most 3 suitable projects  sent"
                })
            else:
                return jsonify({
                        "code": 400,
                        "msg": "only student& acdeamic superviosr has recommendation of projects "
                })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })

class Recommendate_Student_View(Resource):
    #AS industry partner  user login, recommanded student
    def get(self):
        curr_userID = verify_token(request.authorization.token)
        if curr_userID is not None:
            curr_user = User.query.filter_by(id=curr_userID).first()
            if curr_user.role==3:               # industry partner only
                all_students = User.query.filter_by(role=1).all()#all students
                all_tags = Tags.query.all()
                students_scores = []
                curr_user_tag_id_list = []
                curr_user_tag_name_list = []    #compare it with researcher tag_name_list & append score

                curr_user_tags = UserTags.query.filter_by(user_id=curr_userID)
                for user_tag in curr_user_tags:
                    curr_user_tag_id_list.append(user_tag.tag_id)
                for tag in all_tags:
                    for curr_user_tag_id in curr_user_tag_id_list:
                        if curr_user_tag_id==tag.id:
                            curr_user_tag_name_list.append(tag.tag_name)
                cleaned_curr_user_tag_list = [''.join(tag.split()).lower() for tag in curr_user_tag_name_list] #ignore space&case
                set1 = set(cleaned_curr_user_tag_list)
                for student in all_students:
                    student_user_tags = UserTags.query.filter_by(user_id=student.id)
                    student_tag_id_list =[]
                    student_tag_name_list = []
                    for student_user_tag in student_user_tags:
                        student_tag_id_list.append(student_user_tag.tag_id)
                    for tag in all_tags:
                        for student_tag_id in student_tag_id_list:
                            if student_tag_id == tag.id:
                                student_tag_name_list.append(tag.tag_name)
                    cleaned_researcher_tag_list = [''.join(tag.split()).lower() for tag in student_tag_name_list]
                    set2 = set(cleaned_researcher_tag_list)
                    num_of_common_tags = len(set1.intersection(set2))
                    student_info = PersonalInfo.query.filter_by(user_id=student.id).first()
                    final_score = num_of_common_tags + float(student_info.average_rate) / 10
                    students_scores.append(final_score)


                # Create a list of tuples (index, value) and then sort by value
                indexed_students_scores = sorted(enumerate(students_scores), key=lambda x: x[1], reverse=True)

                # Get indices of the top three values
                indices_of_top_three_student = [index for index, value in indexed_students_scores[:3]]
                data = []

                for index in indices_of_top_three_student:
                    student = all_students[index]
                    data.append({
                        'student_name': student.username,
                        'student_user_id': student.id,
                        'tag_score': students_scores[index],
                        'student_email': student.email
                    })
                return jsonify({
                    "code": 201,
                    "data": data,
                    "msg": "most 3 suitable student  sent"

                })
            else:
                return jsonify({
                    "code": 400,
                    "msg": "only industry partner user has  recommandation of students "
                })
        else:
            return jsonify({
                "code": 400,
                "msg": "Login first"
            })
