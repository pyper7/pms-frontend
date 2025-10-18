import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EmergencyItemProps {
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action?: string;
}

const EmergencyItem = ({ type, title, description, action }: EmergencyItemProps) => {
  const getIndicatorColor = (type: string) => {
    switch (type) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-3 relative">
      <div 
        className="w-1 h-full rounded-full flex-shrink-0 absolute left-0 top-0 bottom-0"
        style={{ backgroundColor: getIndicatorColor(type) }}
      ></div>
      <div className="flex-1 ml-3">
        <h4 className="font-semibold text-sm text-gray-900 mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{title}</h4>
        <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{description}</p>
        {action && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7 px-3 border-gray-300 text-gray-700 hover:bg-gray-50 bg-gray-100 rounded-md"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            {action}
          </Button>
        )}
      </div>
    </div>
  );
};

export const EmergencyHub = () => {
  const emergencyItems = [
    {
      type: 'critical' as const,
      title: '12 staff critical expire',
      description: 'Date - Time',
      action: 'Send Reminder'
    },
    {
      type: 'warning' as const,
      title: '5 transfer requests awaiting approval',
      description: 'Date - Time',
      action: 'Review'
    },
    {
      type: 'info' as const,
      title: 'Q4 appraisal closes in 3 days',
      description: 'Date - Time',
      action: 'Check Progress'
    }
  ];

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Emergency Hub
          </CardTitle>
          <button 
            className="text-sm font-medium underline" 
            style={{ color: '#10b981', fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            See All
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {emergencyItems.map((item, index) => (
          <EmergencyItem key={index} {...item} />
        ))}
      </CardContent>
    </Card>
  );
};