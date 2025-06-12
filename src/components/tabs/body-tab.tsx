import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, AlertCircle, Info, Wand2 } from "lucide-react";

interface BodyTabProps {
  body: string;
  setBody: (body: string) => void;
  hasError: boolean;
  onValidate: () => void;
  showWarning: boolean;
}

export default function BodyTab({
  body,
  setBody,
  hasError,
  onValidate,
  showWarning,
}: BodyTabProps) {
  const [jsonError, setJsonError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!body.trim()) {
      setIsValid(null);
      setJsonError("");
      return;
    }

    try {
      JSON.parse(body);
      setIsValid(true);
      setJsonError("");
    } catch (error) {
      setIsValid(false);
      setJsonError(error instanceof Error ? error.message : "Invalid JSON");
    }
  }, [body]);

  const formatJson = () => {
    if (!body.trim()) return;

    try {
      const parsed = JSON.parse(body);
      const formatted = JSON.stringify(parsed, null, 2);
      setBody(formatted);
    } catch {
      // Invalid JSON, can't format
    }
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    // Trigger validation after a short delay
    setTimeout(() => {
      onValidate();
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Request Body</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Content-Type: application/json
          </span>
          <Button
            onClick={formatJson}
            variant="outline"
            size="sm"
            disabled={!body.trim() || hasError}
          >
            <Wand2 className="h-3 w-3 mr-1" />
            Format
          </Button>
        </div>
      </div>

      <div className="relative">
        <Textarea
          placeholder={`Enter JSON here, e.g.\n{\n  "name": "John Doe",\n  "email": "john@example.com"\n}`}
          value={body}
          onChange={(e) => handleBodyChange(e.target.value)}
          className={`font-mono h-64 resize-none ${
            hasError ? "border-error" : ""
          }`}
          spellCheck={false}
        />

        {/* JSON Status Indicator */}
        <div className="absolute top-3 right-3">
          {isValid === true && (
            <div className="flex items-center text-xs text-success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Valid JSON
            </div>
          )}
          {isValid === false && (
            <div className="flex items-center text-xs text-destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Invalid JSON
            </div>
          )}
        </div>

        {/* JSON Error Message */}
        {hasError && jsonError && (
          <Alert className="mt-2 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium">Invalid JSON</p>
              <p className="text-xs mt-1">{jsonError}</p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Body Method Notice */}
      {showWarning && (
        <Alert className="border-warning bg-yellow-50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Request body is typically used with POST, PUT, and PATCH methods.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
