"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ConfigModal({
  selectedModel,
  apiKey,
  baseUrl,
  changeUrl,
  changeModel,
  changeApiKey,
}) {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // // 当对话框打开时获取模型列表
  // useEffect(() => {
  //   if (open && baseUrl && apiKey) {
  //     fetchModels();
  //   }
  // }, [open]);

  // 获取模型列表
  const fetchModels = async () => {
    if (!baseUrl || !apiKey) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/v1/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.data && response.data.data) {
        setModels(response.data.data);
      }
    } catch (error) {
      console.error("获取模型失败:", error);
      toast.error("获取模型列表失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 保存配置
  const handleSave = () => {
    localStorage.setItem("baseUrl", baseUrl);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("selectedModel", selectedModel);
    changeUrl(baseUrl);
    changeApiKey(apiKey);
    changeModel(selectedModel);
    toast.success("配置已保存", {
      duration: 2000,
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
          <DialogDescription>设置API地址、密钥及模型</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="baseURL" className="text-right">
              baseURL
            </Label>
            <Input
              id="baseURL"
              value={baseUrl}
              onChange={(e) => changeUrl(e.target.value)}
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
              onChange={(e) => changeApiKey(e.target.value)}
              className="col-span-3"
              type="password"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              模型
            </Label>
            <div className="col-span-3">
              <Select
                value={selectedModel}
                onValueChange={changeModel}
                onOpenChange={(open) => {
                  if (open && models.length === 0 && !isLoading) {
                    fetchModels();
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择模型" />
                </SelectTrigger>

                <SelectContent>
                  {selectedModel && (
                    <SelectItem value={selectedModel}>
                      {selectedModel}
                    </SelectItem>
                  )}
                  {isLoading ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>加载中...</span>
                    </div>
                  ) : (
                    models.map(
                      (model, index) =>
                        model.id !== selectedModel && (
                          <SelectItem key={index} value={model.id}>
                            {model.id}
                          </SelectItem>
                        )
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
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
