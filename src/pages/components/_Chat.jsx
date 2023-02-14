import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat({ socket, userName, roomName }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [room, setRoom] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [expandedMessageIndex, setexpandedMessageIndex] = useState(null);

  const sendMessage = async () => {
    if (message.length > 0) {
      const messageData = {
        Author: userName,
        room: roomName,
        message: message,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList([...messageList, messageData]);
      setMessage("");
      console.log(messageList);
    }
  };

  const toggleExpanded = (i) => {
    if (expandedMessageIndex === i) {
      setexpandedMessageIndex(null);
    } else {
      setexpandedMessageIndex(i);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  }, [socket, messageList]);

  return (
    <>
      <div className="chat-window">
        <h1 className="chat-title">Chat</h1>
        <ScrollToBottom className="message-list">
          {messageList.map((val, i) => {
            return (
              <div
                key={val.time}
                id={userName === val.Author ? "you" : "other"}
                className={
                  userName === val.Author
                    ? "message-body-you"
                    : "message-body-other"
                }
              >
                {val.message.length > 250 ? (
                  <>
                    <div className="message-content">
                      <p>
                        {expandedMessageIndex === i
                          ? val.message
                          : val.message.substr(0, 250) + "..."}
                        {val.message.length > 250 && (
                          <span
                            className="read-more"
                            onClick={() => toggleExpanded(i)}
                          >
                            {expandedMessageIndex === i
                              ? " mostrar menos"
                              : " ler mais..."}
                          </span>
                        )}
                      </p>
                    </div>
                    {expanded && (
                      <div className="message-content">
                        <p>{val.message.substr(250)}</p>
                        <span
                          className="read-more"
                          onClick={() => setExpanded(!expanded)}
                        >
                          {expanded ? " mostrar menos" : ""}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="message-content">
                    <p>{val.message}</p>
                  </div>
                )}

                <div className="message-info">
                  <p className="message-time">{val.time}</p>
                  <p className="message-author">{val.Author}</p>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
        <div className="chat-footer">
          <input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              e.key === "Enter" && sendMessage();
            }}
            value={message}
            type="text"
            placeholder="Type a message"
            className="message-input"
          />
          <button onClick={sendMessage} className="submit-btn">
            &#9658;
          </button>
        </div>
      </div>
    </>
  );
}
