import React, { useState } from 'react';
import ReactDOM from "react-dom";
import Comments from './Comments';
import "./questionforum.css";
import { get } from '../AxiosInstance/axiosController';
import { useParams } from 'react-router-dom';
import Header from '../ProtoTemplate/Header';

const QuestionForum = ({currentUserId}) => {

  const [title, setTitle] = React.useState(null)
  const [description, setDescription] = React.useState(null)
  const param = useParams()

  React.useEffect(()=> {
    get('/api/projectforum/' + param.project_id + '/' + param.post_id).then((response)=> {
      if (response.status === 200) {
        console.log(response.data)
        if (response.data.code == 200) {
            setTitle(response.data.data.title)
            setDescription(response.data.data.content)

        }
      } else {
            console.log('wrong')
      }
    })
  },[])


  return (
    <>
      <Header/>
      <div className='container'>
          <div classname='question-forum-title'><h1 style={{fontSize: "80px", marginTop:"20px"}}>{title}</h1></div>
          <div classname='textarea'><h3 style={{fontSize: "40px", marginTop:"60px",marginBottom:"60px", paddingLeft: '10px'}}>{description}</h3></div>
          <Comments currentUserId={localStorage.getItem('currentUserId')} title={title} content={description}/>
      </div>
    </>
  )
}

export default QuestionForum