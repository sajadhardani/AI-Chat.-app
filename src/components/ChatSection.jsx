"use client";
import { useState, useEffect, Suspense } from "react";
import { ArrowUpCircle } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/utils/config";
import { message, Skeleton, Spin } from "antd";
import { useAuth } from "@/context/AuthContext";
import { useLayout } from "@/context/LayoutContext";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

export const  ChatSection = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [input, setInput] = useState("");
  const [loadMessages, setLoadMessages] = useState(false);
  const [loadBotResponse, setLoadBotResponse] = useState(false);
  const { user, token } = useAuth();
  const { setConversationsList } = useLayout();
  const router = useRouter();

  // console.log(chatId, "is chatId");

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    setLoadBotResponse(true);
    if (chatId) {
      axios
        .post(
          `${BASE_URL}/chat/${chatId}/message`,
          {
            conv_id: parseInt(chatId),
            sender: "USER",
            content: input,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setMessages(res.data.messages);
          setLoadBotResponse(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadBotResponse(false);
        });
    } else {
      axios
        .post(
          `${BASE_URL}/chat`,
          {
            user_id: parseInt(user.id),
            content: input,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          console.log(res);
          // setMessages(res.data.messages);
          setConversationsList(res.data.conversations);
          router.push(`/chat/${res.data.conversations[0].id}`);
          setLoadBotResponse(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadBotResponse(false);
        });
    }

    setInput("");
  };

  useEffect(() => {
    if (chatId && loadMessages === false && messages.length === 0) {
      // console.log("Fetch Messages")
      setLoadMessages(true);
      axios
        .get(`${BASE_URL}/chat/${chatId}`)
        .then(
          (res) => {
            console.log(res);
            setMessages(res.data.messages);
            setLoadMessages(false);
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .catch((err) => {
          if (err.response.data.error === "CONVERSATION_NOT_FOUND") {
            messageApi.error(err.response.data.message);
          }
          setLoadMessages(false);
          // console.log(err.response.data.error);
        });
    }
  });

  const isPersian = (text) => {
    // این تابع بررسی می‌کند که آیا متن حاوی کاراکترهای فارسی است یا خیر
    return /[\u0600-\u06FF]/.test(text);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-screen">
      {contextHolder}
      <Suspense fallback={<Spin spinning={loadMessages} />}>
        <div className="flex-1 overflow-y-auto p-4">
          <Skeleton loading={loadBotResponse} active>
            {messages.map((message, index) => {
              const formatContent = (content) => {
                return `${
                  message.sender === "USER"
                    ? `**${new Date(
                        message.created
                      ).toLocaleTimeString()}** \n****\n`
                    : message.content.includes("**")
                    ? `**${new Date(message.created).toLocaleTimeString()}**\n`
                    : `**${new Date(
                        message.created
                      ).toLocaleTimeString()}** \n****\n`
                }${content}`;
              };
              // console.log(message);
              return (
                <div
                  key={index}
                  className={`${
                    message.sender === "BOT" ? "bg-green-100" : "bg-white"
                  } rounded-lg p-3 shadow-md mb-3 w-fit max-w-xs`}
                  style={{
                    alignSelf: "flex-end",
                    whiteSpace: "pre-wrap",
                    direction: isPersian(message.content) ? "rtl" : "ltr",
                    marginRight: message.sender === "BOT" ? "auto" : "",
                  }}
                >
                  <ReactMarkdown
                    components={{
                      br: ({ node }) => <br />,
                    }}
                  >
                    {formatContent(message.content)}
                  </ReactMarkdown>
                </div>
              );
            })}
          </Skeleton>
        </div>
      </Suspense>

      <div className="border-t border-gray-300 bg-gray-100 px-4 py-3">
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید"
            className="flex-1 px-4 py-3 rounded-full border-none bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12 chat-input text-right"
            style={{ direction: isPersian(input) ? "rtl" : "ltr" }}
          />
          <button
            onClick={loadBotResponse ? () => {} : handleSendMessage}
            className="absolute left-2 bg-black text-white p-2 rounded-full hover:bg-blue-700 transition"
            disabled={loadBotResponse}
          >
            <ArrowUpCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
