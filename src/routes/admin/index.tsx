import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Shield, LogOut, Settings, Save, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  adminLogin,
  adminVerifyOtp,
  validateSession,
  getAdminSolarConfig,
  updateSolarConfig,
} from "@/lib/admin-server";
import type { SolarConfig, HybridInverter, LithiumBattery } from "@/lib/solar-config";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

type Step = "login" | "otp" | "dashboard";
type TabId = "formula" | "tiers" | "inverters" | "batteries";

function AdminPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("login");
  const [token, setToken] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("formula");
  const [config, setConfig] = useState<SolarConfig | null>(null);
  const [showPass, setShowPass] = useState(false);

  // Login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("cels_admin_token");
    if (!saved) return;
    validateSession({ data: { token: saved } }).then(({ valid }) => {
      if (valid) {
        setToken(saved);
        setStep("dashboard");
        loadConfig(saved);
      } else {
        sessionStorage.removeItem("cels_admin_token");
      }
    });
  }, []);

  async function loadConfig(t: string) {
    const cfg = await getAdminSolarConfig({ data: { token: t } });
    setConfig(cfg);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { sessionId: sid } = await adminLogin({ data: { username, password } });
      setSessionId(sid);
      setStep("otp");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { token: t } = await adminVerifyOtp({ data: { sessionId, otp } });
      sessionStorage.setItem("cels_admin_token", t);
      setToken(t);
      setStep("dashboard");
      loadConfig(t);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("cels_admin_token");
    setToken("");
    setStep("login");
    setUsername("");
    setPassword("");
    setOtp("");
  }

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await updateSolarConfig({ data: { token, config } });
      setSaveMsg("Saved successfully");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err: unknown) {
      setSaveMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // ── Login screen ──────────────────────────────────────────────────────────
  if (step === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-green-light/30 px-4">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
              <Shield className="h-6 w-6 text-brand-green" />
            </div>
            <CardTitle className="text-xl">Admin Portal</CardTitle>
            <p className="text-sm text-muted-foreground">CELS Energy Limited</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-brand-green text-white hover:bg-brand-green/90" disabled={submitting}>
                {submitting ? "Verifying…" : "Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── OTP screen ────────────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-green-light/30 px-4">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/10">
              <Shield className="h-6 w-6 text-brand-green" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <p className="text-sm text-muted-foreground">
              A 6-digit code was sent to the admin email. Enter it below.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp">One-time code</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  placeholder="000000"
                  className="text-center text-xl tracking-widest"
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full bg-brand-green text-white hover:bg-brand-green/90" disabled={submitting}>
                {submitting ? "Verifying…" : "Verify"}
              </Button>
              <button type="button" onClick={() => setStep("login")} className="w-full text-sm text-muted-foreground hover:text-foreground">
                Back to login
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading config…</p>
      </div>
    );
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "formula", label: "Formula" },
    { id: "tiers", label: "Tiers" },
    { id: "inverters", label: "Inverters" },
    { id: "batteries", label: "Batteries" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-brand-green" />
            <span className="font-semibold">CELS Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/admin/settings" })}
              className="gap-1.5"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5 text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Solar Config</h1>
            <p className="text-sm text-muted-foreground">Changes affect all calculator recommendations immediately on save.</p>
          </div>
          <div className="flex items-center gap-3">
            {saveMsg && (
              <span className={cn("text-sm", saveMsg.includes("uccess") ? "text-brand-green" : "text-destructive")}>
                {saveMsg}
              </span>
            )}
            <Button onClick={handleSave} disabled={saving} className="bg-brand-green text-white hover:bg-brand-green/90 gap-1.5">
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-border/60 bg-muted/40 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                activeTab === t.id
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Formula tab */}
        {activeTab === "formula" && (
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { key: "lossFactor", label: "Loss Factor", hint: "System losses (wiring, heat). Default: 1.3", min: 1.0, max: 1.8, step: 0.05 },
              { key: "inverterDerating", label: "Inverter Derating", hint: "Safe operating capacity. Default: 0.8 (80%)", min: 0.5, max: 1.0, step: 0.05 },
              { key: "inverterHeadroom", label: "Inverter Headroom", hint: "Safety buffer on top. Default: 1.25 (25%)", min: 1.0, max: 2.0, step: 0.05 },
              { key: "batteryDod", label: "Battery DoD", hint: "Usable battery depth. Default: 0.85 (85%)", min: 0.5, max: 1.0, step: 0.05 },
              { key: "panelEfficiency", label: "Panel Efficiency", hint: "Dust/shade losses. Default: 0.85 (85%)", min: 0.5, max: 1.0, step: 0.05 },
              { key: "peakSunHours", label: "Peak Sun Hours", hint: "Daily solar hours (Nigeria avg: 5)", min: 2, max: 8, step: 0.5 },
              { key: "defaultPanelWatts", label: "Default Panel Watts", hint: "Panel wattage used in calculations", min: 100, max: 800, step: 10 },
            ].map(({ key, label, hint, min, max, step }) => (
              <Card key={key} className="border-border/60">
                <CardContent className="p-4">
                  <Label className="text-sm font-semibold">{label}</Label>
                  <p className="mb-3 mt-0.5 text-xs text-muted-foreground">{hint}</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={config[key as keyof SolarConfig] as number}
                      onChange={(e) =>
                        setConfig((c) => c && ({ ...c, [key]: parseFloat(e.target.value) }))
                      }
                      className="flex-1 accent-brand-green"
                    />
                    <Input
                      type="number"
                      min={min}
                      max={max}
                      step={step}
                      value={config[key as keyof SolarConfig] as number}
                      onChange={(e) =>
                        setConfig((c) => c && ({ ...c, [key]: parseFloat(e.target.value) }))
                      }
                      className="w-20 text-center text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-border/60">
              <CardContent className="p-4">
                <Label className="text-sm font-semibold">Minimum Inverter Index</Label>
                <p className="mb-3 mt-0.5 text-xs text-muted-foreground">Never recommend below this inverter (0 = no minimum)</p>
                <select
                  value={config.minInverterIndex}
                  onChange={(e) => setConfig((c) => c && ({ ...c, minInverterIndex: parseInt(e.target.value) }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {config.hybridInverters.map((inv, i) => (
                    <option key={i} value={i}>{i}: {inv.model}</option>
                  ))}
                </select>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tiers tab */}
        {activeTab === "tiers" && (
          <div className="grid gap-5 md:grid-cols-3">
            {(["economy", "standard", "premium"] as const).map((tier) => (
              <Card key={tier} className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base capitalize">{tier}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "batteryMult", label: "Battery Multiplier", hint: "× base battery kWh", step: 0.1 },
                    { key: "extraPanels", label: "Extra Panels", hint: "Panels added above base count", step: 1 },
                    { key: "invSteps", label: "Inverter Steps Up", hint: "Steps above minimum inverter", step: 1 },
                  ].map(({ key, label, hint, step }) => (
                    <div key={key}>
                      <Label className="text-sm">{label}</Label>
                      <p className="mb-1 text-xs text-muted-foreground">{hint}</p>
                      <Input
                        type="number"
                        step={step}
                        min={0}
                        value={config.tiers[tier][key as keyof typeof config.tiers.economy]}
                        onChange={(e) =>
                          setConfig((c) =>
                            c && ({
                              ...c,
                              tiers: {
                                ...c.tiers,
                                [tier]: {
                                  ...c.tiers[tier],
                                  [key]: parseFloat(e.target.value),
                                },
                              },
                            })
                          )
                        }
                        className="text-sm"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Inverters tab */}
        {activeTab === "inverters" && (
          <div className="space-y-3">
            <div className="hidden grid-cols-[1fr_80px_80px_100px_44px] gap-2 px-2 text-xs font-semibold text-muted-foreground sm:grid">
              <span>Model name</span><span>kVA</span><span>Voltage</span><span>Max Watts</span><span />
            </div>
            {config.hybridInverters.map((inv, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-border/60 p-3 sm:grid-cols-[1fr_80px_80px_100px_44px] sm:items-center sm:p-2">
                <Input
                  value={inv.model}
                  onChange={(e) => {
                    const updated = [...config.hybridInverters];
                    updated[i] = { ...inv, model: e.target.value };
                    setConfig((c) => c && ({ ...c, hybridInverters: updated }));
                  }}
                  className="text-sm"
                  placeholder="Model name"
                />
                <Input type="number" step={0.1} min={0} value={inv.kva}
                  onChange={(e) => {
                    const updated = [...config.hybridInverters];
                    updated[i] = { ...inv, kva: parseFloat(e.target.value) };
                    setConfig((c) => c && ({ ...c, hybridInverters: updated }));
                  }} className="text-sm" placeholder="kVA" />
                <select value={inv.voltage}
                  onChange={(e) => {
                    const updated = [...config.hybridInverters];
                    updated[i] = { ...inv, voltage: parseInt(e.target.value) };
                    setConfig((c) => c && ({ ...c, hybridInverters: updated }));
                  }}
                  className="rounded-md border border-input bg-background px-2 py-2 text-sm">
                  <option value={12}>12V</option>
                  <option value={24}>24V</option>
                  <option value={48}>48V</option>
                </select>
                <Input type="number" step={100} min={0} value={inv.maxWatts}
                  onChange={(e) => {
                    const updated = [...config.hybridInverters];
                    updated[i] = { ...inv, maxWatts: parseInt(e.target.value) };
                    setConfig((c) => c && ({ ...c, hybridInverters: updated }));
                  }} className="text-sm" placeholder="Max W" />
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                  onClick={() => setConfig((c) => c && ({ ...c, hybridInverters: c.hybridInverters.filter((_, idx) => idx !== i) }))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-1.5"
              onClick={() => setConfig((c) => c && ({ ...c, hybridInverters: [...c.hybridInverters, { model: "", kva: 0, voltage: 48, maxWatts: 0 } as HybridInverter] }))}>
              <Plus className="h-4 w-4" /> Add inverter
            </Button>
          </div>
        )}

        {/* Batteries tab */}
        {activeTab === "batteries" && (
          <div className="space-y-3">
            <div className="hidden grid-cols-[1fr_80px_80px_44px] gap-2 px-2 text-xs font-semibold text-muted-foreground sm:grid">
              <span>Model name</span><span>kWh</span><span>Voltage</span><span />
            </div>
            {config.lithiumBatteries.map((bat, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-border/60 p-3 sm:grid-cols-[1fr_80px_80px_44px] sm:items-center sm:p-2">
                <Input value={bat.model}
                  onChange={(e) => {
                    const updated = [...config.lithiumBatteries];
                    updated[i] = { ...bat, model: e.target.value };
                    setConfig((c) => c && ({ ...c, lithiumBatteries: updated }));
                  }} className="text-sm" placeholder="Model name" />
                <Input type="number" step={0.1} min={0} value={bat.kwh}
                  onChange={(e) => {
                    const updated = [...config.lithiumBatteries];
                    updated[i] = { ...bat, kwh: parseFloat(e.target.value) };
                    setConfig((c) => c && ({ ...c, lithiumBatteries: updated }));
                  }} className="text-sm" placeholder="kWh" />
                <select value={bat.voltage}
                  onChange={(e) => {
                    const updated = [...config.lithiumBatteries];
                    updated[i] = { ...bat, voltage: parseInt(e.target.value) };
                    setConfig((c) => c && ({ ...c, lithiumBatteries: updated }));
                  }}
                  className="rounded-md border border-input bg-background px-2 py-2 text-sm">
                  <option value={12}>12V</option>
                  <option value={24}>24V</option>
                  <option value={48}>48V</option>
                </select>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"
                  onClick={() => setConfig((c) => c && ({ ...c, lithiumBatteries: c.lithiumBatteries.filter((_, idx) => idx !== i) }))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-1.5"
              onClick={() => setConfig((c) => c && ({ ...c, lithiumBatteries: [...c.lithiumBatteries, { model: "", kwh: 0, voltage: 48 } as LithiumBattery] }))}>
              <Plus className="h-4 w-4" /> Add battery
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
