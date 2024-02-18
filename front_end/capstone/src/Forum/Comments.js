import { useState, useEffect, useRef } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import {
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "./api";
import { get, post } from "../AxiosInstance/axiosController";
import { useParams } from "react-router-dom";

const Comments = ({ currentUserId, title, content}) => {
  const [backendComments, setBackendComments] = useState([]);
  const [activeComment, setActiveComment] = useState(null);
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  useEffect(()=> {
    get('/api/projectforum/' + param.project_id + '/' + param.post_id).then((response)=> {
      if (response.status === 200) {
        if (response.data.code == 200) {
            if (response.data.data.comments != null) {
              setBackendComments(response.data.data.comments)
            }
        }
      } else {
            console.log('wrong')
      }
    })
  },[])

  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  const addComment = (text, parentId) => {
    createCommentApi(text, parentId).then((comment) => {
      setBackendComments([comment, ...backendComments]);
      setActiveComment(null);
      sendComments([comment, ...backendComments])
    });
  };

  const updateComment = (text, commentId) => {
    updateCommentApi(text).then(() => {
      const updatedBackendComments = backendComments.map((backendComment) => {
        if (backendComment.id === commentId) {
          return { ...backendComment, body: text };
        }
        return backendComment;
      });
      setBackendComments(updatedBackendComments);
      sendComments(updatedBackendComments)
      setActiveComment(null);
    });
  };
  const deleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      deleteCommentApi().then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendComments(updatedBackendComments);
        sendComments(updatedBackendComments)
      });
    }
  };

  const sendComments = (newComments) => {
    console.log('here')
    const data = {
      post_id: param.post_id,
      num_of_reply: newComments.length,
      reply_json: {
        title: title,
        content: content,
        comments: newComments
      }
    }
    post('/api/projectforum/' + param.project_id + '/' + param.post_id, data).then((response)=> {
        if (response.status === 200) {
          console.log(response)
        } else {
            console.log('wrong')
        }
    })
  }

  const param = useParams()

  // const sendBackendComments= () => {
  //       const data = {
  //         post_id: param.post_id,
  //         num_of_reply: backendComments.length,
  //         reply_json: backendComments,
  //       }
  //       console.log(data)

  //       post('http://127.0.0.1:5000/api/projectforum/' + param.project_id + '/' + param.post_id, data).then((response)=> {
  //           if (response.status === 200) {
  //             console.log(response)
  //           } else {
  //               console.log('wrong')
  //           }
  //       })
  // }


  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (

          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={currentUserId}
          />
        ))
        }
      </div>
    </div>
  );
};

export default Comments;
