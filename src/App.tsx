import "./index.css";
import RequestBuilder from "./components/request-builder";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TooltipProvider>
        <RequestBuilder />
      </TooltipProvider>
    </div>
  );
}

export default App;
