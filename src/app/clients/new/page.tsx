import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function NewClientPage() {
  const session = await auth()

  async function create(form: FormData) {
    "use server"
    const socialLinks = (form.get("socialLinks")?.toString() || "").split(",").map(s => s.trim()).filter(Boolean)
    const data: any = {
      businessName: form.get("businessName"),
      contactName: form.get("contactName") || null,
      phone: form.get("phone") || null,
      email: form.get("email") || null,
      websiteUrl: form.get("websiteUrl") || null,
      socialLinks,
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
      decisionTimeline: form.get("decisionTimeline") || null,
      ownerId: session?.user?.id as string | undefined
    }
    await prisma.client.create({ data })
    redirect("/clients")
  }

  return (
    <div className="card">
      <h2>New Client</h2>
      <form action={create}>
        <div className="grid">
          <div>
            <label>Business Name</label>
            <input className="input" name="businessName" required />
          </div>
          <div>
            <label>Contact Person</label>
            <input className="input" name="contactName" />
          </div>
          <div>
            <label>Email</label>
            <input className="input" name="email" type="email" />
          </div>
          <div>
            <label>Phone</label>
            <input className="input" name="phone" />
          </div>
          <div>
            <label>Website</label>
            <input className="input" name="websiteUrl" placeholder="https://..." />
          </div>
          <div>
            <label>Social Links (comma separated)</label>
            <input className="input" name="socialLinks" placeholder="https://facebook..., https://instagram..." />
          </div>
          <div>
            <label>Lead Source</label>
            <input className="input" name="leadSource" placeholder="Referral, Cold DM, Walk-in..." />
          </div>
          <div>
            <label>Status</label>
            <select name="status" className="input">
              <option>NEW</option><option>CONTACTED</option><option>INTERESTED</option><option>FOLLOW_UP</option>
              <option>IN_DISCUSSION</option><option>WON</option><option>LOST</option><option>ON_HOLD</option>
            </select>
          </div>
          <div>
            <label>Contact Method</label>
            <select name="contactMethod" className="input">
              <option>NONE</option><option>EMAIL</option><option>PHONE</option><option>SMS</option><option>SOCIAL_DM</option><option>IN_PERSON</option>
            </select>
          </div>
          <div>
            <label>Priority (1-5)</label>
            <input className="input" name="priority" type="number" min="1" max="5" />
          </div>
          <div>
            <label>Budget Range</label>
            <input className="input" name="budgetRange" placeholder="$500-$1500" />
          </div>
          <div>
            <label>Tags (comma separated)</label>
            <input className="input" name="tags" placeholder="auto, ecommerce, SEO" />
          </div>
        </div>

        <label>Project Scope</label>
        <textarea className="input" name="projectScope" rows={4} placeholder="Pages, features, DB add-ons, SEO, hosting/maintenance..." />

        <label>Website Notes</label>
        <textarea className="input" name="websiteNotes" rows={3} placeholder="What their current site does well/poorly, core issues to fix..." />

        <div className="grid">
          <div><label>Last Contacted</label><input className="input" type="date" name="lastContactedAt" /></div>
          <div><label>Next Follow-up</label><input className="input" type="date" name="nextFollowUpAt" /></div>
        </div>

        <div className="grid">
          <div><label><input type="checkbox" name="contacted" /> Contacted</label></div>
          <div><label><input type="checkbox" name="interested" /> Interested</label></div>
          <div><label><input type="checkbox" name="followUpNeeded" /> Follow-up needed</label></div>
        </div>

        <div className="grid">
          <div><label>Hosting Plan</label><input className="input" name="hostingPlan" placeholder="Self-hosted / Rutledge Managed" /></div>
          <div><label>Maintenance Plan</label><input className="input" name="maintenancePlan" placeholder="None / Basic / Pro" /></div>
          <div><label>Decision Timeline</label><input className="input" name="decisionTimeline" placeholder="This week / 30 days / Q4..." /></div>
          <div><label>Timezone</label><input className="input" name="timezone" placeholder="America/Toronto" /></div>
        </div>

        <div className="grid">
          <div><label>Address</label><input className="input" name="address" /></div>
          <div><label>City</label><input className="input" name="city" /></div>
          <div><label>State</label><input className="input" name="state" /></div>
          <div><label>Country</label><input className="input" name="country" /></div>
        </div>

        <button className="btn" type="submit">Create</button>
      </form>
    </div>
  )
}
