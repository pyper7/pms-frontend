import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Plus } from "lucide-react";

const TeamPerformanceContracts: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Team Performance Contracts"
          subtitle="View and manage performance contracts for your team."
          right={
            <Button className="dark-mode-hover">
              <Plus className="w-4 h-4 mr-2" />
              Create Contract
            </Button>
          }
        />

        {/* Breadcrumbs */}
        <div className="px-1">
          <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <a href="/director-dashboard" className="hover:text-gray-700">Director Dashboard</a>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-700 font-medium">Team Contracts</li>
            </ol>
          </nav>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="dark-mode-card dark-shadow">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded w-2/3" />
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-slate-200 rounded w-20" />
                      <div className="h-8 bg-slate-200 rounded w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="dark-mode-card dark-shadow">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Contracts Yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Create performance contracts for your team members to track their objectives and KPIs.
              </p>
              <div className="flex gap-3 justify-center">
                <Button className="dark-mode-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Contract
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TeamPerformanceContracts;


