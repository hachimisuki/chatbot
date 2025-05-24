import React, { useState, useEffect, forwardRef } from "react";
import dynamic from "next/dynamic";
const DynamicReactRenderer = dynamic(() => import("./DynamicReactRenderer"), {
  ssr: false,
});
const ChatArea = forwardRef(
  ({ messages, streamingContent, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-100 text-blue-900 ml-auto"
                : "bg-gray-200 text-gray-900 mr-auto"
            } max-w-[70%]`}
          >
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>
            <div className="whitespace-pre-wrap">{msg.content}</div>
            <DynamicReactRenderer code={msg.content} />
          </div>
        ))}
        {/* 显示流式内容 */}
        {streamingContent && (
          <div className="mb-4 p-3 rounded-lg bg-gray-200 text-gray-900 mr-auto max-w-[70%]">
            <strong>Assistant:</strong>
            <div className="whitespace-pre-wrap">{streamingContent}</div>
          </div>
        )}
        {/* {reactResponse && <DynamicReactRenderer code={reactResponse} />} */}
      </div>
    );
  }
);

ChatArea.displayName = "ChatArea";
export default ChatArea;
