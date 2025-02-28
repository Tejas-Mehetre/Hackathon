import React from "react";
import { Trash2 } from "lucide-react";

const ChatHistory = ({ history, loadChat, handleNewChat, deleteChat }) => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Chat History</h2>
      <button
        className="w-full bg-blue-500 text-white py-2 mb-4 rounded"
        onClick={handleNewChat}
      >
        + New Chat
      </button>
      <div className="space-y-2">
        {history.map((session) => (
          <div
            key={session.id}
            className="p-2 bg-gray-700 rounded flex justify-between items-center cursor-pointer hover:bg-gray-600"
            onClick={() => loadChat(session.id)} // ✅ Correct way to load chat
          >
            <div className="flex-1">{session.title}</div>
            <button onClick={() => deleteChat(session.id)} className="ml-2 text-red-400 hover:text-red-600">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
