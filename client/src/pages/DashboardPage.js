import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const chatroomRef = React.createRef();

  const [chatrooms, setChatrooms] = React.useState([]);

  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  React.useEffect(() => {
    getChatrooms();
  }, []);

  const createChatRoom = () => {
    const chatRoom = chatroomRef.current.value;
    console.log(chatRoom);
    axios
      .post(
        "http://localhost:8000/chatroom",
        {
          name: chatRoom,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((response) => {
        makeToast("success", response.data.message);
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="ChatterBox"
            ref={chatroomRef}
          />
        </div>
      </div>
      <button onClick={createChatRoom}>Create Chatroom</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
