import React, { useMemo, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, ArrowRight, CheckCircle, Clock, Target, Users, Award, Info, PenTool } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Appraisal = {
  id: string;
  period: string; // e.g., 2025 Q1
  status: "In Progress" | "Submitted" | "Reviewed" | "Finalized";
  score?: number;
  submittedAt?: string;
};

const DirectorMyAppraisal: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [digitalSignature, setDigitalSignature] = useState<string>("");
  const [uploadedSignature, setUploadedSignature] = useState<string>("");
  const [isSigning, setIsSigning] = useState(false);
  const current: Appraisal = { id: "cur-2025Q1", period: "2025 Q1", status: "In Progress" };

  const steps = [
    { id: 1, title: "Employee's Tasks", percentage: 70 },
    { id: 2, title: "Competencies", percentage: 20 },
    { id: 3, title: "Operations & Processes", percentage: 10 },
    { id: 4, title: "Overall Assessment", percentage: 0 },
    { id: 5, title: "Confirmation & Acknowledgements", percentage: 0 }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startSigning = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsSigning(true);
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleSignature = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSigning) return;
    
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#059669';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const finishSigning = () => {
    setIsSigning(false);
    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
    if (canvas) {
      setDigitalSignature(canvas.toDataURL());
    }
  };

  const clearDigitalSignature = () => {
    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setDigitalSignature("");
    }
  };

  const clearUploadedSignature = () => {
    setUploadedSignature("");
    // Reset the file input
    const fileInput = document.getElementById('signature-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Initialize canvas context
  useEffect(() => {
    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#059669';
      }
    }
  }, [showForm, currentStep]);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-3">
                <Award className="w-8 h-8" />
                My Performance Appraisal
              </h1>
              <p className="text-emerald-700 mt-2 text-lg">Complete your quarterly performance evaluation and track your progress.</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-emerald-600 font-medium">Performance Period</div>
              <div className="text-xl font-bold text-emerald-800">1st Jan 2025 to 31st Dec 2025</div>
              <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Progress updates as you complete sections
              </div>
            </div>
          </div>
        </div>

        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800">
                  <FileText className="w-6 h-6" />
                  Current Appraisal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-emerald-600 font-medium">Performance Period</div>
                    <div className="text-xl font-bold text-emerald-800">{current.period}</div>
                    <div className="mt-2">
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                        <Clock className="w-3 h-3 mr-1" />
                        {current.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">0%</div>
                    <div className="text-xs text-emerald-600">Complete</div>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Continue Appraisal <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Users className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Sections Complete</span>
                  <span className="font-bold text-blue-800">0/6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Last Updated</span>
                  <span className="text-xs text-blue-600">Never</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Due Date</span>
                  <span className="text-xs text-blue-600">Mar 31, 2025</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showForm && (
          <div className="space-y-6">
            {/* Info sections - Readonly */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Employee Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <Label className="text-slate-600 font-medium">Surname</Label>
                    <Input value="Akeju" readOnly className="border-slate-300 bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-600 font-medium">Firstname</Label>
                    <Input value="Adetola" readOnly className="border-slate-300 bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-600 font-medium">Role</Label>
                    <Input value="Director" readOnly className="border-slate-300 bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-600 font-medium">IPPIS No</Label>
                    <Input value="292406" readOnly className="border-slate-300 bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-600 font-medium">Phone</Label>
                    <Input value="0803 000 0000" readOnly className="border-slate-300 bg-slate-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-slate-600 font-medium">Designation</Label>
                    <Input value="Assistant Director" readOnly className="border-slate-300 bg-slate-50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Supervisor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <Label className="text-blue-600 font-medium">Firstname</Label>
                    <Input value="Abiodun" readOnly className="border-blue-300 bg-blue-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-blue-600 font-medium">Other Name</Label>
                    <Input value="Jacob" readOnly className="border-blue-300 bg-blue-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-blue-600 font-medium">Role</Label>
                    <Input value="Assistant Director" readOnly className="border-blue-300 bg-blue-50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-blue-600 font-medium">Email</Label>
                    <Input value="abiodun@example.gov.ng" readOnly className="border-blue-300 bg-blue-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Indicator */}
            <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Appraisal Progress</h2>
                  <span className="text-sm text-slate-600">Step {currentStep} of {steps.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step.id 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {step.id}
                      </div>
                      <div className="ml-2">
                        <div className={`text-sm font-medium ${
                          currentStep >= step.id ? 'text-emerald-800' : 'text-slate-600'
                        }`}>
                          {step.title}
                        </div>
                        {step.percentage > 0 && (
                          <div className="text-xs text-slate-500">{step.percentage}%</div>
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-2 ${
                          currentStep > step.id ? 'bg-emerald-600' : 'bg-slate-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Employee's Tasks */}
              {currentStep === 1 && (
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-800 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Section 1: Employee's Tasks (70%)
                    </CardTitle>
                    <p className="text-sm text-emerald-600">Define your key result areas, objectives, and performance indicators for this quarter.</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-2 font-medium text-muted-foreground">
                      <div>KRA</div><div>Weight</div><div className="md:col-span-2">Objective</div><div>KPIs</div><div>Unit</div><div>Target</div><div>Achieved</div>
                    </div>
                    {[1].map((i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-8 gap-2">
                        <Input placeholder="e.g., Research & Dev" />
                        <Input type="number" placeholder="%" />
                        <Input className="md:col-span-2" placeholder="Objective" />
                        <Input placeholder="KPI" />
                        <Input placeholder="Unit" />
                        <Input type="number" placeholder="Target" />
                        <Input type="number" placeholder="Achieved" />
                      </div>
                    ))}
                    <div className="flex justify-end"><Button variant="outline" size="sm">Add Row</Button></div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Competencies */}
              {currentStep === 2 && (
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Section 2: Competencies (20%)
                    </CardTitle>
                    <p className="text-sm text-blue-600">Rate your performance in key competencies and skills.</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 font-medium text-muted-foreground">
                      <div>Competency</div><div>Cluster</div><div>Sub-Cluster</div><div className="md:col-span-2">Description</div><div>Quarter Marks</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                      <Input placeholder="Leadership" />
                      <Input placeholder="People" />
                      <Input placeholder="Coaching" />
                      <Input className="md:col-span-2" placeholder="Describe expectations" />
                      <Input type="number" placeholder="0" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Operations & Processes */}
              {currentStep === 3 && (
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Section 3: Operations & Processes (10%)
                    </CardTitle>
                    <p className="text-sm text-purple-600">Evaluate your operational efficiency and process adherence.</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 font-medium text-muted-foreground">
                      <div className="md:col-span-2">Process / Expectation</div><div>Min</div><div>Max</div><div>Quarter Marks</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                      <Input className="md:col-span-2" placeholder="Operational control, documentation..." />
                      <Input type="number" placeholder="0" />
                      <Input type="number" placeholder="5" />
                      <Input type="number" placeholder="0" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Overall Assessment */}
              {currentStep === 4 && (
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-amber-800 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Section 4: Overall Assessment
                    </CardTitle>
                    <p className="text-sm text-amber-600">Review your total performance score and overall rating.</p>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>Sub-total (Tasks)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label>Sub-total (Competencies)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label>Sub-total (Operations & Processes)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label>Overall Rating</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Confirmation & Acknowledgements */}
              {currentStep === 5 && (
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Section 5: Confirmation & Acknowledgements
                    </CardTitle>
                    <p className="text-sm text-slate-600">Add your comments and complete the appraisal process.</p>
                  </CardHeader>
                  <CardContent className="space-y-6 text-sm">
                    <div>
                      <Label className="text-slate-700 font-medium">Appraisee's Comments</Label>
                      <Textarea 
                        placeholder="Enter your comments about your performance this quarter..." 
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-slate-700 font-medium">Appraiser's Comments</Label>
                      <Textarea 
                        placeholder="Comments from your supervisor will appear here..." 
                        className="mt-2 bg-slate-50"
                        rows={4}
                        readOnly
                      />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <PenTool className="w-5 h-5" />
                        Digital Signature
                      </h3>
                      
                      <div className="mb-4">
                        <Label className="text-slate-700 font-medium">Appraisee's Declaration</Label>
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg border">
                          <p className="text-sm text-slate-600">
                            I hereby declare that the information provided in this performance appraisal is true and accurate to the best of my knowledge.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Digital Signature */}
                        <div className="space-y-4">
                          <h4 className="text-md font-semibold text-slate-700 flex items-center gap-2">
                            <PenTool className="w-4 h-4" />
                            Draw Signature
                          </h4>
                          
                          <div className="space-y-3">
                            {!digitalSignature || isSigning ? (
                              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                                <canvas
                                  id="signature-canvas"
                                  width={350}
                                  height={120}
                                  className="border border-slate-200 rounded cursor-crosshair w-full"
                                  onMouseDown={startSigning}
                                  onMouseMove={handleSignature}
                                  onMouseUp={finishSigning}
                                  onMouseLeave={finishSigning}
                                  onTouchStart={(e) => {
                                    e.preventDefault();
                                    const touch = e.touches[0];
                                    const mouseEvent = new MouseEvent('mousedown', {
                                      clientX: touch.clientX,
                                      clientY: touch.clientY
                                    });
                                    startSigning(mouseEvent as any);
                                  }}
                                  onTouchMove={(e) => {
                                    e.preventDefault();
                                    const touch = e.touches[0];
                                    const mouseEvent = new MouseEvent('mousemove', {
                                      clientX: touch.clientX,
                                      clientY: touch.clientY
                                    });
                                    handleSignature(mouseEvent as any);
                                  }}
                                  onTouchEnd={(e) => {
                                    e.preventDefault();
                                    finishSigning();
                                  }}
                                />
                                <p className="text-xs text-slate-500 mt-2 text-center">
                                  {isSigning ? "Drawing signature..." : "Click and drag to sign above"}
                                </p>
                              </div>
                            ) : (
                              <div className="border border-slate-200 rounded-lg p-4">
                                <img src={digitalSignature} alt="Digital Signature" className="max-w-full h-auto" />
                                <p className="text-xs text-slate-500 mt-2">Digital signature captured</p>
                              </div>
                            )}
                            
                            
                            <div className="flex gap-2">
                              {!digitalSignature && !isSigning ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
                                    if (canvas) {
                                      const ctx = canvas.getContext('2d');
                                      if (ctx) {
                                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                                      }
                                    }
                                    setIsSigning(true);
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <PenTool className="w-4 h-4" />
                                  Start Signing
                                </Button>
                              ) : isSigning ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const canvas = document.getElementById('signature-canvas') as HTMLCanvasElement;
                                    if (canvas) {
                                      setDigitalSignature(canvas.toDataURL());
                                      setIsSigning(false);
                                    }
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Confirm Signature
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    clearDigitalSignature();
                                    setIsSigning(true);
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <PenTool className="w-4 h-4" />
                                  Re-sign
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Upload Signature */}
                        <div className="space-y-4">
                          <h4 className="text-md font-semibold text-slate-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Upload Signature
                          </h4>
                          
                          <div className="space-y-3">
                            {!uploadedSignature ? (
                              <>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                                  <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                  <p className="text-sm text-slate-600 mb-3">
                                    Upload a scanned signature image
                                  </p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="signature-upload"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          if (event.target?.result) {
                                            setUploadedSignature(event.target.result as string);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => document.getElementById('signature-upload')?.click()}
                                    className="flex items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Choose File
                                  </Button>
                                </div>
                                
                                <div className="text-xs text-slate-500 text-center">
                                  Supported formats: JPG, PNG, GIF (Max 2MB)
                                </div>
                              </>
                            ) : (
                              <div className="space-y-3">
                                <div className="border border-slate-200 rounded-lg p-4">
                                  <img src={uploadedSignature} alt="Uploaded Signature" className="max-w-full h-auto" />
                                  <p className="text-xs text-slate-500 mt-2">Uploaded signature</p>
                                </div>
                                
                                <div className="text-xs text-slate-500 text-center">
                                  Supported formats: JPG, PNG, GIF (Max 2MB)
                                </div>
                              </div>
                            )}
                            
                            
                            <div className="flex gap-2">
                              {!uploadedSignature ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => document.getElementById('signature-upload')?.click()}
                                  className="flex items-center gap-2"
                                >
                                  <FileText className="w-4 h-4" />
                                  Choose File
                                </Button>
                              ) : (
                                <>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => document.getElementById('signature-upload')?.click()}
                                    className="flex items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Change File
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={clearUploadedSignature}
                                    className="flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Remove
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Save Draft
                      </Button>
                      <Button 
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                        disabled={!digitalSignature && !uploadedSignature}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Submit Appraisal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Navigation Buttons */}
            <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Previous
                  </Button>
                  
                  <div className="text-sm text-slate-600">
                    Step {currentStep} of {steps.length}
                  </div>
                  
                  <Button 
                    onClick={nextStep}
                    disabled={currentStep === steps.length}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default DirectorMyAppraisal;


