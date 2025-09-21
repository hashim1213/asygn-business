// scripts/fix-passwords.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function fixPasswords() {
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  // Update demo client
  await prisma.user.update({
    where: { email: 'client@example.com' },
    data: { password: hashedPassword }
  })
  
  // Update demo staff
  await prisma.user.update({
    where: { email: 'staff@example.com' },
    data: { password: hashedPassword }
  })
  
  console.log('Passwords updated!')
}

fixPasswords().finally(() => prisma.$disconnect())