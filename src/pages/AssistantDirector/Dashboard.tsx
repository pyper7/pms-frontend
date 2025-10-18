import React from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';

const AssistantDirectorDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <PageHeader title="Assistant Director Dashboard" subtitle="Overview and tools for Division admins" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Card className="p-4">Coming soon</Card>
        </div>
      </div>
    </Layout>
  );
};

export default AssistantDirectorDashboard;


