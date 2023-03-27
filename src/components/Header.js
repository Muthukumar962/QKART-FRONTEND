import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Link , useHistory } from 'react-router-dom';
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  // console.log("hiden", hasHiddenAuthButtons);
  const uname = localStorage.getItem("username");
  const history = useHistory();
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}

      {hasHiddenAuthButtons ? (
        <>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>{history.push("/")}}
        >
          Back to explore
        </Button></>
      ) : (<div>
          { uname != null ? (
            
            <Stack direction="row">
            <img src="avatar.png" alt={uname}/>
                <h5>{uname}</h5>
              <Button variant="text" onClick={()=>{
                localStorage.clear();
                window.location.reload()}}>
                LOGOUT
              </Button>
            </Stack>
          
          ) : (
            // <Button
            //   className="explore-button"
            //   startIcon={<ArrowBackIcon />}
            //   variant="text"
            //   href="/"
            // >
            //   Back to explore
            // </Button>
            <Stack spacing={2} direction="row">
                <Button variant="text" name = "login" onClick={()=>{history.push("/login")}}>
                LOGIN
              </Button>
              <Button variant="contained" name="register" onClick={()=>{history.push("/register")}}>
                REGISTER
              </Button>
          </Stack>
          )}
      </div>)}
    </Box>
  );
};


export default Header;
