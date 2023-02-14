import { useState, useEffect } from "react";

export default function Chat({socket, user, room}) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (message.length > 0 ) {
      const messageData = {
        Author: user,
        room: room,
        message: message,
        time: new Date().getHours() + ":" + new Date().getMinutes()
      }
      await socket.emit("send_message", messageData);
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <>
      <div className="chat">
        <h1>Chat</h1>
      </div>
      <div className="chat-body">
      </div>
      <div className="chat-footer">
        <input onChange={(e) => {setMessage(e.target.value)} } type="text" placeholder="Type a message" />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </>
  );
}