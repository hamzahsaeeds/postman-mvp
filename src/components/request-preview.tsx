import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { RequestConfig } from "../lib/types";

interface RequestPreviewProps {
  config: RequestConfig;
}

export default function RequestPreview({ config }: RequestPreviewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const configText = JSON.stringify(config, null, 2);

    try {
      await navigator.clipboard.writeText(configText);
      setCopied(true);
      toast("Copied!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast("Failed to copy");
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Request Configuration
          </h3>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            type="button"
            className={copied ? "bg-success text-black" : ""}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Config
              </>
            )}
          </Button>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
          This JSON can be used directly with axios
        </div>
      </CardContent>
    </Card>
  );
}
