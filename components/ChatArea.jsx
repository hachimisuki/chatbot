"use client";
import React, { useState, useEffect, forwardRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
const DynamicReactRenderer = dynamic(() => import("./DynamicReactRenderer"), {
  ssr: false,
});
const ChatArea = forwardRef(({ messages, streamingContent }, ref) => {
  const dynamicClass = messages.length > 0 ? "flex-1" : "h-[35%]";
  return (
    <div
      ref={ref}
      className={`relative overflow-y-auto  bg-gray-50 w-[55%] mx-auto [scrollbar-width:none] [-ms-overflow-style:none] ${dynamicClass}`}
    >
      {messages.length === 0 ? (
        <div>
          <div className="  absolute bottom-4 text-center w-full text-2xl flex items-center justify-center gap-4">
            <motion.div
              animate={{
                rotate: 720,
                transition: { duration: 2, ease: "linear" },
              }}
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.3 },
              }}
              whileTap={{
                scale: 0.5,
                transition: { duration: 0.15, ease: "easeOut" },
              }}
            >
              <motion.img
                src="/chatgpt-logo.png"
                alt="ChatBot"
                className="w-16 h-16 "
              />
            </motion.div>
            <div>我是 ChatBot，很高兴见到你！</div>
          </div>
        </div>
      ) : null}
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
});

ChatArea.displayName = "ChatArea";
export default ChatArea;
