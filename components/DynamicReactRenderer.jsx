"use client";
import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { extractAndProcessJSX } from "@/lib/utils";
export default function DynamicReactRenderer({ code }) {
  // 提取有效的组件代码
  const validCode = extractAndProcessJSX(code);
  if (!validCode) return null;
  //   const testcode = `<strong>Hello World!</strong>
  // `;
  // console.log("Valid Code:", validCode);

  return (
    <div className="mt-4 p-3 border border-gray-300 rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-2">Rendered React Component</h3>
      <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <LiveProvider
          code={validCode}
          scope={{ React }}
          noInline={true}
          theme={{
            plain: { color: "#d6deeb", backgroundColor: "#13161F" },
            styles: [
              {
                types: ["comment", "prolog", "doctype", "cdata"],
                style: { color: "rgb(99, 119, 119)", fontStyle: "italic" },
              },
              {
                types: ["punctuation"],
                style: { color: "rgb(199, 146, 234)" },
              },
            ],
          }}
        >
          {/* 预览区域 */}
          <div className="flex-1 p-6 bg-white">
            <div className="h-full border-2 border-dashed border-gray-200 rounded-lg p-4 overflow-auto">
              <LivePreview className="h-full" />
            </div>
          </div>

          {/* 错误显示 */}
          <LiveError className="bg-red-50 text-red-600 p-3 font-mono text-sm border-t border-red-100" />
        </LiveProvider>
      </div>
    </div>
  );
}
