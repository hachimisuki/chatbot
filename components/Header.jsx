import { ConfigModal } from "../components/ConfigModal";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-11  w-full items-center justify-between px-16">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-2">
          <img src="/chatgpt-logo.png" alt="ChatGPT Logo" className="h-6 w-6" />
          <span className="font-bold">ChatBOT</span>
        </div>
        {/* Right side - Config button */}
        <div className="flex items-center space-x-2">
          <ConfigModal />
        </div>
      </div>
    </header>
  );
}
