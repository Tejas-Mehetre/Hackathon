import React, { useEffect, useState } from "react";
import ChatHistory from "./chatHistory";
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
      const response = await axios.post("http://localhost:3000/model/getmodelResponse", { question: input });

      // Extract only employee names from response
      const employees = response.data?.allFilteredData?.response?.response?.map(emp => emp.EmployeeName) || [];
      const botMessageText = employees.length ? employees.join(", ") : "No employees found.";

      const botMessage = { text: botMessageText, sender: "bot" };

      setMessages((prev) => [...prev, botMessage]);
      saveChatHistory(userMessage, botMessage);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { text: "Error fetching response.", sender: "bot" }]);
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
    if (messages.length > 0) {
      const firstMessage = messages.find((msg) => msg.sender === "user")?.text || "Untitled Chat";
      const newChat = { id: Date.now(), title: firstMessage.slice(0, 20), messages: [...messages] };

      setHistory((prev) => [...prev, newChat]);
      setMessages([]);
      setCurrentChatId(null);
    }
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Chat History */}
      <ChatHistory history={history} loadChat={loadChat} handleNewChat={handleNewChat} deleteChat={deleteChat} />

      {/* Main Chat Section */}
      <div className="w-3/4 flex flex-col justify-between h-full p-4 bg-white shadow-lg">
        {/* Chat Display */}
        <div className="flex-1 overflow-y-auto p-4 border rounded bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg max-w-lg ${
                msg.sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <p className="text-gray-500">Typing...</p>}
        </div>

        {/* Input Area */}
        <div className="flex mt-2">
          <input
            type="text"
            className="flex-1 p-3 border rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something..."
          />
          <button className="ml-2 p-3 bg-blue-500 text-white rounded" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
