import { signIn } from "@/lib/auth"

export default function LoginPage() {
  async function action(data: FormData) {
    'use server'
    const email = data.get('email')?.toString() || ''
    const password = data.get('password')?.toString() || ''
    await signIn('credentials', { redirectTo: '/clients', email, password })
  }

  return (
    <div className="card" style={{maxWidth:420, margin:"60px auto"}}>
      <h2>Sign in</h2>
      <form action={action}>
        <input className="input" name="email" type="email" placeholder="you@rutledgetechnologies.com" required />
        <input className="input" name="password" type="password" placeholder="••••••••" required />
        <button className="btn" type="submit">Sign in</button>
      </form>
      <p><small className="mono">First run? Use the seeded admin in README.</small></p>
    </div>
  )
}
