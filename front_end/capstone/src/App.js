import Studentproto from './Studentportfolio/Studentporto';
import Supervisorproto from './Supervisorportfolio/Supervisorporto';
import Industryporto from './Industryportfolio/Industryporto';
import logo from './logo.svg';
import './styles.css';
import React, { useEffect} from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import Home from './Authentication/Home'
import CreateProject from './Authentication/CreateProject';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import VisitorHomepage from './Authentication/VisitorHomepage';
import PersonInfoInReg from './Authentication/PersonInfoInReg';
import CompanyDetail from './Authentication/CompanyDetail'
import UserEducation from './Authentication/UserEducation'
import CurrentProjectDashboard from './Currentproject/Currentprojectdashboard';
import Studentfeedbackpage from './Feedback/StudentFeedback/Studentfeedbackpage';
import Supervisorfeedbackpage from './Feedback/SupervisorFeedback/Supervisorfeedbackpage';
import Milestone from './Milestone/Milestone';
import ProjectDetail from './ProjectDetail/ProjectDetail';
import Notification from './Notification/Notification';
import IndustryfeedbackPage from './Feedback/IndustryFeedback/Industryfeedbackpage';
import ProjectApply from './ProjectApply/ProjectApply';
import SearchProject from './SearchProject/SearchProject';

import Questionforum from './Forum/QuestionForum';
import ForumCreate from './Forum/ForumCreate';
import StickyHeadTable from './Forum/template';
import { Avatar } from '@mui/material';
import UploadAvatar from './ProtoTemplate/components/UploadAvatar';
import NavScrollExample from './ProtoTemplate/components/testHeader';
import Error from './Error/Error';





function App() {

  const navigate = useNavigate()
    useEffect(() => {
    if( !window.sessionStorage.hasLogin){
      navigate('/visitorHomepage');
    }
  }, [])
  return (
    <>

      <Routes>
        <Route path ='/' element={<Home/>}></Route>
        <Route path = '/studentportfolio' element = {<Studentproto/>}></Route>
        <Route path = '/industryportfolio' element = {<Industryporto/>}></Route>
        <Route path = '/supervisorportfolio' element = {<Supervisorproto/>}></Route>
        <Route path="/createProject" element={<CreateProject />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/personInfo" element={<PersonInfoInReg/>}></Route>
        <Route path="/visitorHomepage" element={<VisitorHomepage />}></Route>
        <Route path="/personinfo" element={<PersonInfoInReg />} ></Route>
        <Route path="/usereducation" element={<UserEducation />} ></Route>
        <Route path="/companydetail" element={<CompanyDetail />} ></Route>
        <Route path="/currentProject" element={<CurrentProjectDashboard />}></Route>
        <Route path="/notification" element={<Notification />}></Route>
        <Route path="/search" element={<SearchProject />}></Route>
        <Route path="/uploadAvatar" element={<UploadAvatar />}></Route>
        <Route path="/questionforum">
          <Route path=":project_id">
            <Route path=":post_id" element={<Questionforum />}/>
          </Route>
        </Route>
        <Route path="/projectForum">
          <Route path=":project_id">
            <Route path=":project_name" element={<StickyHeadTable />}/>
          </Route>
        </Route>
        <Route path="/apply">
          <Route path=":project_id" element={<ProjectApply/>}/>
        </Route>
        <Route path="/studentFeedback/">
          <Route path=":project_id">
            <Route path=":project_name" element={<Studentfeedbackpage />}/>
          </Route>
        </Route>
        <Route path="/industryFeedback/">
          <Route path=":project_id">
            <Route path=":project_name" element={<IndustryfeedbackPage />}/>
          </Route>
        </Route>
        <Route path="/supervisorFeedback" >
          <Route path=":project_id">
            <Route path=":project_name" element={<Supervisorfeedbackpage />}/>
          </Route>
        </Route>
        <Route path="/milestone" >
          <Route path=":project_id">
            <Route path=":project_name" element={<Milestone />}/>
          </Route>
        </Route>
        <Route path="/projectDetail">
          <Route path=":project_id" >
            <Route path=":project_name" element={<ProjectDetail />}/>
          </Route>
        </Route>
        <Route path="*" element={<Error />}/>
      </Routes>
      {/* <Notification/>

      </Routes>
    {/* <Notification/> */}
      {/* <Home/>   */}
    </>
  );
}

export default App;
