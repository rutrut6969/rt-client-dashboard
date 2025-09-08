import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { ClientStatus } from "@prisma/client"

function statusColor(s: ClientStatus) {
  switch (s) {
    case "NEW": return "background:#E1E3E8"
    case "CONTACTED": return "background:#cfe8ff"
    case "INTERESTED": return "background:#d7ffe3"
    case "FOLLOW_UP": return "background:#fff3cd"
    case "IN_DISCUSSION": return "background:#e7d7ff"
    case "WON": return "background:#d1ffe2"
    case "LOST": return "background:#ffd7d7"
    case "ON_HOLD": return "background:#f3f3f3"
  }
}

export default async function ClientsPage({ searchParams }: { searchParams: { q?: string, status?: string } }) {
  await auth()
  const q = searchParams.q || ""
  const status = searchParams.status as ClientStatus | undefined
  const where: any = {}
  if (q) {
    where.OR = [
      { businessName: { contains: q, mode: "insensitive" } },
      { contactName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } }
    ]
  }
  if (status) where.status = status

  const clients = await prisma.client.findMany({ where, orderBy: { updatedAt: "desc" }, take: 100 })

  return (
    <div className="card">
      <div className="header-row">
        <h2>Clients</h2>
        <Link className="btn" href="/clients/new">+ New</Link>
      </div>

      <form className="searchrow">
        <input className="input" name="q" placeholder="Search by name, contact, email..." defaultValue={q} />
        <select name="status" defaultValue={status || ""}>
          <option value="">All statuses</option>
          {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn secondary" type="submit">Filter</button>
      </form>

      <table className="table">
        <thead>
          <tr><th>Business</th><th>Contact</th><th>Status</th><th>Last Contact</th><th>Next Follow-up</th></tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td><Link href={`/clients/${c.id}`}>{c.businessName}</Link><br/><small className="mono">{c.websiteUrl || ""}</small></td>
              <td>{c.contactName || "-"}<br/><small className="mono">{c.email || ""} {c.phone ? " • " + c.phone : ""}</small></td>
              <td><span className="badge" style={{padding:'4px 10px', ...(statusColor(c.status) as any)}}>{c.status}</span></td>
              <td>{c.lastContactedAt ? new Date(c.lastContactedAt).toLocaleDateString() : "-"}</td>
              <td>{c.nextFollowUpAt ? new Date(c.nextFollowUpAt).toLocaleDateString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
