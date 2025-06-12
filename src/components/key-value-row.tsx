import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import type { KeyValuePair } from "../lib/types";

interface KeyValueRowProps {
  item: KeyValuePair;
  onUpdate: (field: keyof KeyValuePair, value: string | boolean) => void;
  onRemove: () => void;
  onValidate: () => void;
  hasError: boolean;
}

export default function KeyValueRow({
  item,
  onUpdate,
  onRemove,
  onValidate,
  hasError,
}: KeyValueRowProps) {
  const handleKeyChange = (value: string) => {
    onUpdate("key", value);
  };

  const handleValueChange = (value: string) => {
    onUpdate("value", value);
  };

  const handleEnabledChange = (checked: boolean) => {
    onUpdate("enabled", checked);
  };

  const handleBlur = () => {
    onValidate();
  };

  const keyHasError = hasError && item.enabled && item.value && !item.key;
  const valueHasError = hasError && item.enabled && item.key && !item.value;

  return (
    <div className="grid grid-cols-12 gap-4 items-start">
      <div className="col-span-1 flex items-center justify-center pt-2">
        <Checkbox
          checked={item.enabled}
          onCheckedChange={handleEnabledChange}
        />
      </div>
      <div className="col-span-5">
        <Input
          type="text"
          placeholder="Key"
          value={item.key}
          onChange={(e) => handleKeyChange(e.target.value)}
          onBlur={handleBlur}
          className={keyHasError ? "border-error" : ""}
        />
        {keyHasError && (
          <div className="mt-1 text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Key is required
          </div>
        )}
      </div>
      <div className="col-span-5">
        <Input
          type="text"
          placeholder="Value"
          value={item.value}
          onChange={(e) => handleValueChange(e.target.value)}
          onBlur={handleBlur}
          className={valueHasError ? "border-error" : ""}
        />
        {valueHasError && (
          <div className="mt-1 text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Value is required when key is provided
          </div>
        )}
      </div>
      <div className="col-span-1 flex items-center justify-center pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-gray-400 hover:text-destructive p-1 h-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
