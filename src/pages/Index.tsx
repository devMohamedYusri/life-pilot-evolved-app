
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-primary">
          LifePilot
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg">
          Your comprehensive dashboard for managing tasks, journaling, planning, and more
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate("/login")}>Login</Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/signup")}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
