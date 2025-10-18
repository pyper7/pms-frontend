import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItemProps {
  title: string;
  subtitle?: string;
  percentage: number;
  color: string;
  details: string[];
}

const ProgressItem = ({ title, subtitle, percentage, color, details }: ProgressItemProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-card-foreground">{title}</h4>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <span className="text-sm font-medium text-card-foreground">{percentage}%</span>
      </div>
      <div className="w-full bg-progress-bg rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color 
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {details.map((detail, index) => (
          <span key={index} className="bg-muted px-2 py-1 rounded">
            {detail}
          </span>
        ))}
      </div>
    </div>
  );
};

export const MissionProgress = () => {
  const progressItems = [
    {
      title: "University Partnerships",
      percentage: 80,
      color: "hsl(120, 100%, 20%)",
      details: ["Universities: 186", "Satisfaction: 89%", "Budget: N8.4B"]
    },
    {
      title: "Infrastructure Development",
      percentage: 80,
      color: "hsl(120, 100%, 20%)",
      details: ["Projects: 186", "Completed: 38", "Investment: N2.1B"]
    },
    {
      title: "Research & Innovation", 
      percentage: 80,
      color: "hsl(120, 100%, 20%)",
      details: ["Studies: 187", "Published: 40", "Patents Filled: 12"]
    },
    {
      title: "Human Capital Excellence",
      percentage: 80,
      color: "hsl(120, 100%, 20%)", 
      details: ["Staff: 2,807", "Performance: 89%", "Retention: 90%"]
    }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Mission Progress Overview
          </CardTitle>
          <button className="text-sm text-primary hover:text-primary/80">See All</button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {progressItems.map((item, index) => (
          <ProgressItem key={index} {...item} />
        ))}
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">Strategic Insights & Collaboration</div>
            <button className="text-sm text-primary hover:text-primary/80">See All</button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-card-foreground">University partnership satisfaction dropping in Southeast region (67%). Schedule stakeholder meetings before contract renewals in Q1 2025.</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-card-foreground">Research funding efficiency up 34% in Q4. Consider reallocating N200M from underperforming infrastructure projects to high-impact research initiatives.</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-card-foreground">ICT Department vacancy rate (31%) is impacting digital transformation goals. Recommend fast-track recruitment with 25% salary premium to attract top talent.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};