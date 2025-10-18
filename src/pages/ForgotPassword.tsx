import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import PageHeader from "@/components/PageHeader";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { toast } from "@/utils/toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle forgot password logic here
    toast.success("Password reset instructions sent to your email");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="h-screen flex overflow-hidden">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5">
          {/* Modern geometric background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-primary/15 dark:bg-primary/25 rounded-full blur-2xl"></div>
            <div className="absolute bottom-32 left-32 w-40 h-40 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-primary/25 dark:bg-primary/35 rounded-full blur-2xl"></div>
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid opacity-10 dark:opacity-20"></div>
          
          {/* Main illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Central circle with gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 dark:from-primary/30 dark:to-primary/50 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/60 dark:bg-primary/70 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/30 dark:bg-primary/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-primary/25 dark:bg-primary/35 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/60 via-transparent to-transparent">
            <div className="text-center text-foreground p-8">
              <h2 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Check Your Email
              </h2>
              <p className="text-lg text-muted-foreground max-w-md">
                We've sent password reset instructions to your email address.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Success Message */}
        <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
          {/* TETFund Branding - Top Left */}
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center">
              <img 
                src="/pms/tetfund-logo.jpg" 
                alt="TETFund" 
                className="h-10 w-auto object-contain mr-3" 
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/favicon.ico"; }}
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">TETFund PMS</h1>
                <p className="text-xs text-muted-foreground">Performance Management System</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Success Container */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
              <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-[var(--shadow-elegant)]">
                <CardHeader className="space-y-4 text-center pb-6">
                  <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Email Sent!
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-lg">
                    We've sent password reset instructions to {email}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-0">
                  <div className="bg-muted/30 rounded-lg p-6 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Please check your email and follow the instructions to reset your password.
                    </p>
                  </div>

                  <Link to="/login">
                    <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:shadow-[var(--glow-primary)] text-lg">
                      Back to Login
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5">
        {/* Modern geometric background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-primary/15 dark:bg-primary/25 rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-primary/25 dark:bg-primary/35 rounded-full blur-2xl"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid opacity-10 dark:opacity-20"></div>
        
        {/* Main illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-80 h-80">
            {/* Central circle with gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 dark:from-primary/30 dark:to-primary/50 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/60 dark:bg-primary/70 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/30 dark:bg-primary/40 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-primary/25 dark:bg-primary/35 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute top-1/2 -right-8 w-8 h-8 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/60 via-transparent to-transparent">
          <div className="text-center text-foreground p-8">
            <h2 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Forgot Password?
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              No worries! Enter your email address and we'll send you reset instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-br from-background via-background/95 to-background/90">
        {/* TETFund Branding - Top Left */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center">
            <img 
              src="/pms/tetfund-logo.jpg" 
              alt="TETFund" 
              className="h-10 w-auto object-contain mr-3" 
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/favicon.ico"; }}
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">TETFund PMS</h1>
              <p className="text-xs text-muted-foreground">Performance Management System</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to sign in
            </Link>

            <Card className="backdrop-blur-sm bg-card/90 border-border/50 shadow-[var(--shadow-elegant)]">
              <CardHeader className="space-y-1 text-center pb-6">
                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Enter your email address to receive reset instructions
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 transition-all duration-200 focus:ring-[var(--glow-primary)] text-lg"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:shadow-[var(--glow-primary)] text-lg"
                  >
                    Send Reset Instructions
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-base text-muted-foreground">
                    Remember your password?{" "}
                    <Link 
                      to="/login" 
                      className="text-primary hover:underline font-medium transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;