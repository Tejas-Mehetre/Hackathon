import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const response = await fetch("https://your-backend-api.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      const botMessage = { text: data.response, sender: "bot" };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setLoading(false);
    setInput("");
  };

  // Save conversation history when user starts a new chat
  const handleNewChat = () => {
    if (messages.length > 0) {
      setHistory((prev) => [
        ...prev,
        { id: Date.now(), messages: messages.slice() },
      ]);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Chat History */}
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chat History</h2>
        <button
          className="w-full bg-blue-500 text-white py-2 mb-4 rounded"
          onClick={handleNewChat}
        >
          + New Chat
        </button>
        <div className="space-y-2">
          {history.map((session, index) => (
            <div
              key={session.id}
              className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
              onClick={() => setMessages(session.messages)}
            >
              Chat {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="w-3/4 flex flex-col justify-between h-full p-4 bg-white shadow-lg">
        {/* Chat Display */}
        <div className="flex-1 overflow-y-auto p-4 border rounded bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 my-2 rounded-lg max-w-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-300 text-black"
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
          <button
            className="ml-2 p-3 bg-blue-500 text-white rounded"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
