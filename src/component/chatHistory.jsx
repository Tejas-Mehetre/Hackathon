import React from "react";
import { Trash2 } from "lucide-react";

const ChatHistory = ({ history, loadChat, handleNewChat, deleteChat }) => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-6 border-r border-gray-700 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-blue-400">Chat History</h2>
      <button
        className="w-full bg-blue-500 text-white py-2 mb-4 rounded-lg shadow-md hover:bg-blue-600"
        onClick={handleNewChat}
      >
        + New Chat
      </button>
      <div className="space-y-2">
        {history.map((session) => (
          <div
            key={session.id}
            className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer transition-all hover:bg-gray-600 hover:shadow-md"
            onClick={() => loadChat(session.id)}
          >
            <div className="flex-1 text-gray-300">{session.title}</div>
            <button onClick={() => deleteChat(session.id)} className="ml-2 text-red-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
