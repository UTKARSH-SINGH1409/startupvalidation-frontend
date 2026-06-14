import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Zap } from "lucide-react";

// Helper to decode JWT claims
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;

      // Save token and credentials
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);

      // Decipher name from JWT if possible
      const decoded = parseJwt(token);
      if (decoded) {
        const name = decoded.name || decoded.sub || "Founder";
        localStorage.setItem("userName", name);
      } else {
        localStorage.setItem("userName", "Founder");
      }

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* LEFT IMAGE / BRAND BANNER */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200"
          alt="Startup Brainstorming"
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/60 to-transparent flex items-center justify-center p-12">
          <div className="text-white max-w-lg">
            <h1 className="text-5xl font-black tracking-tight leading-none mb-6 font-heading">
              StartupIQ
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Validate your startup hypotheses instantly. Access data-driven evaluation for market readiness, competitor threats, and mitigation strategies.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 pb-2">
            <h2 className="text-3xl font-extrabold text-foreground font-heading">
              Welcome Back
            </h2>
            <p className="text-muted-foreground">
              Login to validate and manage your startup ideas.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-2" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm font-medium text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-bold transition-colors"
              >
                Register for free
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}