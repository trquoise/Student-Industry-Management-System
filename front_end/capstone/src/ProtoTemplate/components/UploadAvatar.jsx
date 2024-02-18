import React,{useEffect,useState} from 'react';
import Avatar from 'react-avatar-edit';
import Header from '../Header';
import { post } from '../../AxiosInstance/axiosController';

const UploadAvatar = () => {
    const[src,setsrc] = useState(null);
    const[preview,setPreview] = useState(null);

    const onClose =() =>{
        setPreview(null)
    }

    const onCrop = view =>{
        console.log(view)
        setPreview(view);
    }

    const handleSubmit = () => {
        localStorage.setItem('avatar', preview)
        const data = {
            avatar: preview
        }
        post('/api/useravatar', data).then((response)=> {
          if (response.status === 200) {
            alert('Update success')
            window.location.reload()
          } else {
              console.log('wrong')
          }
      })
    }

  return (
    <>
        <div>
            <Header/>

        </div>

        <div className='container' style={{display: 'flex',flexDirection:'column' ,margin:'auto',marginTop:'40px',marginBottom:'40'}}>
            <img src={preview}/>
            <Avatar
                width = {400}
                height = {500}
                onCrop={onCrop}
                onClose={onClose}
                src={src}/>
            <button style={{marginTop:'40px'}} onClick={handleSubmit}>Submit</button>

        </div>

    </>

  )
}

export default UploadAvatar
