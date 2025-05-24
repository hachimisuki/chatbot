import React from "react";
import { ConfigModal } from "./ConfigModal";

export function Header({
  selectedModel,
  apiKey,
  baseUrl,
  changeUrl,
  changeModel,
  changeApiKey,
}) {
  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">ChatBot</h1>
      </div>

      <div className="flex items-center gap-2">
        <ConfigModal
          selectedModel={selectedModel}
          apiKey={apiKey}
          baseUrl={baseUrl}
          changeUrl={changeUrl}
          changeModel={changeModel}
          changeApiKey={changeApiKey}
        />
      </div>
    </header>
  );
}
