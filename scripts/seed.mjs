import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()

async function main() {
  const email = "admin@rutledgetechnologies.com"
  const password = await bcrypt.hash("rutledge123", 10)
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password, name: "Admin", role: "admin" }
  })
  console.log("Seeded admin:", email)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
