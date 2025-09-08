import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ClientDetail({
  params,
}: {
  params: { id: string };
}) {
  const client = await prisma.client.findUnique({ where: { id: params.id } });
  if (!client) notFound();

  // ✅ From here on, use `c` (non-null)
  const c = client as NonNullable<typeof client>;

  // ---- Server actions ----
  async function update(form: FormData) {
    "use server";
    const id = form.get("id")!.toString();
    const data: any = {
      businessName: form.get("businessName"),
      contactName: form.get("contactName") || null,
      phone: form.get("phone") || null,
      email: form.get("email") || null,
      websiteUrl: form.get("websiteUrl") || null,
      socialLinks: (form.get("socialLinks")?.toString() || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      leadSource: form.get("leadSource") || null,
      status: form.get("status") || "NEW",
      contacted: form.get("contacted") === "on",
      contactMethod: form.get("contactMethod") || "NONE",
      interested: form.get("interested") === "on",
      followUpNeeded: form.get("followUpNeeded") === "on",
      lastContactedAt: form.get("lastContactedAt")
        ? new Date(form.get("lastContactedAt")!.toString())
        : null,
      nextFollowUpAt: form.get("nextFollowUpAt")
        ? new Date(form.get("nextFollowUpAt")!.toString())
        : null,
      projectScope: form.get("projectScope") || null,
      websiteNotes: form.get("websiteNotes") || null,
      budgetRange: form.get("budgetRange") || null,
      priority: form.get("priority") ? Number(form.get("priority")) : null,
      tags: (form.get("tags")?.toString() || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      address: form.get("address") || null,
      city: form.get("city") || null,
      state: form.get("state") || null,
      country: form.get("country") || null,
      timezone: form.get("timezone") || null,
      hostingPlan: form.get("hostingPlan") || null,
      maintenancePlan: form.get("maintenancePlan") || null,
      decisionTimeline: form.get("decisionTimeline") || null,
    };
    await prisma.client.update({ where: { id }, data });
    redirect("/clients");
  }

  async function destroy(form: FormData) {
    "use server";
    const id = form.get("id")!.toString();
    await prisma.client.delete({ where: { id } });
    redirect("/clients");
  }

  // ---- Derived UI helpers (computed AFTER notFound) ----
  const socialArray = Array.isArray(c.socialLinks)
    ? (c.socialLinks as string[])
    : [];

  return (
    <div className="card">
      <div className="header-row">
        <h2>Edit Client</h2>
        <Link className="btn secondary" href="/clients">
          Back
        </Link>
      </div>

      <form action={update}>
        <input type="hidden" name="id" defaultValue={c.id} />
        <div className="grid">
          <div>
            <label>Business Name</label>
            <input
              className="input"
              name="businessName"
              defaultValue={c.businessName}
              required
            />
          </div>
          <div>
            <label>Contact Person</label>
            <input
              className="input"
              name="contactName"
              defaultValue={c.contactName ?? ""}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              className="input"
              name="email"
              type="email"
              defaultValue={c.email ?? ""}
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              className="input"
              name="phone"
              defaultValue={c.phone ?? ""}
            />
          </div>
          <div>
            <label>Website</label>
            <input
              className="input"
              name="websiteUrl"
              defaultValue={c.websiteUrl ?? ""}
            />
          </div>
          <div>
            <label>Social Links (comma separated)</label>
            <input
              className="input"
              name="socialLinks"
              defaultValue={socialArray.join(", ")}
            />
          </div>
          <div>
            <label>Lead Source</label>
            <input
              className="input"
              name="leadSource"
              defaultValue={c.leadSource ?? ""}
            />
          </div>
          <div>
            <label>Status</label>
            <select name="status" className="input" defaultValue={c.status}>
              <option>NEW</option>
              <option>CONTACTED</option>
              <option>INTERESTED</option>
              <option>FOLLOW_UP</option>
              <option>IN_DISCUSSION</option>
              <option>WON</option>
              <option>LOST</option>
              <option>ON_HOLD</option>
            </select>
          </div>
          <div>
            <label>Contact Method</label>
            <select
              name="contactMethod"
              className="input"
              defaultValue={c.contactMethod}
            >
              <option>NONE</option>
              <option>EMAIL</option>
              <option>PHONE</option>
              <option>SMS</option>
              <option>SOCIAL_DM</option>
              <option>IN_PERSON</option>
            </select>
          </div>
          <div>
            <label>Priority (1-5)</label>
            <input
              className="input"
              name="priority"
              type="number"
              min="1"
              max="5"
              defaultValue={c.priority ?? undefined}
            />
          </div>
          <div>
            <label>Budget Range</label>
            <input
              className="input"
              name="budgetRange"
              defaultValue={c.budgetRange ?? ""}
            />
          </div>
          <div>
            <label>Tags (comma separated)</label>
            <input
              className="input"
              name="tags"
              defaultValue={(c.tags || []).join(", ")}
            />
          </div>
        </div>

        <label>Project Scope</label>
        <textarea
          className="input"
          name="projectScope"
          rows={4}
          defaultValue={c.projectScope ?? ""}
        />

        <label>Website Notes</label>
        <textarea
          className="input"
          name="websiteNotes"
          rows={3}
          defaultValue={c.websiteNotes ?? ""}
        />

        <div className="grid">
          <div>
            <label>Last Contacted</label>
            <input
              className="input"
              type="date"
              name="lastContactedAt"
              defaultValue={
                c.lastContactedAt
                  ? new Date(c.lastContactedAt).toISOString().slice(0, 10)
                  : ""
              }
            />
          </div>
          <div>
            <label>Next Follow-up</label>
            <input
              className="input"
              type="date"
              name="nextFollowUpAt"
              defaultValue={
                c.nextFollowUpAt
                  ? new Date(c.nextFollowUpAt).toISOString().slice(0, 10)
                  : ""
              }
            />
          </div>
        </div>

        <div className="grid">
          <div>
            <label>
              <input
                type="checkbox"
                name="contacted"
                defaultChecked={c.contacted}
              />{" "}
              Contacted
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="interested"
                defaultChecked={c.interested}
              />{" "}
              Interested
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="followUpNeeded"
                defaultChecked={c.followUpNeeded}
              />{" "}
              Follow-up needed
            </label>
          </div>
        </div>

        <div className="grid">
          <div>
            <label>Hosting Plan</label>
            <input
              className="input"
              name="hostingPlan"
              defaultValue={c.hostingPlan ?? ""}
            />
          </div>
          <div>
            <label>Maintenance Plan</label>
            <input
              className="input"
              name="maintenancePlan"
              defaultValue={c.maintenancePlan ?? ""}
            />
          </div>
          <div>
            <label>Decision Timeline</label>
            <input
              className="input"
              name="decisionTimeline"
              defaultValue={c.decisionTimeline ?? ""}
            />
          </div>
          <div>
            <label>Timezone</label>
            <input
              className="input"
              name="timezone"
              defaultValue={c.timezone ?? ""}
            />
          </div>
        </div>

        <div className="grid">
          <div>
            <label>Address</label>
            <input
              className="input"
              name="address"
              defaultValue={c.address ?? ""}
            />
          </div>
          <div>
            <label>City</label>
            <input className="input" name="city" defaultValue={c.city ?? ""} />
          </div>
          <div>
            <label>State</label>
            <input
              className="input"
              name="state"
              defaultValue={c.state ?? ""}
            />
          </div>
          <div>
            <label>Country</label>
            <input
              className="input"
              name="country"
              defaultValue={c.country ?? ""}
            />
          </div>
        </div>

        <button className="btn" type="submit">
          Save
        </button>
      </form>

      <form style={{ marginTop: 16 }} action={destroy}>
        <input type="hidden" name="id" defaultValue={c.id} />
        <button
          className="btn secondary"
          type="submit"
          onClick={() => confirm("Delete this client?")}
        >
          Delete
        </button>
      </form>
    </div>
  );
}
