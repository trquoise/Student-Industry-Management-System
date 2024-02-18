import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';
import { AppBar, Toolbar, Typography} from '@mui/material';
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../AxiosInstance/axiosController';


function NavScrollExample() {
    const navigate = useNavigate()
    const [profile, setProfile] = React.useState('/studentportfolio')

    const [avatarEl, setAvatarEl] = React.useState(null)
    const [invisible, setInvisible] = React.useState(false);
    const [avatarSrc, setAvatarSrc] = React.useState(null);
    const handleAvatarClick = (e) => {
        setAvatarEl(e.currentTarget);
      };

      const handleAvatarClose = () => {
        setAvatarEl(null);
      };

      const handleCurrentProject = () => {
        navigate("/currentProject")
      }

      const handleCurrentAvatar = () =>{
        navigate("/uploadAvatar")
      }

      const handleLogout = () => {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error('No token found');
          return;
        }

        post('/api/logout', { token: token })
          .then(response => {
            console.log(response.data.msg);
            localStorage.clear()

            navigate('/login');
          })
          .catch(error => {
            console.error('Logout failed', error);
          });
      };

      const open = Boolean(avatarEl);
      //to do: change to localstorage
      var username = localStorage.getItem('username')
      var email = localStorage.getItem('email')


      React.useEffect(() => {
        if (localStorage.getItem('role') == '2') {
            setProfile('/supervisorportfolio')
        } else if (localStorage.getItem('role') == '3') {
            setProfile('/industryportfolio')
        }
        get('/api/useravatar?email=' + localStorage.getItem('email')).then((response) => {
            if (response.status === 200) {
                setAvatarSrc(response.data.data)
            } else {
                console.log('wrong')
            }
        })
      }, [])
      const id = open ? "simpe-popover" : undefined;

  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between"  style={{paddingLeft:"20%"}}>
      <Container fluid>
        <Navbar.Brand href="/">
        <img
            src="/asset/logo.png"
            width="180"
            height="120"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
        />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href={profile}>Profile</Nav.Link>
              <Nav.Link href="/notification">Notification</Nav.Link>
              {
                localStorage.getItem('role') === "3" &&
                <Nav.Link href="/createProject">Create</Nav.Link>
              }
          </Nav>
          <div className='d-flex' style={{paddingRight:"20%"}}>
            <Stack direction="row" spacing={1}>
                <Button aria-describedby={id} onClick={handleAvatarClick}>
                <Avatar src= {avatarSrc} sx={{ width: 56, height: 56 }}/>
                </Button>
            </Stack>
            <Popover
                    id={id}
                    open={open}
                    anchorEl={avatarEl}
                    onClose={handleAvatarClose}
                    anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                    }}
                >
                    <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton disableRipple sx={{cursor: "text"}}>
                        <ListItemText primary={"Username: " + username} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton disableRipple sx={{cursor: "text"}}>
                        <ListItemText primary={"Email: " + email} />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleCurrentAvatar}>
                        <ListItemText primary="Avatar"/>
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleCurrentProject}>
                        <ListItemText primary="Current Project"/>
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding onClick={handleLogout}>
                        <ListItemButton>
                        <ListItemText primary="Log out" />
                        </ListItemButton>
                    </ListItem>
                    </List>
                </Popover>
          </div>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;