import React, {useState, useEffect, useRef}from "react";
import Contacts from "../components/Contacts";
import { allUsersRoute, host } from "../utils/APIRoutes";
import styled from "styled-components";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {io} from "socket.io-client";
export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate(); 
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(()=>{
      const fetchUserData = async () => {
        const userData = localStorage.getItem("chat-app-user");
        if(!userData){  
        navigate("/login");
          } else {
            setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
            setIsLoaded(true);
          } 
        };
        fetchUserData();
        return () => {
          setCurrentUser(undefined);
          setContacts([]);
        };
    }, [navigate]);
   
    useEffect(()=>{
      if(currentUser){
        socket.current = io(host);
        socket.current.emit("add-user", currentUser._id);
      }
    },[currentUser])

    useEffect(() => {
      const fetchContacts = async () => {
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data);
          } else {
            navigate("/setAvatar");
          }
        }
      };
  
      fetchContacts();
    }, [currentUser, navigate]);  
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat = {handleChatChange}/>
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser}/>
        ) : (

        <ChatContainer currentChat = {currentChat} currentUser={currentUser} socket={socket}/>
        )}
      </div>
    </Container>
  )

}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    gap: 0rem;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    @media screen and (max-width: 720px) {
      grid-template-columns: 100%;
      width: 100%;
      height: 90vh;
      padding: 1rem;
      gap: 0.5rem;
    }
  }
`;
