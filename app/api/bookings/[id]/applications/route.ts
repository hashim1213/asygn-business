
// app/api/bookings/[id]/applications/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const applications = await prisma.application.findMany({
      where: {
        bookingId: params.id
      },
      include: {
        staff: true,
        staffProfile: true
      }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Applications error:', error)
    return NextResponse.json({ error: 'Failed to get applications' }, { status: 500 })
  }
}