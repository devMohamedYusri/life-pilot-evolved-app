
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            View and manage your profile information
          </p>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{`${user?.firstName} ${user?.lastName}`}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h3 className="font-medium">Account Information</h3>
              <p className="text-sm text-muted-foreground">
                Member since: {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              This section is under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The Profile section will allow you to:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Update your profile information</li>
              <li>Change your profile picture</li>
              <li>View your account activity</li>
              <li>Manage connected accounts</li>
              <li>Set your privacy preferences</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
