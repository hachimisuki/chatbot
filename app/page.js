"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { ChatInput } from "../components/ChatInput";
import ChatArea from "../components/ChatArea";
import { getFromStorage } from "../lib/storage";

export default function Home() {
  const [messages, setMessages] = useState([]); // 存储聊天记录
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [streamingContent, setStreamingContent] = useState(""); // 流式输出的内容
  const chatAreaRef = useRef(null); // 用于滚动到最新消息

  // 滚动到最新消息
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // 处理用户发送消息
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // 添加用户消息到聊天记录
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 从 localStorage 获取 Base URL 和 API Key
      const baseUrl =
        getFromStorage("baseUrl") || "https://api.chatanywhere.org";
      const apiKey =
        getFromStorage("apiKey") ||
        "sk-8pKbA2cKOoGbRjseIoahqJfNqhLI3tchR0r2cEQ3z7q180EE";

      if (!apiKey) {
        throw new Error("API Key is not set. Please configure it in settings.");
      }

      // 使用 fetch 发送请求，支持流式响应
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...messages, userMessage],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let resultContent = "";
      let isDone = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (!isDone) {
            // 只有在未处理 [DONE] 时才添加消息
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: resultContent },
            ]);
            setStreamingContent("");
            setIsLoading(false);
          }
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6); // 去掉 "data: " 前缀
            if (data === "[DONE]") {
              setMessages((prev) => [
                ...prev,
                { role: "assistant", content: resultContent },
              ]);
              setStreamingContent("");
              setIsLoading(false);
              isDone = true;
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const content =
                parsed.choices &&
                parsed.choices.length > 0 &&
                parsed.choices[0].delta &&
                typeof parsed.choices[0].delta.content === "string"
                  ? parsed.choices[0].delta.content
                  : "";
              if (content) {
                resultContent += content;
                setStreamingContent(resultContent); // 更新流式内容
              }
            } catch (e) {
              console.error("Failed to parse streaming data:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}` },
      ]);
      setStreamingContent("");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <Header />
      <ChatArea
        messages={messages}
        streamingContent={streamingContent}
        ref={chatAreaRef}
      />
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
