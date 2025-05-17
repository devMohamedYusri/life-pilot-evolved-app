
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Stats() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
          <p className="text-muted-foreground">
            View insights about your activities and habits
          </p>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Statistics & Habits</CardTitle>
            <CardDescription>
              This section is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The Statistics section will allow you to:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Track your habits and streaks</li>
              <li>View visualizations of your productivity</li>
              <li>Monitor your progress toward goals</li>
              <li>Analyze patterns in your mood and energy</li>
              <li>Get insights on your time allocation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
