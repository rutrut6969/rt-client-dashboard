import Link from "next/link"

export default function Home() {
  return (
    <div className="card">
      <h2>Welcome to the Rutledge Client Dashboard</h2>
      <p>Track leads, clients, and project scopes — fast.</p>
      <div style={{display:'flex', gap:12}}>
        <Link className="btn" href="/clients">View Clients</Link>
        <Link className="btn secondary" href="/clients/new">Add Client</Link>
      </div>
    </div>
  )
}
