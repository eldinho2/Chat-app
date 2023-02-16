import Head from "next/head";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./components/_Chat";

const socket = io("https://solstice-fir-can.glitch.me");

export default function Home() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName && roomName) {
      socket.emit("join_room", roomName, userName);
    } else {
      alert("Please enter your name and room name");
    }
    setShowChat(true);
  };

  return (
    <>
      <Head>
        <title>Chat app</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showChat ? (
          <Chat socket={socket} roomName={roomName} userName={userName} />
      ) : (
        <div>
          <h1>Chat app</h1>
          <input
            type="text"
            maxLength={18}
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button onClick={joinRoom}>Join room</button>
        </div>
      )}
    </>
  );
}
