
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Card, CardContent } from "@/components/ui/card";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">LifePilot</h1>
          <p className="text-muted-foreground mt-2">Your life management dashboard</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
