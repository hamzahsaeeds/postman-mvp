import { Button } from "../ui/button";
import { Plus, Tags } from "lucide-react";
import KeyValueRow from "../key-value-row";
import type { KeyValuePair } from "../../lib/types";

interface HeadersTabProps {
  headers: KeyValuePair[];
  setHeaders: (headers: KeyValuePair[]) => void;
  errors: string[];
  onValidate: () => void;
}

export default function HeadersTab({
  headers,
  setHeaders,
  errors,
  onValidate,
}: HeadersTabProps) {
  const addHeader = () => {
    const newHeader: KeyValuePair = {
      id: `header-${Date.now()}`,
      key: "",
      value: "",
      enabled: true,
    };
    setHeaders([...headers, newHeader]);
  };

  const updateHeader = (
    id: string,
    field: keyof KeyValuePair,
    value: string | boolean
  ) => {
    setHeaders(
      headers.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">HTTP Headers</h3>
        <Button
          onClick={addHeader}
          type="button"
          className="bg-gray-900 hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Header
        </Button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-12 gap-4 mb-3">
          <div className="col-span-1 text-sm font-medium text-gray-700">
            Active
          </div>
          <div className="col-span-5 text-sm font-medium text-gray-700">
            Key
          </div>
          <div className="col-span-5 text-sm font-medium text-gray-700">
            Value
          </div>
          <div className="col-span-1 text-sm font-medium text-gray-700">
            Action
          </div>
        </div>

        <div className="space-y-3">
          {headers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Tags className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No headers added yet. Click "Add Header" to get started.</p>
            </div>
          ) : (
            headers.map((header) => (
              <KeyValueRow
                key={header.id}
                item={header}
                onUpdate={(field, value) =>
                  updateHeader(header.id, field, value)
                }
                onRemove={() => removeHeader(header.id)}
                onValidate={onValidate}
                hasError={errors.includes(header.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
