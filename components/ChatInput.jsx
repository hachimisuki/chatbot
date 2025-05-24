import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ChatInput({ onSend, disabled }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSend();
    }
  };

  return (
    <div className="w-[55%] mx-auto px-4 py-6 ">
      <div className="relative flex  bg-[f3f4f6] items-center gap-3  border border-input rounded-xl shadow-sm p-3 focus-within:ring-1 focus-within:ring-slate-400 focus-within:ring-offset-1 ">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="给 ChatBot 发送消息..."
          className="flex-1 resize-none border-none focus-visible:outline-none text-base text-foreground placeholder-muted-foreground pr-12 min-h-[80px] max-h-[120px] overflow-y-auto bg-[f3f4f6]"
          rows={1}
          disabled={disabled}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          className="absolute right-4 text-muted-foreground hover:text-foreground"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
