import "./globals.css"
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="brand"><Link href="/">Rutledge Tech • Dashboard</Link></div>
          <div className="links">
            {session ? (
              <>
                <Link href="/clients">Clients</Link>
                <Link href="/clients/new">New Client</Link>
                <form action={async () => { 'use server'; await signOut(); }}>
                  <button type="submit">Sign out</button>
                </form>
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
