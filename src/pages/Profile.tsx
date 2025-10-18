import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from '@/components/PageHeader';
import { Badge } from "@/components/ui/badge";
import { Building, Briefcase, Calendar, IdCard, User, ShieldCheck, Phone, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/utils/toast";
import apiService from "@/services/api";

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name ?? "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileExtra, setProfileExtra] = useState<{
    orgUnit?: string;
    cadre?: string;
    gradeLevel?: string;
    roles?: string[];
    lastLoginDate?: string;
    phone?: string;
    designation?: string;
    position?: string;
    staffId?: string;
  }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiService.getProfile();
        if (res.success && res.data) {
          const data = res.data as any;
          setProfileExtra({
            orgUnit: data.orgUnit,
            cadre: data.cadre,
            gradeLevel: data.gradeLevel,
            roles: data.roles,
            lastLoginDate: data.lastLoginDate,
            phone: data.phoneNumber,
            designation: data.designation,
            position: data.post,
            staffId: data.staffId,
          });
          
          // Parse first and last name from full name
          const fullName = data.name || "";
          const nameParts = fullName.split(" ");
          setFirstName(nameParts[0] || "");
          setLastName(nameParts.slice(1).join(" ") || "");
        }
      } catch (e) {
      }
    };
    fetchProfile();
  }, []);

  // Mocked post history until backend is wired
  const postHistory = [
    {
      id: 'cur',
      post: user?.role === 'DIRECTOR' ? 'Director of Research' : 'HR Administrator',
      department: user?.role === 'DIRECTOR' ? 'Research & Development' : 'Human Resources',
      startDate: 'Jan 2024',
      endDate: 'Present',
      current: true,
    },
    {
      id: 'prev1',
      post: user?.role === 'DIRECTOR' ? 'Deputy Director' : 'Senior HR Officer',
      department: user?.role === 'DIRECTOR' ? 'Research & Development' : 'Human Resources',
      startDate: 'Jan 2022',
      endDate: 'Dec 2023',
      current: false,
    },
    {
      id: 'prev2',
      post: user?.role === 'DIRECTOR' ? 'Senior Research Officer' : 'HR Officer',
      department: user?.role === 'DIRECTOR' ? 'Research & Development' : 'Human Resources',
      startDate: 'Jan 2020',
      endDate: 'Dec 2021',
      current: false,
    },
  ];

  return (
    <Layout>
      <div className="page-container">
        <PageHeader title="My Profile" subtitle="View and manage your account details." />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* Left Column: Account + Post History */}
        <div className="space-y-6 xl:col-span-2">
          <Card className="card-base">
            <CardHeader>
              <CardTitle className="text-foreground">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-body-small font-semibold text-foreground">First Name</Label>
                  <Input 
                    id="firstName"
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    placeholder="Enter your first name"
                    className="focus-visible"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-body-small font-semibold text-foreground">Last Name</Label>
                  <Input 
                    id="lastName"
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    placeholder="Enter your last name"
                    className="focus-visible"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-body-small font-semibold text-foreground">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={profileExtra.phone || ''} 
                    onChange={(e) => setProfileExtra(prev => ({ ...prev, phone: e.target.value }))} 
                    placeholder="Enter your phone number"
                    className="focus-visible"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-body-small font-semibold text-foreground">Designation</Label>
                  <Input 
                    id="designation"
                    value={profileExtra.designation || ''} 
                    onChange={(e) => setProfileExtra(prev => ({ ...prev, designation: e.target.value }))} 
                    placeholder="Enter your designation"
                    className="focus-visible"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-body-small font-semibold text-foreground">Post/Position</Label>
                  <Input 
                    id="position"
                    value={profileExtra.position || ''} 
                    onChange={(e) => setProfileExtra(prev => ({ ...prev, position: e.target.value }))} 
                    placeholder="Enter your post/position"
                    className="focus-visible"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffId" className="text-body-small font-semibold text-foreground">Staff ID</Label>
                  <Input 
                    id="staffId"
                    value={profileExtra.staffId || ''} 
                    onChange={(e) => setProfileExtra(prev => ({ ...prev, staffId: e.target.value }))} 
                    placeholder="Enter your staff ID"
                    className="focus-visible"
                  />
                </div>
                <div>
                  <div className="text-body-small text-muted-foreground">Role</div>
                  <div className="text-foreground">{user?.role ?? '—'}</div>
                </div>
                <div>
                  <div className="text-body-small text-muted-foreground">Organization Unit</div>
                  <div className="text-foreground flex items-center gap-2"><Building className="h-4 w-4" /> {profileExtra.orgUnit ?? '—'}</div>
                </div>
                <div>
                  <div className="text-body-small text-muted-foreground">Cadre</div>
                  <div className="text-foreground flex items-center gap-2"><User className="h-4 w-4" /> {profileExtra.cadre ?? '—'}</div>
                </div>
                <div>
                  <div className="text-body-small text-muted-foreground">Grade Level</div>
                  <div className="text-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {profileExtra.gradeLevel ?? '—'}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-body-small text-muted-foreground">Roles</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(profileExtra.roles ?? []).length > 0 ? (
                      profileExtra.roles!.map((r) => (
                        <Badge key={r} className="badge-info">{r}</Badge>
                      ))
                    ) : (
                      <span className="text-body-small text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-body-small text-muted-foreground">Last Login</div>
                  <div className="text-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> {profileExtra.lastLoginDate ? new Date(profileExtra.lastLoginDate).toLocaleString() : '—'}</div>
                </div>
              </div>
              <div>
                <Button
                  onClick={() => {
                    if (!firstName.trim() || !lastName.trim()) { 
                      toast.error('First name and last name cannot be empty'); 
                      return; 
                    }
                    const fullName = `${firstName.trim()} ${lastName.trim()}`;
                    updateUser({ name: fullName });
                    toast.success('Profile updated successfully');
                  }}
                  className="focus-visible"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

            <Card className="card-base">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                  Post History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />
                  <div className="space-y-6">
                    {postHistory.map((entry) => (
                      <div key={entry.id} className="relative pl-10">
                        <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full ring-4 ring-background bg-emerald-600" />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="text-foreground font-medium flex items-center gap-2">
                              {entry.post}
                              {entry.current && (
                                <Badge className="badge-success">Current</Badge>
                              )}
                            </div>
                            <div className="text-body-small text-muted-foreground flex items-center gap-2 mt-1">
                              <Building className="h-4 w-4" /> {entry.department}
                            </div>
                          </div>
                          <div className="text-body-small text-muted-foreground flex items-center gap-2 mt-2 sm:mt-0">
                            <Calendar className="h-4 w-4" /> {entry.startDate} — {entry.endDate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Change Password (sticky) */}
          <div className="xl:col-span-1 space-y-6 xl:sticky xl:top-4">
            <Card className="card-base">
              <CardHeader>
                <CardTitle className="text-foreground">Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-5"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // client-side validation only
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      toast.error("Please fill in all fields");
                      return;
                    }
                    if (newPassword.length < 6) {
                      toast.error("New password must be at least 6 characters");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast.error("Passwords do not match");
                      return;
                    }
                    setIsSubmitting(true);
                    try {
                      // TODO: replace with API call
                      await new Promise((res) => setTimeout(res, 800));
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      toast.success("Password updated successfully");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-body-small font-semibold text-foreground">Current password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="focus-visible"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-body-small font-semibold text-foreground">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="focus-visible"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-body-small font-semibold text-foreground">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="focus-visible"
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" disabled={isSubmitting} className="w-full focus-visible">
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
