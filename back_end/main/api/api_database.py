from datetime import datetime
from flask_restful import Resource
from ..utils.extension import db
from ..utils.models import User, ProjectInformation, ProjectApplication, PersonalInfo ,Tags, UserTags
import random

def reset_db():
    db.drop_all()
    db.create_all()

def init_users():
    for i in range(1, 6):  # Loop to create 5 users
        new_user = User(
            id=i,
            username=f'student{i}',
            password=f'student{i}',
            email=f'student{i}@gmail.com',
            role=1
        )
        personal_info = PersonalInfo(
            user_id=i
        )
        db.session.add(personal_info)
        db.session.add(new_user)
    for i in range(6, 11):  # Loop to create 5 users
        new_user = User(
            id=i,
            username=f'supervisor{i-5}',
            password=f'supervisor{i-5}',
            email=f'supervisor{i-5}@gmail.com',
            role=2
        )
        personal_info = PersonalInfo(
            user_id=i
        )
        db.session.add(personal_info)
        db.session.add(new_user)
    for i in range(11, 16):  # Loop to create 5 users
        new_user = User(
            id=i,
            username=f'partner{i-10}',
            password=f'partner{i-10}',
            email=f'partner{i-10}@gmail.com',
            role=3
        )
        personal_info = PersonalInfo(
            user_id=i
        )
        db.session.add(personal_info)
        db.session.add(new_user)



    project_application1 = ProjectApplication(
        id = 1,
        user_id = 1,
        project_id = 1,
        apply_time = datetime.now()
    )
    db.session.add(project_application1)
    db.session.commit()

    project_application2 = ProjectApplication(
        id = 2,
        user_id = 2,
        project_id = 1,
        apply_time = datetime.now()
    )
    db.session.add(project_application2)
    db.session.commit()

    project_application4 = ProjectApplication(
        id = 4,
        user_id = 4,
        project_id = 1,
        apply_time = datetime.now()
    )
    db.session.add(project_application4)
    db.session.commit()

    project_application5 = ProjectApplication(
        id = 5,
        user_id = 5,
        project_id = 1,
        apply_time = datetime.now()
    )
    db.session.add(project_application5)
    db.session.commit()

def create_tags():
    tag_names = [
        "Python", "Java", "JavaScript", "Data Science",
        "Machine Learning", "Web Development", "Cloud Computing",
        "Cybersecurity", "Artificial Intelligence", "Mobile Development"
    ]

    for tag_name in tag_names:
        new_tag = Tags(
            tag_name=tag_name
        )
        db.session.add(new_tag)

    db.session.commit()
def assign_tags_to_users():
    tag_ids = list(range(1, 11))  # Tag IDs from 1 to 10

    for user_id in range(1, 16):  # User IDs from 1 to 15
        chosen_tags = random.sample(tag_ids, 5)  # Randomly choose 5 tags for each user

        for tag_id in chosen_tags:
            user_tag = UserTags(
                user_id=user_id,
                tag_id=tag_id
            )
            db.session.add(user_tag)

    db.session.commit()

def get_tag_name(tag_id):
    tag_names = [
        "Python", "Java", "JavaScript", "Data Science",
        "Machine Learning", "Web Development", "Cloud Computing",
        "Cybersecurity", "Artificial Intelligence", "Mobile Development"
    ]
    # Adjust the index since list indices start from 0
    index = tag_id - 1
    # Ensure the index is within the range of the list
    if 0 <= index < len(tag_names):
        return tag_names[index]
    else:
        return "Unknown Tag"  # Return a default value if the ID is not valid


def create_projects_with_tags():
    tag_ids = list(range(1, 11))  # Assuming Tag IDs are from 1 to 10
    owners = [f'partner{i}' for i in range(1, 6)]  # Owner usernames from partner1 to partner5

    for _ in range(10):  # Create 10 projects
        chosen_tags = random.sample(tag_ids, 5)  # Randomly choose 5 tags for each project
        chosen_tag_names = [get_tag_name(tag_id) for tag_id in chosen_tags]  # Get tag names from tag IDs
        required_skills_str = ", ".join(chosen_tag_names)  # Convert tag names to a comma-separated string
        owner_username = random.choice(owners)  # Randomly choose an owner

        project = ProjectInformation(
            project_name=f"Project {_ + 1}",
            owner_username=owner_username,
            brief_problem_statement="Problem statement for project " + str(_ + 1),
            desired_outcomes="Desired outcomes for project " + str(_ + 1),
            required_skills=required_skills_str,
            potential_deliverables="Deliverable " + str(_ + 1),
            project_start_date=datetime.strptime("2023-01-01", "%Y-%m-%d").date(),
            project_end_date=datetime.strptime("2024-01-01", "%Y-%m-%d").date(),
            apply_start_date=datetime.strptime("2023-01-01", "%Y-%m-%d").date(),
            apply_end_date=datetime.strptime("2024-01-01", "%Y-%m-%d").date(),
            num_of_candidate=1
        )

        db.session.add(project)

    db.session.commit()  # Commit after adding all projects

class resetDBView(Resource):
    def get(self):
        reset_db()
        init_users()
        create_tags()
        assign_tags_to_users()
        create_projects_with_tags()
        return {
            'code':200,
            'msg': 'Database Reset!'
        }
