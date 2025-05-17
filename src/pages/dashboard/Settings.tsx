
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              This section is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The Settings section will allow you to:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Update your profile information</li>
              <li>Change your password</li>
              <li>Configure notification preferences</li>
              <li>Customize the app theme and appearance</li>
              <li>Manage data and privacy settings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
