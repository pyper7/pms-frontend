import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, FileText, Clock, DollarSign } from "lucide-react";

interface MetricCardProps {
  value: string;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MetricCard = ({ value, label, color, bgColor, icon: Icon }: MetricCardProps) => {
  return (
    <Card 
      className="border-border hover:shadow-md transition-shadow relative overflow-hidden shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-base text-gray-600 font-medium mb-1">{label}</div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-3">
          <div className="flex items-center justify-end gap-1 text-base text-gray-500 hover:text-primary cursor-pointer font-medium">
            <span>View details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MetricsCards = () => {
  const metrics = [
    { value: "2,847", label: "Total staff", color: "#ef4444", bgColor: "#fef2f2", icon: Users },
    { value: "10", label: "Grants Approved", color: "#8b5cf6", bgColor: "#f3f4f6", icon: FileText },
    { value: "60", label: "Pending Grants", color: "#22c55e", bgColor: "#f0fdf4", icon: Clock },
    { value: "₦2.1B", label: "Funds Disbursed", color: "#06b6d4", bgColor: "#f0f9ff", icon: DollarSign }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          value={metric.value}
          label={metric.label}
          color={metric.color}
          bgColor={metric.bgColor}
          icon={metric.icon}
        />
      ))}
    </div>
  );
};