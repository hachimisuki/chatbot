import React, { useState, useEffect, forwardRef } from "react";
import dynamic from "next/dynamic";
const DynamicReactRenderer = dynamic(() => import("./DynamicReactRenderer"), {
  ssr: false,
});
const ChatArea = forwardRef(
  ({ messages, streamingContent, className }, ref) => {
    const [renderedComponent, setRenderedComponent] = useState(null);

    // 检测消息是否包含 React 代码并尝试渲染
    useEffect(() => {
      if (streamingContent && streamingContent.includes("import React")) {
        setRenderedComponent(streamingContent);
      } else if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (
          lastMessage.role === "assistant" &&
          lastMessage.content.includes("import React")
        ) {
          setRenderedComponent(lastMessage.content);
        }
      }
    }, [messages, streamingContent]);

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
          </div>
        ))}
        {streamingContent && (
          <div className="mb-4 p-3 rounded-lg bg-gray-200 text-gray-900 mr-auto max-w-[70%]">
            <strong>Assistant:</strong>
            <div className="whitespace-pre-wrap">{streamingContent}</div>
          </div>
        )}
        {renderedComponent && (
          <div className="mt-4 p-3 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-2">
              Rendered React Component
            </h3>
            <DynamicReactRenderer code={renderedComponent} />
          </div>
        )}
      </div>
    );
  }
);

ChatArea.displayName = "ChatArea";
export default ChatArea;
