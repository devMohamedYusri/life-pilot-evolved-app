
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Planning() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planning</h1>
          <p className="text-muted-foreground">
            Plan your future and set goals
          </p>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Future Planning</CardTitle>
            <CardDescription>
              This section is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The Planning section will allow you to:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Create and manage life areas</li>
              <li>Set short, medium, and long-term goals</li>
              <li>Track progress on your goals</li>
              <li>Visualize your plans on a timeline</li>
              <li>Get AI-powered suggestions for achieving your goals</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
