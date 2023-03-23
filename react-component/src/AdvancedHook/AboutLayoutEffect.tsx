import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./index.css";

function MessagesDisplay({ messages }: { messages: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect(() => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTop = containerRef.current.scrollHeight;
  //   }
  // });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });

  return (
    <div ref={containerRef} role="log">
      {messages.map((message: any, index: number, array: any[]) => (
        <div key={message.id}>
          <strong>{message.author}</strong>: <span>{message.content}</span>
          {array.length - 1 === index ? null : <hr />}
        </div>
      ))}
    </div>
  );
}

// this is to simulate major computation/big rendering tree/etc.
function sleep(time = 0) {
  const wakeUpTime = Date.now() + time;
  while (Date.now() < wakeUpTime) {}
}

function SlowSibling() {
  useEffect(() => {
    sleep(2000);
  });

  return (
    <img
      src="https://mblogthumb-phinf.pstatic.net/MjAyMDA1MTlfMTA4/MDAxNTg5ODQ5NzEyODYx.f5MqH8d5xhGKvH4UOR0KO5SnjKLOj4KqyJa_pg9BCXgg.4f2dGTrOj8xJaFqRfy6-REO62B6p_pb0rqeEi0n8-9kg.PNG.yogoho210/%EC%BA%A1%EC%B2%9822.PNG?type=w800"
      style={{ width: "300px", height: "300px", marginTop: "100px" }}
    />
  );
}

function AboutLayoutEffect() {
  const [messages, setMessages] = useState(allMessages.slice(0, 8));

  const addMessage = () =>
    messages.length < allMessages.length
      ? setMessages(allMessages.slice(0, messages.length + 1))
      : null;
  const removeMessage = () =>
    messages.length > 0
      ? setMessages(allMessages.slice(0, messages.length - 1))
      : null;

  return (
    <div className="messaging-app">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={addMessage}>메시지 추가하기</button>
        <button onClick={removeMessage}>메시지 삭제하기</button>
      </div>
      <hr />
      <MessagesDisplay messages={messages} />
      <SlowSibling />
    </div>
  );
}

export default AboutLayoutEffect;

const allMessages = [
  `Leia: Aren't you a little short to be a stormtrooper?`,
  `Luke: What? Oh... the uniform. I'm Luke Skywalker. I'm here to rescue you.`,
  `Leia: You're who?`,
  `Luke: I'm here to rescue you. I've got your R2 unit. I'm here with Ben Kenobi.`,
  `Leia: Ben Kenobi is here! Where is he?`,
  `Luke: Come on!`,
  `Luke: Will you forget it? I already tried it. It's magnetically sealed!`,
  `Leia: Put that thing away! You're going to get us all killed.`,
  `Han: Absolutely, Your Worship. Look, I had everything under control until you led us down here. You know, it's not going to take them long to figure out what happened to us.`,
  `Leia: It could be worse...`,
  `Han: It's worse.`,
  `Luke: There's something alive in here!`,
  `Han: That's your imagination.`,
  `Luke: Something just moves past my leg! Look! Did you see that?`,
  `Han: What?`,
  `Luke: Help!`,
  `Han: Luke! Luke! Luke!`,
  `Leia: Luke!`,
  `Leia: Luke, Luke, grab a hold of this.`,
  `Luke: Blast it, will you! My gun's jammed.`,
  `Han: Where?`,
  `Luke: Anywhere! Oh!!`,
  `Han: Luke! Luke!`,
  `Leia: Grab him!`,
  `Leia: What happened?`,
  `Luke: I don't know, it just let go of me and disappeared...`,
  `Han: I've got a very bad feeling about this.`,
  `Luke: The walls are moving!`,
  `Leia: Don't just stand there. Try to brace it with something.`,
  `Luke: Wait a minute!`,
  `Luke: Threepio! Come in Threepio! Threepio! Where could he be?`,
].map((m, i) => ({
  id: i,
  author: m.split(": ")[0],
  content: m.split(": ")[1],
}));
