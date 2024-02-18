import React from 'react'
import './companyintroduction.css'
import EditBtnCompSum from '../ProtoTemplate/components/EditBtnCompSum'
import {get} from '../AxiosInstance/axiosController'

const CompanyIntroduction = () => {
  var contents = []

  const [companyIntro, setCompanyIntro] = React.useState(null)
  const [newData, setNewData] = React.useState(null);


  React.useEffect(() => {
      get('/api/companyIntro').then((response) => {
        console.log(response.data)
          if (response.status === 200) {
            if(response.data.code == 200) {
              setCompanyIntro(response.data.data)
            }
          } else {
              console.log('wrong')
          }
      })
  }, [newData]);

  if (companyIntro != null) {
    contents = companyIntro
  }

  return (
    <div>
      <div className="container flex company">
            <div className="companyinfo shadow">
                <div className="infotitle"><h3>Company Introduction</h3></div>
                <div className='inputarea flex container'>
                    <textarea className='companysummary' value = {contents}></textarea>
                 </div>
                 <EditBtnCompSum setData = {setNewData}/>

            </div>

        </div>
    </div>
  )
}

export default CompanyIntroduction
