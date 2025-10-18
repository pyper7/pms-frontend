import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 10 minutes in ms
const IDLE_LIMIT_MS = 10 * 60 * 1000;
// Check timer cadence
const CHECK_INTERVAL_MS = 15 * 1000;

function decodeJwtExpiration(token: string | null): number | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.exp === "number") {
      return payload.exp * 1000; // ms
    }
    return null;
  } catch {
    return null;
  }
}

const IdleTimeout: React.FC = () => {
  const { logout } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const lastActiveRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  const token = useMemo(() => {
    try { return localStorage.getItem("auth_token"); } catch { return null; }
  }, []);
  const tokenExp = useMemo(() => decodeJwtExpiration(token), [token]);

  const markActive = useCallback(() => {
    lastActiveRef.current = Date.now();
    if (showDialog) setShowDialog(false);
  }, [showDialog]);

  // Attach activity listeners
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"]; 
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true } as any));
    return () => {
      events.forEach((e) => window.removeEventListener(e, markActive as any));
    };
  }, [markActive]);

  // Periodic checker
  useEffect(() => {
    const check = async () => {
      const now = Date.now();
      const idleMs = now - lastActiveRef.current;
      // If token is expired and user is currently idle beyond limit, auto logout
      if (tokenExp && now >= tokenExp && idleMs >= IDLE_LIMIT_MS) {
        await logout();
        return;
      }
      // Otherwise, show warning dialog if idle beyond limit
      if (idleMs >= IDLE_LIMIT_MS && !showDialog) {
        setShowDialog(true);
      }
    };
    // first tick
    check();
    timerRef.current = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [logout, tokenExp, showDialog]);

  const handleContinue = () => {
    setShowDialog(false);
    lastActiveRef.current = Date.now();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you still there?</DialogTitle>
        </DialogHeader>
        <p className="text-slate-600 dark:text-slate-300">
          You've been inactive for a while. For your security, you'll be signed out soon.
        </p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleLogout}>Sign out</Button>
          <Button onClick={handleContinue}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IdleTimeout;


