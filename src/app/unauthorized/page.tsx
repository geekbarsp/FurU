import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="page auth-page">
      <div className="shell">
        <div className="form-card success-state">
          <ShieldAlert size={58} />
          <h2>This workspace is not available for your role.</h2>
          <p>
            Use your dashboard for the actions assigned to your account. Welfare
            organization tools become available after verification.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Return to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
