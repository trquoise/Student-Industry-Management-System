import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import StyleIcon from '@mui/icons-material/Style';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function CustomizedMenus({data, onUpdate}) {
  const role = window.localStorage.getItem('role')
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [sortList, setSortList] = React.useState([]);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
//   console.log("this is props",list.data)

 const timeSort = () =>{
    const newArray = [...data]
    const sortedArray = newArray.sort((a, b) => new Date(a.apply_time) - new Date(b.apply_time))
    // console.log("new array sorted array", sortedArray);
    // setSortList(sortedArray)
    onUpdate(sortedArray)

 }

 const timeReverseSort = () =>{
    const newArray = [...data]
    const sortedArray = newArray.sort((a, b) => new Date(b.apply_time) - new Date(a.apply_time))
    // console.log("new array", sortedArray)
    // setSortList(sortedArray)
    onUpdate(sortedArray)  
 }

 const tagSort = () =>{
  const newArray = [...data]
  const sortedArray = newArray.sort((a, b) => a.tag_score - b.tag_score)
  // console.log("new array sorted array", sortedArray);
  // setSortList(sortedArray)
  onUpdate(sortedArray)

}

const tagReverseSort = () =>{
  const newArray = [...data]
  const sortedArray = newArray.sort((a, b) => b.tag_score - a.tag_score)
  // console.log("new array sorted array", sortedArray);
  // setSortList(sortedArray)
  onUpdate(sortedArray)

}
 

  React.useEffect(()=>{
    // timeReverse(list.data);
  },[])
  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        sorting
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={()=>{handleClose(); timeSort()}} disableRipple>
          <SortIcon />
          Time order
        </MenuItem>
       <MenuItem onClick={()=>{handleClose(); timeReverseSort()}} disableRipple>
          <SortIcon />
          Time Reverse Order
        </MenuItem>
{ role == 3?
          <MenuItem onClick={()=>{handleClose(); tagSort()}} disableRipple>
          <StyleIcon />
          By tags order
        </MenuItem>:' '}
{role == 3?        <MenuItem onClick={()=>{handleClose(); tagReverseSort()}} disableRipple>
          <StyleIcon />
          By tags descedend order
        </MenuItem>: ' '}

      </StyledMenu>
    </div>
  );
}
