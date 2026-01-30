# AARI Docs

A modern, collaborative document editor inspired by Google Docs — built with Next.js 15, TipTap, and real-time commenting features.

🔗 **Live Demo:** [https://aari-sepia.vercel.app](https://aari-sepia.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)

---

## ✨ Features

### 📝 Rich Text Editor
- Full formatting toolbar (bold, italic, underline, strikethrough)
- Headings (H1, H2, H3)
- Bullet and numbered lists
- Code blocks
- Undo/Redo support
- Auto-save with 5-second debounce

### 💬 Collaborative Comments
- **Add comments** on selected text with highlight indicators
- **Threaded replies** for discussions
- **Resolve/Reopen** comments
- **Edit/Delete** your own comments only (ownership-based permissions)
- Real-time comment highlighting in document

### 🤖 AI-Powered Writing Assistant
- **Ask AI** bubble menu appears on text selection
- **Slash commands** (`/`) for quick actions
- Powered by Groq API (llama-3.1-8b-instant)
- Features:
  - Improve writing
  - Fix grammar
  - Summarize text

### 🔐 Google Authentication
- Sign in with Google (OAuth 2.0)
- Protected routes — must be logged in to view documents
- User avatars and names on comments
- Session management with NextAuth.js

### 📱 Responsive Design
- Fully responsive for desktop, tablet, and mobile
- Slide-out comments panel on mobile
- Touch-friendly interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Editor** | TipTap (ProseMirror) |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js + Google OAuth |
| **AI** | Groq API (LLaMA 3.1) |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth API routes
│   │   ├── documents/            # Document CRUD APIs
│   │   ├── comments/             # Comment APIs
│   │   ├── replies/              # Reply APIs
│   │   └── ai/                   # AI processing endpoint
│   ├── documents/[id]/           # Document editor page
│   ├── login/                    # Login page
│   └── page.tsx                  # Home page (document list)
├── components/
│   ├── editor/
│   │   ├── Editor.tsx            # Main TipTap editor
│   │   ├── Toolbar.tsx           # Formatting toolbar
│   │   ├── AIBubbleMenu.tsx      # AI selection menu
│   │   └── SlashCommands.tsx     # Slash command menu
│   ├── comments/
│   │   └── CommentsSidebar.tsx   # Comments panel
│   ├── AuthProvider.tsx          # NextAuth session provider
│   └── UserMenu.tsx              # User dropdown menu
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client
│   ├── hooks.ts                  # Custom React hooks
│   └── types.ts                  # TypeScript types
└── middleware.ts                 # Route protection
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Google Cloud Platform account (for OAuth)
- Groq API key (optional, for AI features)

### 1. Clone the Repository

```bash
git clone
cd aari-docs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-google-client-secret"

# AI (Optional)
GROQ_API_KEY="gsk_your-groq-api-key"
```

### 4. Set Up the Database

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with sample data (optional)
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **OAuth consent screen**
   - Choose "External" user type
   - Fill in app name, support email
   - Click "Publish App" to allow any Google user to sign in
4. Navigate to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. Select "Web application"
7. Add authorized origins:
   ```
   http://localhost:3000
   https://your-app.vercel.app
   ```
8. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-app.vercel.app/api/auth/callback/google
   ```
9. Copy the Client ID and Client Secret to your `.env` file

---

## 🌐 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add environment variables in Vercel dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Supabase connection string |
| `DIRECT_URL` | Your Supabase direct connection string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Your generated secret |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
| `GROQ_API_KEY` | Your Groq API key (optional) |

3. Deploy!

### 3. Update Google OAuth

After deployment, add your Vercel URL to Google Cloud Console:
- Authorized JavaScript origins: `https://your-app.vercel.app`
- Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`

---

## 📊 Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  comments      Comment[]
  replies       Reply[]
}

model Document {
  id        String    @id @default(cuid())
  title     String    @default("Untitled")
  content   Json      @default("{}")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  comments  Comment[]
}

model Comment {
  id              String   @id @default(cuid())
  content         String
  highlightedText String
  selectionFrom   Int
  selectionTo     Int
  isResolved      Boolean  @default(false)
  createdAt       DateTime @default(now())
  document        Document @relation(...)
  user            User     @relation(...)
  replies         Reply[]
}

model Reply {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  comment   Comment  @relation(...)
  user      User     @relation(...)
}
```

---

## 🔒 API Endpoints

### Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | List all documents |
| POST | `/api/documents` | Create new document |
| GET | `/api/documents/[id]` | Get document by ID |
| PATCH | `/api/documents/[id]` | Update document |
| DELETE | `/api/documents/[id]` | Delete document |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents/[id]/comments` | Get comments for document |
| POST | `/api/documents/[id]/comments` | Add comment |
| PATCH | `/api/comments/[id]` | Update comment |
| DELETE | `/api/comments/[id]` | Delete comment |
| POST | `/api/comments/[id]/resolve` | Resolve/reopen comment |

### Replies
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/comments/[id]/replies` | Add reply |
| PATCH | `/api/replies/[id]` | Update reply |
| DELETE | `/api/replies/[id]` | Delete reply |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai` | Process text with AI |

---

## 🎯 Key Implementation Highlights

### 1. Ownership-Based Permissions
Users can only edit/delete their own comments:
```tsx
const isOwner = currentUserId === comment.userId
{isOwner && <EditButton />}
```

### 2. Optimized Auto-Save
5-second debounce prevents excessive API calls:
```tsx
useEffect(() => {
  const timer = setTimeout(() => saveDocument(), 5000)
  return () => clearTimeout(timer)
}, [content])
```

### 3. Comment Highlighting
TipTap marks for visual comment indicators:
```tsx
CommentHighlight.configure({
  HTMLAttributes: { class: 'comment-highlight' }
})
```

### 4. Mobile-First Responsive Design
Tailwind breakpoints for adaptive layouts:
```tsx
className="px-4 sm:px-8 min-h-[300px] sm:min-h-[500px]"
```

---

## 🧪 Testing Checklist

- [ ] Sign in with Google
- [ ] Create new document
- [ ] Edit document title
- [ ] Apply text formatting (bold, italic, headings)
- [ ] Select text → Add comment
- [ ] Reply to a comment
- [ ] Resolve a comment
- [ ] Edit your own comment
- [ ] Verify you cannot edit others' comments
- [ ] Test AI features (select text → Ask AI)
- [ ] Test on mobile device

---

## 📝 Future Enhancements

- [ ] Real-time collaboration with WebSockets
- [ ] Document sharing with permissions
- [ ] Version history
- [ ] Export to PDF/DOCX
- [ ] Offline support with IndexedDB
- [ ] Mentions (@user) in comments

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Saurabh Srivastava**


---

<p align="center">
  Built with ❤️ using Next.js, TipTap, and Tailwind CSS
</p>