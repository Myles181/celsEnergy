import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Shield, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { validateSession, requestCredentialOtp, updateAdminCredentials } from "@/lib/admin-server";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type FieldState = {
  value: string;
  confirm: string;
  otp: string;
  sessionId: string;
  stage: "idle" | "otp_sent" | "done";
  loading: boolean;
  error: string;
};

const initField = (): FieldState => ({
  value: "", confirm: "", otp: "", sessionId: "",
  stage: "idle", loading: false, error: "",
});

function AdminSettings() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState<FieldState>(initField());
  const [password, setPassword] = useState<FieldState>(initField());

  useEffect(() => {
    const saved = sessionStorage.getItem("cels_admin_token");
    if (!saved) { navigate({ to: "/admin" }); return; }
    validateSession({ data: { token: saved } }).then(({ valid }) => {
      if (!valid) { navigate({ to: "/admin" }); return; }
      setToken(saved);
      setAuthed(true);
    });
  }, [navigate]);

  async function sendOtp(field: "username" | "password") {
    const set = field === "username" ? setUsername : setPassword;
    const state = field === "username" ? username : password;

    if (field === "password" && state.value !== state.confirm) {
      set((s) => ({ ...s, error: "Passwords do not match" }));
      return;
    }
    if (state.value.length < 4) {
      set((s) => ({ ...s, error: "Must be at least 4 characters" }));
      return;
    }

    set((s) => ({ ...s, loading: true, error: "" }));
    try {
      const purpose = field === "username" ? "update_username" : "update_password";
      const { sessionId } = await requestCredentialOtp({ data: { token, purpose } });
      set((s) => ({ ...s, sessionId, stage: "otp_sent", loading: false }));
    } catch (err: unknown) {
      set((s) => ({ ...s, error: err instanceof Error ? err.message : "Failed to send OTP", loading: false }));
    }
  }

  async function confirmChange(field: "username" | "password") {
    const set = field === "username" ? setUsername : setPassword;
    const state = field === "username" ? username : password;

    set((s) => ({ ...s, loading: true, error: "" }));
    try {
      await updateAdminCredentials({
        data: {
          token,
          sessionId: state.sessionId,
          otp: state.otp,
          field,
          value: state.value,
        },
      });
      set((s) => ({ ...s, stage: "done", loading: false }));
    } catch (err: unknown) {
      set((s) => ({ ...s, error: err instanceof Error ? err.message : "Update failed", loading: false }));
    }
  }

  if (!authed) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Checking session…</p></div>;
  }

  const renderField = (
    field: "username" | "password",
    state: FieldState,
    set: React.Dispatch<React.SetStateAction<FieldState>>
  ) => {
    const isPass = field === "password";
    const label = isPass ? "New Password" : "New Username";

    if (state.stage === "done") {
      return (
        <div className="flex items-center gap-2 text-brand-green">
          <Check className="h-5 w-5" />
          <span className="font-medium">{isPass ? "Password" : "Username"} updated successfully</span>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label>{label}</Label>
          <Input
            type={isPass ? "password" : "text"}
            value={state.value}
            onChange={(e) => set((s) => ({ ...s, value: e.target.value }))}
            placeholder={isPass ? "New password" : "New username"}
            disabled={state.stage === "otp_sent"}
          />
        </div>
        {isPass && (
          <div className="space-y-1.5">
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={state.confirm}
              onChange={(e) => set((s) => ({ ...s, confirm: e.target.value }))}
              placeholder="Confirm new password"
              disabled={state.stage === "otp_sent"}
            />
          </div>
        )}
        {state.stage === "otp_sent" && (
          <div className="space-y-1.5">
            <Label>One-time code</Label>
            <p className="text-xs text-muted-foreground">Check info@celsenergy.com for your OTP</p>
            <Input
              value={state.otp}
              onChange={(e) => set((s) => ({ ...s, otp: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
              inputMode="numeric"
              placeholder="000000"
              className="text-center tracking-widest"
            />
          </div>
        )}
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button
          onClick={() => state.stage === "idle" ? sendOtp(field) : confirmChange(field)}
          disabled={state.loading}
          className="bg-brand-green text-white hover:bg-brand-green/90"
        >
          {state.loading
            ? "Please wait…"
            : state.stage === "idle"
            ? "Send OTP to verify"
            : "Confirm change"}
        </Button>
        {state.stage === "otp_sent" && (
          <button
            type="button"
            onClick={() => set(initField())}
            className="block text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-3 px-4 sm:px-6">
          <Shield className="h-5 w-5 text-brand-green" />
          <span className="font-semibold">CELS Admin — Settings</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin" })} className="gap-1.5 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to config
        </Button>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Change Username</CardTitle>
            <p className="text-sm text-muted-foreground">An OTP will be sent to info@celsenergy.com to confirm.</p>
          </CardHeader>
          <CardContent>
            {renderField("username", username, setUsername)}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Change Password</CardTitle>
            <p className="text-sm text-muted-foreground">An OTP will be sent to info@celsenergy.com to confirm.</p>
          </CardHeader>
          <CardContent>
            {renderField("password", password, setPassword)}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
