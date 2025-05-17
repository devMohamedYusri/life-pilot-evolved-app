
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIAssistant() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">
            Get help and insights from your personal AI assistant
          </p>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>
              This section is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The AI Assistant section will allow you to:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Chat with your AI assistant about anything</li>
              <li>Get personalized insights and recommendations</li>
              <li>Create tasks, journal entries, and plans through conversation</li>
              <li>Analyze your data for patterns and trends</li>
              <li>Receive motivational support and guidance</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
