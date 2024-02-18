import React, {useEffect} from 'react';
import Card from './Components/Card.jsx';
import {useState} from 'react';
import Header from '../ProtoTemplate/Header'
import {Identity} from '@mui/base';
import {get} from "../AxiosInstance/axiosController";
import {response} from 'msw';
import SetSort from './Components/SetSort'
import Grid from '@mui/system/Unstable_Grid';
import {Box} from '@mui/system';


const Notification = () => {
    const [listData, setListData] = useState([]); // list of notification
    const [unprocessList, setUnprocessList] = useState([]); //
    const [sortedList, setSortedList] = useState([]); //
    const [invitationList, setInvitationList] = useState({});


    const fetchData = () => {
        get('/api/projectApplication').then((response) => {
            // console.log(response)
            if (response.status === 200) {
                // console.log("this is response", response)
                setListData(response.data.data);
            } else {
                console.log('wrong')
            }
        })

    }

    const fetchInvitationList = () =>{
        get('/api/projectinvitation').then((response) => {
            // console.log(response)
            if (response.status === 200) {
                console.log("this is response", response.data.data)
                setInvitationList(response.data.data);
            } else {
                console.log('wrong')
            }
        })

    }

    const getProcessedList = (data) => {
        // console.log("this is the processed from child",data)
    }

    const getUnprocessList = (data) => {
        // console.log("this is the unprocessed from child",data)
        setUnprocessList(data)
    }
    const sortList = (data) => {
        // console.log("this is the updated list",data)
        setSortedList(data)
        // sortedList = [...data]
        console.log("this is the updated sortlist", sortedList)

    }


    useEffect(() => {
        // timerId = setInterval(() => {
        fetchData();
        getProcessedList();
        getUnprocessList();
        fetchInvitationList();
        // console.log("listdata", listData);
        //   }, 1000);
        //   return () => {
        //     clearInterval(timerId);
        //   };
    }, []);

    // const Identification = window.localStorage.getItem('role');

    // console.log("listdata", invitationList);
    return (
        <>
            <Header/>
            <Grid container direction="column" spacing={2}>
                <Grid container direction="row">
                    <Grid xs={10}>
                    </Grid>
                    <Grid xs={2}>
                        <SetSort data={unprocessList} onUpdate={sortList} style={{paddingTop: "20px"}}/>
                    </Grid>
                </Grid>
                {
                    (listData != null && sortedList != null && invitationList) &&
                    <Card data={listData} fetchData={fetchData} getProcessedList={getProcessedList}
                          getUnprocessList={getUnprocessList} sortList={sortedList} invitation={invitationList}/>
                }

            </Grid>
        </>
    )

}

export default Notification


