import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ClipboardCheck, 
  Users, 
  Target, 
  BarChart3, 
  FileText, 
  Bell,
  ArrowRight,
  Shield,
  Building,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Landing = () => {
  const features = [
    {
      icon: <ClipboardCheck className="h-8 w-8" />,
      title: "Performance Contracting",
      description: "Set and track performance contracts with clear KRAs and objectives aligned with TETFund standards"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Appraisals",
      description: "AI-powered performance appraisal system with intelligent workflow management and predictive insights"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Dynamic KRAs/KPIs",
      description: "Real-time tracking of Key Result Areas and Performance Indicators with automated benchmarking"
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Organizational Excellence",
      description: "Advanced hierarchy management with role-based access and intelligent post assignments"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Intelligent Analytics",
      description: "AI-driven performance reports with predictive analytics and actionable insights"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "System Alerts",
      description: "Real-time system alerts and important updates for maximum efficiency"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Staff Receives Login",
      description: "New staff members receive secure login credentials"
    },
    {
      step: "2", 
      title: "Sets Goals",
      description: "Staff sets performance goals and objectives for the period"
    },
    {
      step: "3",
      title: "Supervisor Reviews",
      description: "Direct supervisor reviews and provides feedback"
    },
    {
      step: "4",
      title: "Director Approves",
      description: "Department director provides final approval"
    },
    {
      step: "5",
      title: "Reports Generated",
      description: "System generates comprehensive performance reports"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative bg-grid">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/pms/tetfund-logo.jpg" alt="TETFund" className="h-10 w-auto object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/favicon.ico"; }} />
              <div>
                <h1 className="text-2xl font-bold">TETFund PMS</h1>
                <p className="text-sm text-muted-foreground font-medium">Driving Excellence through Performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section (split left/right) */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            {/* Left: professional info */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-full px-6 py-2 mb-8">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary">TETFund Performance Management Initiative</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
                TetFund Performance
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Management System</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                Align goals, track KRAs/KPIs, run appraisals, and get evidence-based insights across TETFund.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="px-7 py-4 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ boxShadow: 'var(--shadow-elegant)' }}>
                    Access Dashboard
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="px-7 py-4 text-base font-semibold border-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 dark:border-primary/50 dark:hover:bg-primary/10 dark:hover:border-primary/70">
                    Login
                  </Button>
                </Link>
                <a href="#about">
                  <Button variant="outline" size="lg" className="px-7 py-4 text-base font-semibold border-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 dark:border-primary/50 dark:hover:bg-primary/10 dark:hover:border-primary/70">
                    Learn more
                  </Button>
                </a>               
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
                {[{label: 'Departments', value: '12+'},{label:'Staff onboarded', value:'1,200+'},{label:'KPIs tracked', value:'5,000+'}].map((s,i)=> (
                  <div key={i} className="rounded-lg bg-card/70 dark:bg-card/50 backdrop-blur border border-primary/10 dark:border-primary/20 p-4 text-center shadow-sm dark:shadow-md">
                    <div className="text-2xl font-semibold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: dashboard screenshot */}
            <div className="relative">
              <div className="rounded-2xl border border-primary/20 bg-white dark:bg-gray-900 overflow-hidden shadow-2xl animate-float-slow relative">
                {/* Browser Chrome */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-4 py-3 flex items-center justify-between border-b border-gray-300 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white dark:bg-gray-600 rounded-md px-3 py-1 text-xs text-gray-600 dark:text-gray-300 text-center">
                      PMS Dashboard - tetfund.gov.ng
                    </div>
                  </div>
                  <div className="w-6"></div>
                </div>
                
                {/* Dashboard Preview - Try image first, fallback to mockup */}
                <div className="w-full h-[420px] relative">
                  {/* Try to load actual dashboard image */}
                    <img
                      src="/pms/dashboard-shot.jpg"
                    alt="TETFund PMS Dashboard Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide image and show mockup on error
                      (e.target as HTMLImageElement).style.display = 'none';
                      const mockup = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (mockup) mockup.style.display = 'block';
                    }}
                  />
                  
                  {/* Fallback mockup - hidden by default */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden" style={{ display: 'none' }}>
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">P</span>
                          </div>
                          <div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-1"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                      </div>
                      
                      {/* Metrics Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-1"></div>
                              <div className="h-2 bg-green-200 dark:bg-green-800 rounded w-12"></div>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <div className="w-6 h-6 bg-blue-500 rounded"></div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12 mb-1"></div>
                              <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded w-16"></div>
                            </div>
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <div className="w-6 h-6 bg-green-500 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-3"></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </div>
                          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </div>
                          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </div>
                          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Recent Activities */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-28 mb-3"></div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-28"></div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-36"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner/Mandate Badges */}
      <section className="py-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground font-medium">Aligned with TETFund Strategic Objectives</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-80">
            <div className="flex items-center space-x-2 bg-card/70 backdrop-blur rounded-lg px-4 py-2 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">TETFund Management Board</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/70 backdrop-blur rounded-lg px-4 py-2 border border-primary/20">
              <Building className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">TETFund Executive Secretary</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/70 backdrop-blur rounded-lg px-4 py-2 border border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Performance Management Office</span>
            </div>
            <div className="flex items-center space-x-2 bg-card/70 backdrop-blur rounded-lg px-4 py-2 border border-primary/20">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Public Service Reforms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip band */}
      <section className="relative border-y bg-primary/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 py-8 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{h:"Performance Contracting", p:"Goals aligned to mandates"},{h:"Reviews & Approvals", p:"Multi-step workflow"},{h:"Analytics", p:"Evidence-based insights"}].map((item, i) => (
            <div key={i} className="rounded-xl border bg-card/70 backdrop-blur p-5 shadow-sm">
              <div className="font-semibold text-foreground">{item.h}</div>
              <div className="text-sm text-muted-foreground">{item.p}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About PMS */}
      <section id="about" className="py-32 relative">
        <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"radial-gradient(ellipse at 80% 30%, rgba(16,185,129,0.08), transparent 50%)"}}></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-20">
            <div className="inline-block p-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full mb-6">
              <div className="bg-card px-6 py-2 rounded-full">
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">About PMS</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Revolutionizing TETFund 
              <span className="text-primary"> Performance Management</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-4">
              Our next-generation Performance Management System seamlessly integrates with TETFund strategic objectives, 
              delivering unprecedented levels of accountability, transparency, and performance excellence.
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-3xl mx-auto">
              Built for the modern TETFund workforce with AI-powered insights and intelligent automation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group relative animate-fade-up">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="card-elegant dark:card-elegant-dark group-hover:transform group-hover:-translate-y-2 transition-all duration-500 group-hover:shadow-2xl">
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl w-fit">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold">Performance Excellence</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <p className="text-muted-foreground leading-relaxed">
                    Drive continuous improvement through AI-powered performance tracking, 
                    predictive analytics, and intelligent evaluation frameworks.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="group relative animate-fade-up-delay-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="card-elegant dark:card-elegant-dark group-hover:transform group-hover:-translate-y-2 transition-all duration-500 group-hover:shadow-2xl">
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl w-fit">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold">Total Transparency</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <p className="text-muted-foreground leading-relaxed">
                    Real-time visibility into performance metrics with blockchain-verified 
                    data integrity and comprehensive audit trails.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="group relative animate-fade-up-delay-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Card className="card-elegant dark:card-elegant-dark group-hover:transform group-hover:-translate-y-2 transition-all duration-500 group-hover:shadow-2xl">
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl w-fit">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold">Smart Accountability</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <p className="text-muted-foreground leading-relaxed">
                    Foster a culture of intelligent responsibility with automated 
                    workflows and AI-driven insights at every organizational level.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-32 relative bg-muted/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block p-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full mb-6">
              <div className="bg-card px-6 py-2 rounded-full">
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">Core Features</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Next-Generation 
              <span className="text-primary">Performance Tools</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Experience the future of performance management with our AI-powered suite of comprehensive tools
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
              Six powerful modules designed to transform how TETFund manages and tracks performance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className={`group relative ${index === 0 ? 'animate-fade-up' : index === 1 ? 'animate-fade-up-delay-1' : index === 2 ? 'animate-fade-up-delay-2' : index === 3 ? 'animate-fade-up-delay-3' : index === 4 ? 'animate-fade-up-delay-4' : 'animate-fade-up-delay-5'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Card className="card-elegant dark:card-elegant-dark h-full group-hover:transform group-hover:-translate-y-1 group-hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="pb-3 md:pb-4 px-4 md:px-6 pt-4 md:pt-6 relative z-10">
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 md:px-6 pb-4 md:pb-6 relative z-10">
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                    <div className="mt-3 md:mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-block p-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full mb-6">
              <div className="bg-card px-6 py-2 rounded-full">
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">How It Works</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Seamless 
              <span className="text-primary">Performance Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
              Experience our intelligent 5-step process designed for maximum efficiency and optimal results
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
              From initial setup to comprehensive reporting, every step is optimized for TETFund compliance.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative group mb-12 last:mb-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: 'var(--glow-primary)' }}>
                      {step.step}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-primary/20"></div>
                    )}
                  </div>
                  
                  <div className="flex-grow ml-8 p-6 bg-gradient-to-br from-card to-card/50 rounded-2xl border border-primary/10 group-hover:border-primary/30 transition-all duration-300 group-hover:transform group-hover:-translate-y-1">
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {step.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">View details</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your 
              <span className="text-primary">Performance Management?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Join TETFund departments already leveraging our advanced PMS for unprecedented efficiency and excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/signup">
                <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ boxShadow: 'var(--shadow-elegant)' }}>
                  Access System Now
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 backdrop-blur-sm transition-all duration-300">
                Download User Guide
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg font-semibold border-2 border-primary/30 hover:bg-primary/5 hover:border-primary/50 backdrop-blur-sm transition-all duration-300">
                Contact IT Support
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">TETFund Departments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Uptime Strip */}
      <section className="py-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-y border-primary/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Building className="h-4 w-4 text-primary" />
              <span className="font-medium">TETFund Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">24/7 Monitoring</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-medium">GDPR Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 text-white bg-gradient-to-br from-emerald-700 to-emerald-600">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage:"radial-gradient(600px 200px at 10% 20%, rgba(255,255,255,0.4), transparent), radial-gradient(400px 160px at 90% 80%, rgba(255,255,255,0.25), transparent)"}} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img src="/pms/tetfund-logo.jpg" alt="TETFund" className="h-10 w-auto object-contain bg-white rounded-sm p-1" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/favicon.ico'}} />
                <div>
                  <span className="text-xl font-bold">TETFund PMS</span>
                  <p className="text-sm text-white/80">Next-Gen Performance Management</p>
                </div>
              </div>
              <p className="text-white/85 leading-relaxed max-w-md mb-6">
                Empowering TETFund with performance contracting, appraisals, and analytics for evidence-based decisions.
              </p>
              <div className="flex items-center gap-4 text-white/85">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm">System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                  <span className="text-sm">Secure & Compliant</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">Quick Access</h4>
              <ul className="space-y-3 text-white/85">
                <li><Link to="/login" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><ArrowRight className="h-3 w-3" />System Login</Link></li>
                <li><a href="#about" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><ArrowRight className="h-3 w-3" />About PMS</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><ArrowRight className="h-3 w-3" />User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300 flex items-center gap-2"><ArrowRight className="h-3 w-3" />System Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Support & Legal</h4>
              <ul className="space-y-3 text-white/85">
                <li><a href="#" className="hover:text-white transition-colors duration-300">IT Support Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Security & Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="h-px w-full bg-white/20 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/85">
            <div className="flex items-center gap-6">
              <p>© {new Date().getFullYear()} TETFund PMS. All rights reserved.</p>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                <span>Built for TETFund Excellence</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span>Dark mode supported</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;