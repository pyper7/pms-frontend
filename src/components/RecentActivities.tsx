import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItemProps {
  title: string;
  time: string;
  type?: 'success' | 'info' | 'warning';
}

const ActivityItem = ({ title, time, type = 'info' }: ActivityItemProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="flex items-start gap-3 py-2">
      <div className={`w-2 h-2 rounded-full mt-2 ${getTypeColor(type)}`}></div>
      <div className="flex-1">
        <p className="text-sm text-card-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};

export const RecentActivities = () => {
  const activities = [
    {
      title: "University of Ibadan - N150M grant approved",
      time: "2 minutes ago",
      type: 'success' as const
    },
    {
      title: "Performance review completion up 23% today",
      time: "15 minutes ago", 
      type: 'info' as const
    },
    {
      title: "15 staff completed advanced training",
      time: "15 minutes ago",
      type: 'success' as const
    },
    {
      title: "15 staff completed advanced training", 
      time: "15 minutes ago",
      type: 'success' as const
    }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Recent Activities
          </CardTitle>
          <button className="text-sm text-primary hover:text-primary/80">See All</button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </CardContent>
    </Card>
  );
};