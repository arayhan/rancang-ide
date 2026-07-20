import {
  signInWithGoogle,
  signInWithMagicLink,
} from "@/features/auth/infrastructure/auth-actions";
import { LoginForm } from "@/features/auth/presentation/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
          Rancang Ide
        </p>
        <h1 className="text-2xl font-semibold">Sign in to continue</h1>
        <p className="max-w-sm text-sm text-muted">
          Validate first, then build. Sign in to start turning ideas into blueprints.
        </p>
      </div>
      <LoginForm
        signInWithMagicLink={signInWithMagicLink}
        signInWithGoogle={signInWithGoogle}
      />
    </main>
  );
}
