"use client";
import { Analytics } from "@vercel/analytics/next";
import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { ChatInput } from "../components/ChatInput";
import ChatArea from "../components/ChatArea";
import { getFromStorage, saveToStorage } from "../lib/storage";

export default function Home() {
  const [messages, setMessages] = useState([]); // 存储聊天记录
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [streamingContent, setStreamingContent] = useState(""); // 流式输出的内容
  const chatAreaRef = useRef(null); // 用于滚动到最新消息

  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // 从localStorage加载聊天记录 和 配置项
  useEffect(() => {
    const savedMessages = getFromStorage("chatMessages");
    if (savedMessages && Array.isArray(savedMessages)) {
      setMessages(savedMessages);
    }

    const savedBaseUrl = localStorage.getItem("baseUrl");
    const savedApiKey = localStorage.getItem("apiKey");
    const savedSelectedModel = localStorage.getItem("selectedModel");

    if (savedBaseUrl) {
      setBaseUrl(savedBaseUrl);
    }
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    if (savedSelectedModel) {
      setSelectedModel(savedSelectedModel);
    }
  }, []);

  // 当消息更新时，保存到localStorage
  useEffect(() => {
    if (messages.length > 0) {
      saveToStorage("chatMessages", messages);
    }
  }, [messages]);

  // 滚动到最新消息
  useEffect(() => {
    if (chatAreaRef.current) {
      setTimeout(() => {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }, 500);
    }
  }, [messages, streamingContent]);

  // 处理用户发送消息
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // 添加用户消息到聊天记录
    const userMessage = {
      role: "user",
      content: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!baseUrl) {
        throw new Error("Base URL 未设置，请点击配置按钮进行设置。");
      }

      if (!apiKey) {
        throw new Error("API Key 未设置，请点击配置按钮进行设置。");
      }
      if (!selectedModel) {
        throw new Error("模型未设置，请点击配置按钮进行设置。");
      }

      // 使用 fetch 发送请求，支持流式响应
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...messages, userMessage].slice(-5),
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
            const assistantMessage = {
              role: "assistant",
              content: resultContent,
              timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
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
              const assistantMessage = {
                role: "assistant",
                content: resultContent,
                timestamp: Date.now(),
              };

              setMessages((prev) => [...prev, assistantMessage]);
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
        {
          role: "assistant",
          content: `Error: ${error.message}`,
          timestamp: Date.now(),
        },
      ]);
      setStreamingContent("");
      setIsLoading(false);
    }
  };

  // 清除聊天记录
  const clearMessages = () => {
    setMessages([]);
    saveToStorage("chatMessages", []);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <Analytics></Analytics>

      <Header
        baseUrl={baseUrl}
        apiKey={apiKey}
        selectedModel={selectedModel}
        changeUrl={(url) => {
          setBaseUrl(url);
        }}
        changeModel={(model) => {
          setSelectedModel(model);
        }}
        changeApiKey={(key) => {
          setApiKey(key);
        }}
      />
      <ChatArea
        messages={messages}
        streamingContent={streamingContent}
        ref={chatAreaRef}
      />
      <ChatInput
        onSend={handleSendMessage}
        onClear={clearMessages}
        disabled={isLoading}
      />
    </div>
  );
}
