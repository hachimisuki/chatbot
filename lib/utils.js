import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractAndProcessJSX(codeString) {
  if (!codeString || typeof codeString !== "string") {
    return "Error: Invalid input";
  }
  const matches = codeString.match(/```jsx([\s\S]*?)```/)[0];
  // 去除代码块标记（```jsx, ```javascript, ```react, ```js, ``` 等）
  let processed = matches.replace(/```\w*\s*/g, "");
  processed = processed.replace(/```\s*$/gm, "");

  // 移除 import 语句
  processed = processed.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, "");
  processed = processed.replace(
    /import\s+{[^}]*}\s+from\s+['"].*?['"];?\s*/g,
    ""
  );
  processed = processed.replace(/import\s+['"].*?['"];?\s*/g, "");

  // 替换 React Hooks - 只替换以下常用的 hooks
  const hooks = [
    "useState",
    "useEffect",
    "useContext",
    "useReducer",
    "useCallback",
    "useMemo",
    "useRef",
    "useImperativeHandle",
    "useLayoutEffect",
    "useDebugValue",
  ];

  hooks.forEach((hook) => {
    // 使用单词边界确保只替换独立的 hook 名称，避免替换 setter 函数
    const regex = new RegExp(`\\b${hook}\\b(?=\\s*\\()`, "g");
    processed = processed.replace(regex, `React.${hook}`);
  });

  // 清理多余的空行
  processed = processed.replace(/\n\s*\n\s*\n/g, "\n\n").trim();

  // 提取组件名称
  const componentMatch = processed.match(
    /(?:const|function|class)\s+([A-Z][a-zA-Z0-9_]*)/
  );

  // 移除 export 语句
  processed = processed.replace(/export\s+default\s+\w+;?\s*/g, "");
  processed = processed.replace(/export\s+{[^}]*}\s*;?\s*/g, "");
  processed = processed.replace(/export\s+/g, "");

  if (componentMatch) {
    const componentName = componentMatch[1];
    return processed + `\n\nrender(<${componentName} />);`;
  } else {
    return "Error: Component not found";
  }
}

// Example usage (not part of the function, just for demonstration)
// const inputCode = `...`;  // Paste your input here
// console.log(extractAndProcessJSX(inputCode));
