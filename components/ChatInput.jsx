import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Trash2 } from "lucide-react";

export function ChatInput({ onSend, onClear, disabled }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-[55%] mx-auto px-6 py-6">
      <div className="relative flex bg-[f3f4f6] items-center gap-3 border border-input rounded-xl shadow-sm p-3 focus-within:ring-1 focus-within:ring-slate-400 focus-within:ring-offset-1">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="给 ChatBot 发送消息..."
          className="flex-1 resize-none border-none focus-visible:outline-none text-base text-foreground placeholder-muted-foreground pr-24 min-h-[80px] max-h-[120px] overflow-y-auto bg-[f3f4f6]"
          rows={1}
          disabled={disabled}
        />

        <div className="absolute right-4 flex space-x-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onClear}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
            aria-label="清空聊天记录"
            title="清空聊天记录"
          >
            <Trash2 className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={handleSend}
            disabled={disabled || !inputValue.trim()}
            className="text-muted-foreground hover:text-foreground"
            aria-label="发送消息"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
