import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ConfigModal() {
  const [baseUrl, setBaseUrl] = useState("https://api.chatanywhere.org");
  const [apiKey, setApiKey] = useState(
    "sk-8pKbA2cKOoGbRjseIoahqJfNqhLI3tchR0r2cEQ3z7q180EE"
  );
  const [open, setOpen] = useState(false);

  // 加载保存的配置
  useEffect(() => {
    const savedBaseUrl = localStorage.getItem("baseUrl");
    const savedApiKey = localStorage.getItem("apiKey");

    if (savedBaseUrl) setBaseUrl(savedBaseUrl);
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  // 保存配置到localStorage
  const handleSave = () => {
    localStorage.setItem("baseUrl", baseUrl);
    localStorage.setItem("apiKey", apiKey);
    toast.success("配置已保存", {
      duration: 1000,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">配置</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>配置选项</DialogTitle>
          <DialogDescription>请输入 baseURL 和 API KEY.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="baseURL" className="text-right">
              baseURL
            </Label>
            <Input
              id="baseURL"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="APIKEY" className="text-right">
              API KEY
            </Label>
            <Input
              id="APIKEY"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
