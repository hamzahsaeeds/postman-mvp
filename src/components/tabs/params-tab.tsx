import { Button } from "../ui/button";
import { Plus, List } from "lucide-react";
import KeyValueRow from "../key-value-row";
import type { KeyValuePair } from "../../lib/types";

interface ParamsTabProps {
  params: KeyValuePair[];
  setParams: (params: KeyValuePair[]) => void;
  errors: string[];
  onValidate: () => void;
}

export default function ParamsTab({ params, setParams, errors, onValidate }: ParamsTabProps) {
  const addParam = () => {
    const newParam: KeyValuePair = {
      id: `param-${Date.now()}`,
      key: '',
      value: '',
      enabled: true
    };
    setParams([...params, newParam]);
  };

  const updateParam = (id: string, field: keyof KeyValuePair, value: string | boolean) => {
    setParams(params.map(param => 
      param.id === id ? { ...param, [field]: value } : param
    ));
  };

  const removeParam = (id: string) => {
    setParams(params.filter(param => param.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Query Parameters</h3>
        <Button 
          onClick={addParam}
          type="button"
          className="bg-gray-900 hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Parameter
        </Button>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-12 gap-4 mb-3">
          <div className="col-span-1 text-sm font-medium text-gray-700">Active</div>
          <div className="col-span-5 text-sm font-medium text-gray-700">Key</div>
          <div className="col-span-5 text-sm font-medium text-gray-700">Value</div>
          <div className="col-span-1 text-sm font-medium text-gray-700">Action</div>
        </div>
        
        <div className="space-y-3">
          {params.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <List className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No parameters added yet. Click "Add Parameter" to get started.</p>
            </div>
          ) : (
            params.map(param => (
              <KeyValueRow
                key={param.id}
                item={param}
                onUpdate={(field, value) => updateParam(param.id, field, value)}
                onRemove={() => removeParam(param.id)}
                onValidate={onValidate}
                hasError={errors.includes(param.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
