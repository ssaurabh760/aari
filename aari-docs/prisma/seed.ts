import { PrismaClient, Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...\n')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.reply.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.document.deleteMany()
  // Don't delete users - keep OAuth users!
  console.log('✅ Cleaned documents, comments, and replies\n')

  // Get existing OAuth users
  let users = await prisma.user.findMany()
  console.log(`📋 Found ${users.length} existing user(s) from OAuth\n`)

  // Create demo users for realistic collaboration (if not enough users)
  if (users.length < 3) {
    console.log('👥 Creating demo collaborators...')
    const demoUsers = [
      {
        id: `demo_sarah_${Date.now()}`,
        name: 'Sarah Chen',
        email: `sarah.chen.${Date.now()}@demo.local`,
        image: 'https://i.pravatar.cc/150?u=sarah',
      },
      {
        id: `demo_john_${Date.now()}`,
        name: 'John Smith',
        email: `john.smith.${Date.now()}@demo.local`,
        image: 'https://i.pravatar.cc/150?u=john',
      },
      {
        id: `demo_alex_${Date.now()}`,
        name: 'Alex Johnson',
        email: `alex.johnson.${Date.now()}@demo.local`,
        image: 'https://i.pravatar.cc/150?u=alex',
      },
      {
        id: `demo_maria_${Date.now()}`,
        name: 'Maria Garcia',
        email: `maria.garcia.${Date.now()}@demo.local`,
        image: 'https://i.pravatar.cc/150?u=maria',
      },
    ]

    for (const user of demoUsers) {
      await prisma.user.create({ data: user })
    }
    console.log(`✅ Created ${demoUsers.length} demo collaborators\n`)

    // Refresh users list
    users = await prisma.user.findMany()
  }

  // Create Documents (10 documents - visible to EVERYONE)
  console.log('📄 Creating shared documents...')
  const documentsData = [
    {
      id: `doc_q4_report_${Date.now()}`,
      title: 'Q4 2025 Marketing Strategy',
      content: generateMarketingDoc(),
      createdAt: new Date('2025-10-15'),
      updatedAt: new Date('2025-12-20'),
    },
    {
      id: `doc_product_spec_${Date.now()}`,
      title: 'Product Requirements Document - Mobile App v2.0',
      content: generateProductDoc(),
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-15'),
    },
    {
      id: `doc_meeting_notes_${Date.now()}`,
      title: 'Weekly Team Standup Notes',
      content: generateMeetingNotes(),
      createdAt: new Date('2025-12-01'),
      updatedAt: new Date('2025-12-22'),
    },
    {
      id: `doc_onboarding_${Date.now()}`,
      title: 'New Employee Onboarding Guide',
      content: generateOnboardingDoc(),
      createdAt: new Date('2025-06-15'),
      updatedAt: new Date('2025-11-30'),
    },
    {
      id: `doc_api_design_${Date.now()}`,
      title: 'REST API Design Guidelines',
      content: generateApiDoc(),
      createdAt: new Date('2025-08-20'),
      updatedAt: new Date('2025-12-10'),
    },
  ]

  // Add more random documents
  for (let i = 0; i < 5; i++) {
    documentsData.push({
      id: `doc_${i}_${Date.now()}`,
      title: faker.helpers.arrayElement([
        `${faker.company.catchPhrase()} - Draft`,
        `Project ${faker.commerce.productName()}`,
        `${faker.word.adjective()} ${faker.word.noun()} Proposal`,
        `Meeting Notes: ${faker.date.month()}`,
        `${faker.company.name()} Partnership`,
      ]),
      content: generateDocumentContent(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
    })
  }

  for (const doc of documentsData) {
    await prisma.document.create({ data: doc })
  }
  console.log(`✅ Created ${documentsData.length} shared documents\n`)

  // Create Comments and Replies from different users
  console.log('💬 Creating collaborative comments...')
  let commentCount = 0
  let replyCount = 0

  for (const doc of documentsData) {
    const numComments = faker.number.int({ min: 3, max: 6 })

    for (let i = 0; i < numComments; i++) {
      const highlightedText = faker.lorem.sentence({ min: 3, max: 8 })
      const selectionFrom = faker.number.int({ min: 0, max: 500 })
      const commentUser = faker.helpers.arrayElement(users)
      const commentCreatedAt = faker.date.between({ from: doc.createdAt, to: new Date() })

      const comment = await prisma.comment.create({
        data: {
          documentId: doc.id,
          userId: commentUser.id,
          highlightedText,
          selectionFrom,
          selectionTo: selectionFrom + highlightedText.length,
          content: generateCommentContent(),
          isResolved: faker.datatype.boolean({ probability: 0.2 }),
          createdAt: commentCreatedAt,
        },
      })
      commentCount++

      // Create replies from OTHER users (realistic collaboration)
      const numReplies = faker.number.int({ min: 0, max: 4 })
      const otherUsers = users.filter(u => u.id !== commentUser.id)

      for (let j = 0; j < numReplies && otherUsers.length > 0; j++) {
        const replyUser = faker.helpers.arrayElement(otherUsers.length > 0 ? otherUsers : users)
        await prisma.reply.create({
          data: {
            commentId: comment.id,
            userId: replyUser.id,
            content: generateReplyContent(),
            createdAt: faker.date.between({ from: commentCreatedAt, to: new Date() }),
          },
        })
        replyCount++
      }
    }
  }

  console.log(`✅ Created ${commentCount} comments`)
  console.log(`✅ Created ${replyCount} replies\n`)

  // Summary
  const finalUserCount = await prisma.user.count()
  const finalDocCount = await prisma.document.count()
  const finalCommentCount = await prisma.comment.count()
  const finalReplyCount = await prisma.reply.count()

  console.log('📊 Seed Summary:')
  console.log('─'.repeat(40))
  console.log(`   Users:      ${finalUserCount} (OAuth + demo)`)
  console.log(`   Documents:  ${finalDocCount} (shared with everyone)`)
  console.log(`   Comments:   ${finalCommentCount}`)
  console.log(`   Replies:    ${finalReplyCount}`)
  console.log('─'.repeat(40))
  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📝 All documents are visible to ALL signed-in users.')
  console.log('   Users can only edit/delete their OWN comments.')
}

// Document content generators
function generateMarketingDoc(): Prisma.InputJsonValue {
  return {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Q4 2025 Marketing Strategy' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'This document outlines our marketing initiatives for Q4 2025, focusing on digital channels and brand awareness campaigns.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Executive Summary' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Our Q4 strategy focuses on three key pillars: social media engagement, content marketing, and strategic partnerships. We aim to increase brand awareness by 40% and generate 25% more qualified leads compared to Q3.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Budget Allocation' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Total budget: $500,000. Digital advertising: 40%, Content creation: 25%, Events: 20%, Tools & analytics: 15%.' }] },
    ],
  }
}

function generateProductDoc(): Prisma.InputJsonValue {
  return {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Mobile App v2.0 Requirements' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'This PRD defines the requirements for the next major version of our mobile application.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'User Stories' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'As a user, I want to sync my data across devices so that I can access my information anywhere. As a user, I want offline mode so that I can work without internet connection.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Technical Requirements' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'The app must support iOS 15+ and Android 12+. It should load within 3 seconds on a 4G connection. All data must be encrypted at rest and in transit.' }] },
    ],
  }
}

function generateMeetingNotes(): Prisma.InputJsonValue {
  return {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Weekly Team Standup - December 22, 2025' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Attendees' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Sarah, John, Alex, Maria, and team leads from engineering and design.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Updates' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Engineering completed the authentication module. Design finalized the new dashboard mockups. QA reported 3 critical bugs that need attention before release.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Action Items' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'John to fix authentication bug by Wednesday. Sarah to review design specs. Alex to coordinate with QA for regression testing.' }] },
    ],
  }
}

function generateOnboardingDoc(): Prisma.InputJsonValue {
  return {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'New Employee Onboarding Guide' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Welcome to the team! This guide will help you get started and navigate your first few weeks.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Day 1 Checklist' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Complete HR paperwork, set up your workstation, get building access card, meet your team lead, and attend orientation session at 2 PM.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Tools & Access' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Request access to: Slack, GitHub, Jira, Figma, and Google Workspace. Your manager will provide the necessary approvals.' }] },
    ],
  }
}

function generateApiDoc(): Prisma.InputJsonValue {
  return {
    type: 'doc',
    content: [
      { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'REST API Design Guidelines' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'This document establishes our standards for designing RESTful APIs.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Naming Conventions' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'Use lowercase letters and hyphens for URLs. Use plural nouns for collections (e.g., /users, /documents). Use HTTP methods correctly: GET for retrieval, POST for creation, PATCH for updates, DELETE for removal.' }] },
      { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Response Format' }] },
      { type: 'paragraph', content: [{ type: 'text', text: 'All responses should be wrapped in a data object. Include appropriate HTTP status codes. Provide meaningful error messages with error codes for client-side handling.' }] },
    ],
  }
}

function generateDocumentContent(): Prisma.InputJsonValue {
  const numParagraphs = faker.number.int({ min: 3, max: 5 })
  const content: Prisma.InputJsonValue[] = []

  content.push({
    type: 'heading',
    attrs: { level: 1 },
    content: [{ type: 'text', text: faker.lorem.sentence({ min: 4, max: 8 }).replace('.', '') }],
  })

  for (let i = 0; i < numParagraphs; i++) {
    content.push({
      type: 'paragraph',
      content: [{ type: 'text', text: faker.lorem.paragraph({ min: 2, max: 4 }) }],
    })
  }

  return { type: 'doc', content }
}

function generateCommentContent(): string {
  const templates = [
    'Can we clarify this section? I think it needs more detail.',
    'I suggest we revisit this before the deadline.',
    'This looks great! Just one small suggestion...',
    'Should we include metrics here?',
    'Let\'s discuss this in our next meeting.',
    '+1, I agree with this approach.',
    'Can someone from engineering review this?',
    'I have some concerns about the timeline mentioned here.',
    'This needs to be updated based on the latest requirements.',
    'Great work on this section!',
    'Should we add examples here for clarity?',
    'The budget numbers need verification.',
  ]
  return faker.helpers.arrayElement(templates)
}

function generateReplyContent(): string {
  const templates = [
    'Good point! I\'ll update this.',
    'Agreed, let me fix that.',
    'Thanks for catching this!',
    'I\'ll take care of it.',
    'Done ✓',
    'Let\'s sync on this tomorrow.',
    'I\'ve made the changes.',
    'Can you elaborate on what you mean?',
    'I think the current version is fine, but open to suggestions.',
    'Added the examples you suggested.',
    'Updated with the latest numbers.',
    'Thanks for the feedback!',
  ]
  return faker.helpers.arrayElement(templates)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())