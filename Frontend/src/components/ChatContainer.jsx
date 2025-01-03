import React, { useState, useEffect, useRef } from "react";
import Logout from "./Logout";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // Fetch messages when currentChat or currentUser changes
  useEffect(() => {
    if (currentUser && currentChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          console.log("Fetched messages:", response.data); 
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    } else {
      console.log("currentUser or currentChat is undefined");
    }
  }, [currentChat, currentUser]);

  // Listen for incoming messages from the socket
  useEffect(() => {
    const socketInstance = socket.current;
    if (socketInstance) {
      socketInstance.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.off("msg-recieve");
      }
    };
  }, [socket]);

  const handleSendMsg = async (msg) => {
    if (currentUser && currentChat) {
      try {
        await axios.post(sendMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
          message: msg,
        });
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: currentUser._id,
          message: msg,
        });

        const newMessages = [...messages, { fromSelf: true, message: msg }];
        setMessages(newMessages); 
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentUser || !currentChat) {
    return (
      <div>
        <p>Please log in and select a chat to start messaging.</p>
      </div>
    );
  }

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={message._id || uuidv4()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
          font-size: 1.2rem; /* Adjust size as needed */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis; /* Ensure long usernames are truncated */
          
          @media screen and (max-width: 720px) {
            font-size: 1rem; /* Adjust for mobile screens */
          }
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }

    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
