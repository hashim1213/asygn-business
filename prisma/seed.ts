// prisma/seed.ts - Updated with NextAuth support
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed with realistic data and authentication...')
  
  // Create demo authentication accounts first
  console.log('Creating demo authentication accounts...')
  
  const demoClient = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Demo Client',
      password: await bcrypt.hash('password123', 12),
      role: 'CLIENT',
      phone: '(555) 123-4567'
    }
  })

  const demoStaff = await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      email: 'staff@example.com',
      name: 'Demo Staff Member',
      password: await bcrypt.hash('password123', 12),
      role: 'STAFF',
      phone: '(555) 987-6543'
    }
  })

  // Create staff profile for demo staff
  await prisma.staffProfile.upsert({
    where: { userId: demoStaff.id },
    update: {},
    create: {
      userId: demoStaff.id,
      staffType: 'BARTENDER',
      hourlyRate: 35,
      experience: 'Professional bartender with 5+ years experience',
      bio: 'Demo staff account for testing the platform.',
      skills: ['Bartending', 'Customer Service', 'Event Management'],
      available: true,
      verified: true,
      rating: 4.8
    }
  })
  
  // Create test clients (event organizers) with passwords
  const clients = [
    {
      name: "Sarah Johnson",
      email: "sarah@modernweddings.com",
      password: await bcrypt.hash('password123', 12),
      phone: "(555) 123-4567",
      role: 'CLIENT' as const
    },
    {
      name: "Tech Corp Events",
      email: "events@techcorp.com",
      password: await bcrypt.hash('password123', 12), 
      phone: "(555) 987-6543",
      role: 'CLIENT' as const
    },
    {
      name: "Downtown Event Center",
      email: "bookings@downtownevents.com",
      password: await bcrypt.hash('password123', 12),
      phone: "(555) 456-7890", 
      role: 'CLIENT' as const
    }
  ]

  for (const clientData of clients) {
    await prisma.user.upsert({
      where: { email: clientData.email },
      update: {},
      create: clientData
    })
  }

  // Create realistic staff members with passwords
  const staffMembers = [
    // Bartenders
    {
      user: {
        name: "Marcus Rodriguez",
        email: "marcus.r@bartenderpro.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 234-5678",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'BARTENDER' as const,
        hourlyRate: 45,
        experience: "8+ years",
        bio: "Master mixologist with certification from the American Bartenders Association. Specializes in craft cocktails, wine pairings, and high-volume service for corporate events and weddings.",
        skills: ["Craft Cocktails", "Wine Service", "Flair Bartending", "Event Management", "TIPS Certified"],
        equipment: ["Professional Bar Tools", "Portable Bar Setup", "Cocktail Recipe Database"],
        address: "Downtown Los Angeles, CA",
        latitude: 34.0522,
        longitude: -118.2437,
        maxRadius: 30,
        verified: true,
        available: true,
        rating: 4.9,
        reviewCount: 156,
        completedJobs: 287
      }
    },
    {
      user: {
        name: "Elena Vasquez", 
        email: "elena.v@eventstaff.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 345-6789",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'BARTENDER' as const,
        hourlyRate: 38,
        experience: "5+ years", 
        bio: "Experienced bartender with a focus on high-end events and customer service. Fluent in English and Spanish, perfect for diverse clientele.",
        skills: ["Bilingual Service", "Wine Knowledge", "Corporate Events", "Wedding Service"],
        equipment: ["Bar Tools", "Point of Sale Systems"],
        address: "West Hollywood, CA",
        latitude: 34.0900,
        longitude: -118.3617,
        maxRadius: 25,
        verified: true,
        available: true,
        rating: 4.8,
        reviewCount: 89,
        completedJobs: 145
      }
    },
    {
      user: {
        name: "Jake Thompson",
        email: "jake.t@cocktailmaster.com",
        password: await bcrypt.hash('password123', 12), 
        phone: "(555) 456-7890",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'BARTENDER' as const,
        hourlyRate: 42,
        experience: "6+ years",
        bio: "Award-winning mixologist featured in LA Weekly. Creates custom cocktail menus for special events and has worked with celebrity clients.",
        skills: ["Custom Cocktail Menus", "Celebrity Events", "Molecular Mixology", "Bar Consulting"],
        equipment: ["Premium Bar Setup", "Specialty Glassware", "Molecular Tools"],
        address: "Beverly Hills, CA", 
        latitude: 34.0736,
        longitude: -118.4004,
        maxRadius: 20,
        verified: true,
        available: true,
        rating: 4.9,
        reviewCount: 203,
        completedJobs: 198
      }
    },

    // Servers
    {
      user: {
        name: "Isabella Chen",
        email: "isabella.c@finediningstaff.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 567-8901", 
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'SERVER' as const,
        hourlyRate: 32,
        experience: "7+ years",
        bio: "Fine dining server with Michelin-star restaurant experience. Expert in wine service, dietary restrictions, and creating exceptional guest experiences.",
        skills: ["Fine Dining", "Wine Sommelier Level 1", "Dietary Restrictions", "Multi-Course Service"],
        equipment: ["Wine Tools", "Service Plates", "Professional Uniform"],
        address: "Santa Monica, CA",
        latitude: 34.0195,
        longitude: -118.4912,
        maxRadius: 35,
        verified: true,
        available: true,
        rating: 4.9,
        reviewCount: 234,
        completedJobs: 456
      }
    },
    {
      user: {
        name: "David Kim",
        email: "david.k@corporateservice.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 678-9012",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'SERVER' as const,
        hourlyRate: 28,
        experience: "4+ years", 
        bio: "Energetic server specializing in corporate events and large gatherings. Known for efficiency, professionalism, and positive attitude.",
        skills: ["Corporate Events", "Large Groups", "Buffet Service", "Team Leadership"],
        equipment: ["Professional Serving Tools", "Catering Experience"],
        address: "Culver City, CA",
        latitude: 34.0211,
        longitude: -118.3965,
        maxRadius: 40,
        verified: true,
        available: true,
        rating: 4.7,
        reviewCount: 127,
        completedJobs: 289
      }
    },
    {
      user: {
        name: "Sophia Martinez",
        email: "sophia.m@weddingservice.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 789-0123",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'SERVER' as const,
        hourlyRate: 30,
        experience: "5+ years",
        bio: "Wedding service specialist with a gentle touch and attention to detail. Experienced in coordinating with wedding planners and handling special moments.",
        skills: ["Wedding Service", "Event Coordination", "Guest Relations", "Special Dietary Needs"],
        equipment: ["Elegant Serving Ware", "Wedding Experience"],
        address: "Pasadena, CA",
        latitude: 34.1478,
        longitude: -118.1445,
        maxRadius: 30,
        verified: true,
        available: true,
        rating: 4.8,
        reviewCount: 178,
        completedJobs: 312
      }
    },

    // Barbacks
    {
      user: {
        name: "Alex Rivera",
        email: "alex.r@supportstaff.com",
        password: await bcrypt.hash('password123', 12), 
        phone: "(555) 890-1234",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'BARBACK' as const,
        hourlyRate: 24,
        experience: "3+ years",
        bio: "Reliable barback with strong work ethic and team collaboration skills. Experienced in high-volume events and inventory management.",
        skills: ["High Volume Events", "Inventory Management", "Bar Setup", "Team Support"],
        equipment: ["Bar Supplies", "Cleaning Equipment", "Organizational Tools"],
        address: "Long Beach, CA",
        latitude: 33.7701,
        longitude: -118.1937,
        maxRadius: 45,
        verified: true,
        available: true,
        rating: 4.6,
        reviewCount: 93,
        completedJobs: 156
      }
    },
    {
      user: {
        name: "Jordan Williams",
        email: "jordan.w@barteam.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 901-2345", 
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'BARBACK' as const,
        hourlyRate: 26,
        experience: "4+ years",
        bio: "Experienced barback looking to advance to bartending. Quick learner with excellent organizational skills and knowledge of bar operations.",
        skills: ["Bar Operations", "Quick Setup", "Inventory Control", "Equipment Maintenance"],
        equipment: ["Professional Bar Tools", "Setup Equipment"],
        address: "Glendale, CA",
        latitude: 34.1425,
        longitude: -118.2551,
        maxRadius: 35,
        verified: true,
        available: true,
        rating: 4.7,
        reviewCount: 67,
        completedJobs: 134
      }
    },

    // Event Crew
    {
      user: {
        name: "Maria Santos",
        email: "maria.s@eventcrew.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 012-3456",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'EVENT_CREW' as const,
        hourlyRate: 26,
        experience: "9+ years",
        bio: "Senior event crew member and team leader with extensive experience in setup, breakdown, and logistics coordination for events up to 1000+ guests.",
        skills: ["Event Setup", "Team Leadership", "Logistics Coordination", "Equipment Management", "Safety Protocols"],
        equipment: ["Hand Tools", "Safety Equipment", "Communication Devices"],
        address: "Burbank, CA",
        latitude: 34.1808,
        longitude: -118.3090,
        maxRadius: 50,
        verified: true,
        available: true,
        rating: 4.9,
        reviewCount: 189,
        completedJobs: 445
      }
    },
    {
      user: {
        name: "Carlos Mendoza", 
        email: "carlos.m@setupcrew.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 123-4567",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'EVENT_CREW' as const,
        hourlyRate: 24,
        experience: "5+ years",
        bio: "Versatile event crew member specializing in audio/visual setup and technical support. Bilingual and experienced with various event types.",
        skills: ["A/V Setup", "Technical Support", "Bilingual", "Equipment Transport"],
        equipment: ["A/V Equipment", "Tools", "Transport Vehicle"],
        address: "Van Nuys, CA",
        latitude: 34.1869,
        longitude: -118.4489,
        maxRadius: 40,
        verified: true,
        available: true,
        rating: 4.8,
        reviewCount: 112,
        completedJobs: 278
      }
    },
    {
      user: {
        name: "Ashley Taylor",
        email: "ashley.t@eventassist.com",
        password: await bcrypt.hash('password123', 12),
        phone: "(555) 234-5678",
        role: 'STAFF' as const
      },
      profile: {
        staffType: 'EVENT_CREW' as const,
        hourlyRate: 25,
        experience: "3+ years", 
        bio: "Detail-oriented event crew member with experience in wedding setups, corporate events, and festival logistics. Strong communication and problem-solving skills.",
        skills: ["Wedding Setup", "Corporate Events", "Guest Services", "Problem Solving"],
        equipment: ["Setup Tools", "Decoration Supplies", "First Aid Certified"],
        address: "Manhattan Beach, CA",
        latitude: 33.8847,
        longitude: -118.4109,
        maxRadius: 30,
        verified: true,
        available: true,
        rating: 4.7,
        reviewCount: 85,
        completedJobs: 167
      }
    }
  ]

  // Create all staff members
  for (const staffData of staffMembers) {
    const user = await prisma.user.upsert({
      where: { email: staffData.user.email },
      update: {},
      create: staffData.user
    })

    await prisma.staffProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        ...staffData.profile,
        userId: user.id
      }
    })
  }

  // Create some sample events and bookings
  const sampleClient = await prisma.user.findFirst({
    where: { email: "sarah@modernweddings.com" }
  })

  if (sampleClient) {
    const sampleEvent = await prisma.event.create({
      data: {
        title: "Johnson-Smith Wedding Reception",
        description: "Elegant outdoor wedding reception for 150 guests",
        venue: "Malibu Creek State Park",
        address: "1925 Las Virgenes Rd, Calabasas, CA 91302",
        latitude: 34.0956,
        longitude: -118.7248,
        date: new Date("2024-10-15T18:00:00Z"),
        startTime: "18:00",
        endTime: "23:00",
        eventType: "WEDDING",
        guestCount: 150,
        organizerId: sampleClient.id,
        status: "PUBLISHED"
      }
    })

    const booking = await prisma.booking.create({
      data: {
        eventId: sampleEvent.id,
        clientId: sampleClient.id,
        subtotal: 920,
        platformFee: 138,
        total: 1058,
        status: "CONFIRMED",
        paymentStatus: "SUCCEEDED"
      }
    })

    // Add staff bookings
    await prisma.staffBooking.createMany({
      data: [
        {
          bookingId: booking.id,
          staffType: "BARTENDER",
          quantity: 2,
          hourlyRate: 42
        },
        {
          bookingId: booking.id,
          staffType: "SERVER", 
          quantity: 3,
          hourlyRate: 30
        },
        {
          bookingId: booking.id,
          staffType: "BARBACK",
          quantity: 1,
          hourlyRate: 24
        }
      ]
    })
  }

  console.log('✅ Realistic seed data created with authentication!')
  console.log('📊 Created:')
  console.log('   - Demo accounts with authentication:')
  console.log('     📧 client@example.com / password123 (CLIENT)')
  console.log('     📧 staff@example.com / password123 (STAFF)')
  console.log('   - 3 Event organizers (clients) with passwords')
  console.log('   - 11 Staff members (3 bartenders, 3 servers, 2 barbacks, 3 event crew)')
  console.log('   - 1 Sample wedding event with booking')
  console.log('   - Realistic locations in Los Angeles area')
  console.log('   - Professional bios, skills, and experience levels')
  console.log('   - All accounts use password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })