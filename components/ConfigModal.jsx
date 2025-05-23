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

export function ConfigModal() {
  return (
    <Dialog>
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
              defaultValue="https://api.chatanywhere.org"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="APIKEY" className="text-right">
              API KEY
            </Label>
            <Input
              id="APIKEY"
              defaultValue="sk-8pKbA2cKOoGbRjseIoahqJfNqhLI3tchR0r2cEQ3z7q180EE"
              className="col-span-3"
            />
          </div>

        </div>
        <DialogFooter>
          <Button type="submit">保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
