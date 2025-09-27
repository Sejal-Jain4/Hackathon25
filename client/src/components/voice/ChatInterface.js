import React from 'react';

const ChatBubble = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`px-4 py-2 rounded-lg max-w-xs sm:max-w-md break-words ${
          isUser 
            ? 'bg-primary-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p>{message}</p>
      </div>
    </div>
  );
};

const ChatInterface = ({ messages }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-center">
            No conversation yet. Start talking to Centsi by clicking the microphone button!
          </p>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))
      )}
    </div>
  );
};

export default ChatInterface;