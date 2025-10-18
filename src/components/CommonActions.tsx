import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserPlus, FileText, Calendar, BarChart3, Star, Target } from "lucide-react";

export const CommonActions = () => {
  const actions = [
    { icon: Plus, label: "Add Widget", variant: "default" as const },
    { icon: UserPlus, label: "Add Staff", variant: "outline" as const },
    { icon: FileText, label: "Create Unit", variant: "outline" as const },
    { icon: Calendar, label: "Create Vacancy", variant: "outline" as const },
    { icon: BarChart3, label: "Generate Report", variant: "outline" as const },
    { icon: Star, label: "Grant Review", variant: "outline" as const },
    { icon: Target, label: "Fund Tracking", variant: "outline" as const }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Common Actions (One-Click Access)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              size="sm"
              className={`flex-1 whitespace-nowrap ${
                action.variant === "default" 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "border-border text-foreground hover:bg-accent"
              }`}
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};