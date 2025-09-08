import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

export default async function ClientDetail({ params }: { params: { id: string } }) {

  const client = await prisma.client.findUnique({ where: { id: params.id } })
  if (!client) return notFound()

  async function update(form: FormData) {
    "use server"
    const id = form.get("id")!.toString()
    const data: any = {
      businessName: form.get("businessName"),
      contactName: form.get("contactName") || null,
      phone: form.get("phone") || null,
      email: form.get("email") || null,
      websiteUrl: form.get("websiteUrl") || null,
      socialLinks: (form.get("socialLinks")?.toString() || "").split(",").map(s => s.trim()).filter(Boolean),
      leadSource: form.get("leadSource") || null,
      status: form.get("status") || "NEW",
      contacted: form.get("contacted") === "on",
      contactMethod: form.get("contactMethod") || "NONE",
      interested: form.get("interested") === "on",
      followUpNeeded: form.get("followUpNeeded") === "on",
      lastContactedAt: form.get("lastContactedAt") ? new Date(form.get("lastContactedAt")!.toString()) : null,
      nextFollowUpAt: form.get("nextFollowUpAt") ? new Date(form.get("nextFollowUpAt")!.toString()) : null,
      projectScope: form.get("projectScope") || null,
      websiteNotes: form.get("websiteNotes") || null,
      budgetRange: form.get("budgetRange") || null,
      priority: form.get("priority") ? Number(form.get("priority")) : null,
      tags: (form.get("tags")?.toString() || "").split(",").map(s => s.trim()).filter(Boolean),
      address: form.get("address") || null,
      city: form.get("city") || null,
      state: form.get("state") || null,
      country: form.get("country") || null,
      timezone: form.get("timezone") || null,
      hostingPlan: form.get("hostingPlan") || null,
      maintenancePlan: form.get("maintenancePlan") || null,
      decisionTimeline: form.get("decisionTimeline") || null
    }
    await prisma.client.update({ where: { id }, data })
    redirect("/clients")
  }

  async function destroy(form: FormData) {
    "use server"
    const id = form.get("id")!.toString()
    await prisma.client.delete({ where: { id } })
    redirect("/clients")
  }

  return (
    <div className="card">
      <div className="header-row">
        <h2>Edit Client</h2>
        <Link className="btn secondary" href="/clients">Back</Link>
      </div>
      <form action={update}>
        <input type="hidden" name="id" defaultValue={client.id} />
        <div className="grid">
          <div>
            <label>Business Name</label>
            <input className="input" name="businessName" defaultValue={client.businessName} required />
          </div>
          <div>
            <label>Contact Person</label>
            <input className="input" name="contactName" defaultValue={client.contactName ?? ""} />
          </div>
          <div>
            <label>Email</label>
            <input className="input" name="email" type="email" defaultValue={client.email ?? ""} />
          </div>
          <div>
            <label>Phone</label>
            <input className="input" name="phone" defaultValue={client.phone ?? ""} />
          </div>
          <div>
            <label>Website</label>
            <input className="input" name="websiteUrl" defaultValue={client.websiteUrl ?? ""} />
          </div>
          <div>
            <label>Social Links (comma separated)</label>
            <input className="input" name="socialLinks" defaultValue={(client.socialLinks as any[] || []).join(", ")} />
          </div>
          <div>
            <label>Lead Source</label>
            <input className="input" name="leadSource" defaultValue={client.leadSource ?? ""} />
          </div>
          <div>
            <label>Status</label>
            <select name="status" className="input" defaultValue={client.status}>
              <option>NEW</option><option>CONTACTED</option><option>INTERESTED</option><option>FOLLOW_UP</option>
              <option>IN_DISCUSSION</option><option>WON</option><option>LOST</option><option>ON_HOLD</option>
            </select>
          </div>
          <div>
            <label>Contact Method</label>
            <select name="contactMethod" className="input" defaultValue={client.contactMethod}>
              <option>NONE</option><option>EMAIL</option><option>PHONE</option><option>SMS</option><option>SOCIAL_DM</option><option>IN_PERSON</option>
            </select>
          </div>
          <div>
            <label>Priority (1-5)</label>
            <input className="input" name="priority" type="number" min="1" max="5" defaultValue={client.priority ?? undefined} />
          </div>
          <div>
            <label>Budget Range</label>
            <input className="input" name="budgetRange" defaultValue={client.budgetRange ?? ""} />
          </div>
          <div>
            <label>Tags (comma separated)</label>
            <input className="input" name="tags" defaultValue={(client.tags || []).join(", ")} />
          </div>
        </div>

        <label>Project Scope</label>
        <textarea className="input" name="projectScope" rows={4} defaultValue={client.projectScope ?? ""} />

        <label>Website Notes</label>
        <textarea className="input" name="websiteNotes" rows={3} defaultValue={client.websiteNotes ?? ""} />

        <div className="grid">
          <div><label>Last Contacted</label><input className="input" type="date" name="lastContactedAt" defaultValue={client.lastContactedAt ? new Date(client.lastContactedAt).toISOString().slice(0,10) : ""} /></div>
          <div><label>Next Follow-up</label><input className="input" type="date" name="nextFollowUpAt" defaultValue={client.nextFollowUpAt ? new Date(client.nextFollowUpAt).toISOString().slice(0,10) : ""} /></div>
        </div>

        <div className="grid">
          <div><label><input type="checkbox" name="contacted" defaultChecked={client.contacted} /> Contacted</label></div>
          <div><label><input type="checkbox" name="interested" defaultChecked={client.interested} /> Interested</label></div>
          <div><label><input type="checkbox" name="followUpNeeded" defaultChecked={client.followUpNeeded} /> Follow-up needed</label></div>
        </div>

        <div className="grid">
          <div><label>Hosting Plan</label><input className="input" name="hostingPlan" defaultValue={client.hostingPlan ?? ""} /></div>
          <div><label>Maintenance Plan</label><input className="input" name="maintenancePlan" defaultValue={client.maintenancePlan ?? ""} /></div>
          <div><label>Decision Timeline</label><input className="input" name="decisionTimeline" defaultValue={client.decisionTimeline ?? ""} /></div>
          <div><label>Timezone</label><input className="input" name="timezone" defaultValue={client.timezone ?? ""} /></div>
        </div>

        <div className="grid">
          <div><label>Address</label><input className="input" name="address" defaultValue={client.address ?? ""} /></div>
          <div><label>City</label><input className="input" name="city" defaultValue={client.city ?? ""} /></div>
          <div><label>State</label><input className="input" name="state" defaultValue={client.state ?? ""} /></div>
          <div><label>Country</label><input className="input" name="country" defaultValue={client.country ?? ""} /></div>
        </div>

        <button className="btn" type="submit">Save</button>
      </form>

      <form style={{marginTop:16}} action={destroy}>
        <input type="hidden" name="id" defaultValue={client.id} />
        <button className="btn secondary" type="submit" onClick={() => confirm('Delete this client?')}>Delete</button>
      </form>
    </div>
  )
}
