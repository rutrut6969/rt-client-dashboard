import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ClientStatus } from "@prisma/client";
import type { CSSProperties } from "react";

function statusStyle(s: ClientStatus): CSSProperties {
  switch (s) {
    case "NEW":
      return { backgroundColor: "#E1E3E8" };
    case "CONTACTED":
      return { backgroundColor: "#cfe8ff" };
    case "INTERESTED":
      return { backgroundColor: "#d7ffe3" };
    case "FOLLOW_UP":
      return { backgroundColor: "#fff3cd" };
    case "IN_DISCUSSION":
      return { backgroundColor: "#e7d7ff" };
    case "WON":
      return { backgroundColor: "#d1ffe2" };
    case "LOST":
      return { backgroundColor: "#ffd7d7" };
    case "ON_HOLD":
      return { backgroundColor: "#f3f3f3" };
  }
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  await auth();
  const q = searchParams.q || "";
  const status = searchParams.status as ClientStatus | undefined;
  const where: any = {};
  if (q) {
    where.OR = [
      { businessName: { contains: q, mode: "insensitive" } },
      { contactName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;

  const clients = await prisma.client.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div className="card">
      <div className="header-row">
        <h2>Clients</h2>
        <Link className="btn" href="/clients/new">
          + New
        </Link>
      </div>

      <form className="searchrow">
        <input
          className="input"
          name="q"
          placeholder="Search by name, contact, email..."
          defaultValue={q}
        />
        <select name="status" defaultValue={status || ""}>
          <option value="">All statuses</option>
          {Object.values(ClientStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="btn secondary" type="submit">
          Filter
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Business</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Last Contact</th>
            <th>Next Follow-up</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>
                <Link href={`/clients/${c.id}`}>{c.businessName}</Link>
                <br />
                <small className="mono">{c.websiteUrl || ""}</small>
              </td>
              <td>
                {c.contactName || "-"}
                <br />
                <small className="mono">
                  {c.email || ""} {c.phone ? " • " + c.phone : ""}
                </small>
              </td>
              <td>
                <span
                  className="badge"
                  style={{
                    padding: "4px 10px",
                    ...(statusStyle(c.status) as any),
                  }}
                >
                  {c.status}
                </span>
              </td>
              <td>
                {c.lastContactedAt
                  ? new Date(c.lastContactedAt).toLocaleDateString()
                  : "-"}
              </td>
              <td>
                {c.nextFollowUpAt
                  ? new Date(c.nextFollowUpAt).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
