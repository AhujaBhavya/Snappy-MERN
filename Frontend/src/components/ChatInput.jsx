import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prev) => prev + emojiObject.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.trim().length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420 
  padding: 0.2rem;
  padding-bottom: 0.3rem;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0.1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 0rem;

    .emoji {
      position: relative;
      svg {
        font-size: 2rem;
        color: #ffff00c8;
        cursor: pointer;
        margin-left: 0.7rem;
      }

      .emoji-picker-container {
        position: absolute;
        bottom: 4rem;
        left: 0;
        z-index: 9999;
        border: 1px solid #9a86f3;
        border-radius: 1rem; 
        box-shadow: 0 5px 10px rgba(154, 134, 243, 0.3);
        padding: 0.5rem;
      }

      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420 !Important ;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          width: 5px;
        }
        .emoji-scroll-wrapper::-webkit-scrollbar-thumb {
          background-color: #9a86f3;
        }
        .emoji-categories button {
          filter: contrast(0);
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    width: 95%;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
       @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: 10% 90%;
    padding: 0.2rem;

    .button-container {
      gap: 0.5rem;

      .emoji {
        svg {
          font-size: 1.5rem;
          margin-left: 0.7rem
        }
        .emoji-picker-container {
          bottom: 3rem;
          left: -2rem;
          width: 250px; 
        }
      }
    }
    .input-container {
      gap: 1rem;
      
      input {
        font-size: 1rem;
      }

      button {
        padding: 0.3rem .5rem;
        svg {
          font-size: 1.5rem;
        }
      }
    }
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: 15% 85%;
    padding: 0.1rem;

    .button-container {
      gap: 0.5rem;

      .emoji {
        svg {
          font-size: 2rem;
        }

        .emoji-picker-container {
          bottom: 3rem;
          left: -2rem;
          width: 220px;
        }
      }
    }

    .input-container {
      gap: 0.8rem;

      input {
        font-size: 0.9rem;
      }
      button {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1.5rem;
        }
      }
    }
  }
`;

