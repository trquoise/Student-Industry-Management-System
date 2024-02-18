import { Link } from '@material-ui/core'
import React from 'react'

const ProjectItem = (props) => {


    const project = props.project
    const index = props.index
  return (
    <>
        <div className='currentprojectdetail shadow'>
            <div className='index'>{index}</div>
            <div className='projectname'>
                <Link href={`/projectDetail/${project.project_id}/${project.project_name}`} underline="hover">
                    {project.project_name}
                </Link>
            </div>
            {
                project.status === '1' &&
                <div className='projectstatus'>Not yet start</div>
            }
            {
                project.status === '2' &&
                <div className='projectstatus'>In progress</div>
            }
            {
                project.status === '3' &&
                <div className='projectstatus'>Completed</div>
            }
            <div className='milestone'>
                <Link href={`/milestone/${project.project_id}/${project.project_name}`} underline="hover">
                    {'Milestone'}
                </Link>
            </div>
            <div className='feedback'>
                {
                    localStorage.getItem('role') == 1 &&
                    <Link href={`/studentFeedback/${project.project_id}/${project.project_name}`} underline="hover">
                        {'Feedback'}
                    </Link>
                }
                {
                    localStorage.getItem('role') == 2 &&
                    <Link href={`/supervisorFeedback/${project.project_id}/${project.project_name}`} underline="hover">
                        {'Feedback'}
                    </Link>
                }
                {
                    localStorage.getItem('role') == 3 &&
                    <Link href={`/industryFeedback/${project.project_id}/${project.project_name}`} underline="hover">
                        {'Feedback'}
                    </Link>
                }
            </div>
            <div className='forum'>
                <Link href={`/projectForum/${project.project_id}/${project.project_name}`} underline="hover">
                    {'Forum'}
                </Link>
            </div>
        </div>
    </>
  )
}

export default ProjectItem
