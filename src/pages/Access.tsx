import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/utils/toast";

const Access = () => {
  const handleLoginClick = () => {
    toast.success("Redirecting to login page");
  };

  const handleGuideClick = () => {
    toast.info("User guide will be available soon");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader
        title="PMS Access"
        subtitle="Access for existing and new users"
        right={
          <Link to="/">
            <Button variant="ghost">Back to Home</Button>
          </Link>
        }
      />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mb-12">
          <h1 className="text-2xl font-semibold mb-3">Welcome to PMS Access</h1>
          <p className="text-muted-foreground">Choose your path below. Existing staff can log in directly. First-time users can follow the onboarding guide to get started.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Existing Users</CardTitle>
              <CardDescription>Sign in with your assigned credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-6">
                <li>Use your official email and password</li>
                <li>Reset your password from the login page if needed</li>
                <li>Contact IT Support if you’re locked out</li>
              </ul>
              <Link to="/login">
                <Button className="w-full" onClick={handleLoginClick}>Login to PMS</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>First-time Users</CardTitle>
              <CardDescription>Follow this quick onboarding checklist</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground mb-6">
                <li>Obtain credentials from HR/IT (email and temporary password)</li>
                <li>Login and immediately change your password</li>
                <li>Set your KRAs and KPIs for the performance period</li>
                <li>Submit goals for supervisor review and approval</li>
              </ol>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleGuideClick}>Read User Guide</Button>
                <Link to="/login">
                  <Button onClick={handleLoginClick}>Proceed to Login</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Access;


