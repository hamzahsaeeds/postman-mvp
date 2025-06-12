import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { AuthConfig } from "../../lib/types";

interface AuthTabProps {
  auth: AuthConfig;
  setAuth: (auth: AuthConfig) => void;
}

export default function AuthTab({ auth, setAuth }: AuthTabProps) {
  const updateAuth = (field: keyof AuthConfig, value: string) => {
    setAuth({ ...auth, [field]: value });
  };

  const handleTypeChange = (type: AuthConfig["type"]) => {
    setAuth({
      type,
      token: "",
      username: "",
      password: "",
      keyName: "",
      keyValue: "",
      keyLocation: "header",
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Authentication</h3>

      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">Auth Type</Label>
          <Select value={auth.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Auth</SelectItem>
              <SelectItem value="bearer">Bearer Token</SelectItem>
              <SelectItem value="basic">Basic Auth</SelectItem>
              <SelectItem value="apikey">API Key</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bearer Token Fields */}
        {auth.type === "bearer" && (
          <div>
            <Label className="text-sm font-medium text-gray-700">Token</Label>
            <Input
              type="password"
              placeholder="Enter your bearer token"
              value={auth.token || ""}
              onChange={(e) => updateAuth("token", e.target.value)}
              className="mt-2"
            />
          </div>
        )}

        {/* Basic Auth Fields */}
        {auth.type === "basic" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                type="text"
                placeholder="Username"
                value={auth.username || ""}
                onChange={(e) => updateAuth("username", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                type="password"
                placeholder="Password"
                value={auth.password || ""}
                onChange={(e) => updateAuth("password", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* API Key Fields */}
        {auth.type === "apikey" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Key</Label>
              <Input
                type="text"
                placeholder="API Key Name"
                value={auth.keyName || ""}
                onChange={(e) => updateAuth("keyName", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Value</Label>
              <Input
                type="password"
                placeholder="API Key Value"
                value={auth.keyValue || ""}
                onChange={(e) => updateAuth("keyValue", e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Add to
              </Label>
              <Select
                value={auth.keyLocation || "header"}
                onValueChange={(value) => updateAuth("keyLocation", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header</SelectItem>
                  <SelectItem value="query">Query Params</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
