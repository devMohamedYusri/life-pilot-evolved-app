
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardNotFound() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-center mt-4 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="space-y-4 w-full max-w-md">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Return to Dashboard
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            If you believe this is a mistake, please contact support.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
