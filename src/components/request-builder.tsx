import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import ParamsTab from "./tabs/params-tab";
import AuthTab from "./tabs/auth-tab";
import HeadersTab from "./tabs/headers-tab";
import BodyTab from "./tabs/body-tab";
import RequestPreview from "./request-preview";
import type { KeyValuePair, AuthConfig, TabType, RequestConfig } from "../lib/types";

// Form validation schema
const requestFormSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
  url: z.string().refine((val) => {
    if (!val.trim()) return true; // Empty is allowed
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Please enter a valid URL"),
  params: z.array(z.object({
    id: z.string(),
    key: z.string(),
    value: z.string(),
    enabled: z.boolean()
  })).refine((params) => {
    return params.every(param => {
      if (!param.enabled) return true;
      if (param.key && !param.value) return false;
      if (!param.key && param.value) return false;
      return true;
    });
  }, "All enabled parameters must have both key and value"),
  headers: z.array(z.object({
    id: z.string(),
    key: z.string(),
    value: z.string(),
    enabled: z.boolean()
  })).refine((headers) => {
    return headers.every(header => {
      if (!header.enabled) return true;
      if (header.key && !header.value) return false;
      if (!header.key && header.value) return false;
      return true;
    });
  }, "All enabled headers must have both key and value"),
  auth: z.object({
    type: z.enum(['none', 'bearer', 'basic', 'apikey']),
    token: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    keyName: z.string().optional(),
    keyValue: z.string().optional(),
    keyLocation: z.enum(['header', 'query']).optional()
  }),
  body: z.string().refine((val) => {
    if (!val.trim()) return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "Invalid JSON format")
});

type RequestFormData = z.infer<typeof requestFormSchema>;

export default function RequestBuilder() {
  const [activeTab, setActiveTab] = useState<TabType>("params");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      method: "GET",
      url: "",
      params: [],
      headers: [],
      auth: { type: 'none' },
      body: ""
    },
    mode: "onChange"
  });

  const watchedValues = form.watch();

  const generateRequestConfig = (): RequestConfig => {
    const formData = form.getValues();
    
    // Build params object
    const requestParams: Record<string, string> = {};
    formData.params.forEach(param => {
      if (param.enabled && param.key && param.value) {
        requestParams[param.key] = param.value;
      }
    });

    // Build headers object
    const requestHeaders: Record<string, string> = {};
    formData.headers.forEach(header => {
      if (header.enabled && header.key && header.value) {
        requestHeaders[header.key] = header.value;
      }
    });

    // Handle auth
    let authConfig: { username: string; password: string } | undefined;

    if (formData.auth.type === 'bearer' && formData.auth.token) {
      requestHeaders['Authorization'] = `Bearer ${formData.auth.token}`;
    } else if (formData.auth.type === 'basic' && formData.auth.username && formData.auth.password) {
      authConfig = { username: formData.auth.username, password: formData.auth.password };
    } else if (formData.auth.type === 'apikey' && formData.auth.keyName && formData.auth.keyValue) {
      if (formData.auth.keyLocation === 'header') {
        requestHeaders[formData.auth.keyName] = formData.auth.keyValue;
      } else {
        requestParams[formData.auth.keyName] = formData.auth.keyValue;
      }
    }

    // Parse body
    let requestData: any;
    if (formData.body.trim()) {
      try {
        requestData = JSON.parse(formData.body);
      } catch {
        // Invalid JSON, don't include body
      }
    }

    const config: RequestConfig = {
      method: formData.method.toLowerCase(),
      url: formData.url || '',
    };

    if (Object.keys(requestParams).length > 0) {
      config.params = requestParams;
    }

    if (Object.keys(requestHeaders).length > 0) {
      config.headers = requestHeaders;
    }

    if (requestData) {
      config.data = requestData;
    }

    if (authConfig) {
      config.auth = authConfig;
    }

    return config;
  };

  const onSubmit = async (data: RequestFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const config = generateRequestConfig();
      console.log('Request configuration:', config);
      
      toast("Request configuration generated successfully! Check the console for axios config.");
    } catch (error) {
      toast("Failed to process request configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveParamsCount = () => watchedValues.params?.filter(p => p.enabled && p.key).length || 0;
  const getActiveHeadersCount = () => watchedValues.headers?.filter(h => h.enabled && h.key).length || 0;

  const showBodyWarning = ['GET', 'HEAD', 'DELETE'].includes(watchedValues.method || 'GET');

  const updateParams = (params: KeyValuePair[]) => {
    form.setValue('params', params, { shouldValidate: true });
  };

  const updateHeaders = (headers: KeyValuePair[]) => {
    form.setValue('headers', headers, { shouldValidate: true });
  };

  const updateAuth = (auth: AuthConfig) => {
    form.setValue('auth', auth, { shouldValidate: true });
  };

  const updateBody = (body: string) => {
    form.setValue('body', body, { shouldValidate: true });
  };

  const getParamErrors = (): string[] => {
    const errors = form.formState.errors.params;
    if (!errors) return [];
    return watchedValues.params?.filter(param => {
      if (!param.enabled) return false;
      return (param.key && !param.value) || (!param.key && param.value);
    }).map(param => param.id) || [];
  };

  const getHeaderErrors = (): string[] => {
    const errors = form.formState.errors.headers;
    if (!errors) return [];
    return watchedValues.headers?.filter(header => {
      if (!header.enabled) return false;
      return (header.key && !header.value) || (!header.key && header.value);
    }).map(header => header.id) || [];
  };

  console.log("&&&&&&&&&&&&&&&&&", isLoading)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Header Section */}
        <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">API Request Builder</h1>
            
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              {/* HTTP Method Selector */}
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="HEAD">HEAD</SelectItem>
                        <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              {/* URL Input */}
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="Enter URL (e.g., https://api.example.com/users)"
                          {...field}
                          className={form.formState.errors.url ? "border-error" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Send Button */}
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-gray-900 hover:bg-gray-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send
                  </>
                )}
              </Button>
            </div>
            
            {/* Global Error Message */}
            {!form.formState.isValid && form.formState.isSubmitted && (
              <Alert className="mt-4 border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors below before sending the request.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto p-6">
          <Card className="overflow-hidden">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
              <div className="border-b bg-gray-50 dark:bg-gray-900 px-6">
                <TabsList className="h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="params" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--primary))] data-[state=active]:text-[hsl(var(--primary))] rounded-none bg-transparent py-4 px-2"
                  >
                    Params
                    {getActiveParamsCount() > 0 && (
                      <span className="ml-2 bg-[hsl(var(--primary))] text-white text-xs px-2 py-0.5 rounded-full">
                        {getActiveParamsCount()}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="auth" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--primary))] data-[state=active]:text-[hsl(var(--primary))] rounded-none bg-transparent py-4 px-2"
                  >
                    Auth
                  </TabsTrigger>
                  <TabsTrigger 
                    value="headers" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--primary))] data-[state=active]:text-[hsl(var(--primary))] rounded-none bg-transparent py-4 px-2"
                  >
                    Headers
                    {getActiveHeadersCount() > 0 && (
                      <span className="ml-2 bg-[hsl(var(--primary))] text-white text-xs px-2 py-0.5 rounded-full">
                        {getActiveHeadersCount()}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="body" 
                    className="data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--primary))] data-[state=active]:text-[hsl(var(--primary))] rounded-none bg-transparent py-4 px-2"
                  >
                    Body
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6">
                <TabsContent value="params" className="mt-0">
                  <ParamsTab 
                    params={watchedValues.params || []} 
                    setParams={updateParams}
                    errors={getParamErrors()}
                    onValidate={() => form.trigger('params')}
                  />
                </TabsContent>

                <TabsContent value="auth" className="mt-0">
                  <AuthTab 
                    auth={watchedValues.auth || { type: 'none' }} 
                    setAuth={updateAuth}
                  />
                </TabsContent>

                <TabsContent value="headers" className="mt-0">
                  <HeadersTab 
                    headers={watchedValues.headers || []} 
                    setHeaders={updateHeaders}
                    errors={getHeaderErrors()}
                    onValidate={() => form.trigger('headers')}
                  />
                </TabsContent>

                <TabsContent value="body" className="mt-0">
                  <BodyTab 
                    body={watchedValues.body || ''} 
                    setBody={updateBody}
                    hasError={!!form.formState.errors.body}
                    onValidate={() => form.trigger('body')}
                    showWarning={showBodyWarning}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <RequestPreview config={generateRequestConfig()} />
        </div>
      </form>
    </Form>
  );
}