import React, { useEffect, useState } from "react";
import ChatHistory from "./ChatHistory";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/model/getmodelResponse", { query: input });
      const data = response.data;
      const employees = data.allFilteredData.response.response.map(emp => emp.EmployeeName);
      const botMessage = { text: employees, sender: "bot" };

      setMessages((prev) => [...prev, botMessage]);
      saveChatHistory(userMessage, botMessage);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setLoading(false);
    setInput("");
  };

  const saveChatHistory = (userMessage, botMessage) => {
    let updatedHistory = [...history];

    if (currentChatId) {
      updatedHistory = updatedHistory.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, userMessage, botMessage] }
          : chat
      );
    } else {
      const newChat = {
        id: Date.now(),
        title: userMessage.text.slice(0, 20),
        messages: [userMessage, botMessage],
      };
      updatedHistory.push(newChat);
      setCurrentChatId(newChat.id);
    }

    setHistory(updatedHistory);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const deleteChat = (id) => {
    setHistory((prev) => prev.filter((chat) => chat.id !== id));
  };

  const loadChat = (id) => {
    const selectedChat = history.find((chat) => chat.id === id);
    setMessages(selectedChat?.messages || []);
    setCurrentChatId(id);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <ChatHistory history={history} loadChat={loadChat} handleNewChat={handleNewChat} deleteChat={deleteChat} />

      <div className="w-3/4 flex flex-col justify-between h-full p-6 bg-gray-800 shadow-lg rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 border rounded bg-gray-700 shadow-inner">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-xl max-w-lg text-sm font-medium shadow-md ${
                msg.sender === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-600 text-gray-200"
              }`}
            >
              {Array.isArray(msg.text) ? (
                <ul className="list-disc pl-5">
                  {msg.text.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              ) : (
                msg.text
              )}
            </div>
          ))}
          {loading && <p className="text-gray-400">Typing...</p>}
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
          />
          <button className="ml-3 p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
