import { useState } from "react";
import ChatMessages from "./ChatMessages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postChat } from "../api/chat";
import { fetchDevMessages, insertDevMessages } from "../api/messages";

export default function ChatRoom({ roomID }) {
  const qc = useQueryClient();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { data: dev_messages = [], isLoading } = useQuery({
    queryKey: ["dev_messages"],
    queryFn: fetchDevMessages,
    enabled: roomID == 2, // dev 방일 때만 가져오기
  });

  const insertMutation = useMutation({
    mutationFn: insertDevMessages,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dev_messages"] }); // 목록 갱신
    },
  });

  const chatMutation = useMutation({
    mutationFn: postChat,
    onSuccess: (data, variables) => {
      const id = variables.id;
      const text = data?.text ?? "";
      if (!text) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id == id ? { ...m, role: false, content: text, status: "done" } : m,
        ),
      );
    },
    onError: (err, variables) => {
      const id = variables.id;

      setMessages((prev) =>
        prev.map((m) =>
          m.id == id
            ? {
                ...m,
                role: false,
                content: "다시 시도해주세요. 죄송합니다.",
                status: "error",
              }
            : m,
        ),
      );
    },
  });

  const onSubmitAction = (e) => {
    e.preventDefault();

    setMessages((prev) => [...prev, { role: true, content: message }]);

    console.log(roomID);

    if (roomID == 4) {
      const id = crypto.randomUUID();

      console.log(id);

      setMessages((prev) => [
        ...prev,
        {
          id: id,
          role: false,
          content: "",
          status: "pending",
        },
      ]);

      chatMutation.mutate({ message: message, id: id });
    }
    if (roomID == 2) {
      insertMutation.mutate({
        role: false,
        content: message,
        status: "done",
      });
      return;
    }

    setMessage("");
  };

  return (
    <>
      <div className="chatPanelHeader">
        <span className="chatRoomName">{roomID}</span>
      </div>

      {roomID == 2 ? (
        <ChatMessages messages={dev_messages} />
      ) : (
        <ChatMessages messages={messages} />
      )}

      <form className="chatInputBar" onSubmit={onSubmitAction}>
        <input
          className="chatInput"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button className="sendBtn" type="submit">
          Send
        </button>
      </form>
    </>
  );
}
