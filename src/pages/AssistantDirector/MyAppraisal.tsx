import React from "react";
import Layout from "@/components/Layout";
import AppraisalForm from "@/components/AppraisalForm";

const AssistantDirectorMyAppraisal: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <AppraisalForm isSelfAppraisal period="Q1 2025" />
      </div>
    </Layout>
  );
};

export default AssistantDirectorMyAppraisal;
