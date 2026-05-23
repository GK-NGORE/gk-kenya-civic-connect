# Kenya Civic Voice

A comprehensive civic engagement platform for Kenyan citizens to voice their concerns about government institutions.

## Features

✅ **User Authentication** - Instagram-like account system with registration and login
✅ **General Posts** - Share thoughts and engage with the community
✅ **Government Sections** - All arms and branches of Kenyan government
✅ **Civic Reports** - Submit reports with text, images, videos, and files to specific government sections
✅ **Likes & Comments** - Engage with posts and reports
✅ **Fully Responsive** - Works seamlessly on all devices (mobile, tablet, desktop)
✅ **Online Access** - Deploy to the web and access from anywhere

## Government Sections Covered

- **Executive**: Presidency and Cabinet
- **Legislative**: National Assembly and Senate
- **Judicial**: Courts and Tribunals
- **Devolved**: County Governments and County Assemblies

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with responsive design
- **Icons**: React Icons

## Installation

### Prerequisites

- Node.js (v16+)
- MongoDB database
- npm or yarn

### Setup Steps

1. **Clone/Extract the project**
   ```bash
   cd kenya-civic-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file**
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## Usage

### First Time User
1. Go to `/auth/register`
2. Create account with username, email, and password
3. Login with your credentials
4. You'll be redirected to Posts page

### Making Posts
1. On the Posts page, fill in the text area
2. Optionally add photos, videos, or files
3. Click "Post" to share

### Reporting Issues
1. Go to Government Sections page
2. Click on any government body
3. Click "Report Issue" button
4. Fill in title and description
5. Attach photos, videos, or files
6. Submit your report

### Engaging
- Like posts and reports by clicking the heart icon
- Add comments to reports
- Share posts with others

## Responsive Design

The application is fully responsive and optimized for:
- **Mobile** (320px+): Single column layout, touch-friendly buttons
- **Tablet** (768px+): Two-column layout with sidebar
- **Desktop** (1024px+): Full three-column layout

All margins, padding, and font sizes adapt to screen size using Tailwind CSS breakpoints.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth authentication

### Posts
- `GET /api/posts?section=general` - Fetch posts
- `POST /api/posts` - Create post
- `POST /api/posts/[id]/like` - Like/unlike post

### Reports
- `GET /api/reports?section=section_id` - Fetch reports
- `POST /api/reports` - Create report
- `POST /api/reports/[id]/comment` - Add comment

## Seeding Data

A seed script is included to create a demo user and sample content.

1. Ensure `node` and `npm` are installed.
2. Set your database URL in `.env.local` or rely on local MongoDB at `mongodb://127.0.0.1:27017/kenya-civic-app`.
3. Run:
   ```bash
   npm run seed
   ```
4. The script creates:
   - `demo@example.com` / `password123`
   - one sample post
   - one sample report

## Deployment

### Vercel

A `vercel.json` file is included for deployment to Vercel.

1. Push the repository to GitHub.
2. Create a Vercel project and connect the repo.
3. Add the following environment variables in Vercel:
   - `MONGODB_URI`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. Deploy.

### Docker

A `Dockerfile` is included for container deployment.

Build and run locally:
```bash
docker build -t kenya-civic-app .
docker run -p 3000:3000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your_secret" \
  kenya-civic-app
```

### GitHub Actions

A GitHub Actions workflow is configured at `.github/workflows/deploy.yml`.
It can build the app and deploy to Vercel when secrets are configured:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## File Structure

```
kenya-civic-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   └── [...nextauth]/
│   │   ├── posts/
│   │   │   └── [id]/
│   │   └── reports/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── posts/
│   ├── government/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── CreatePostForm.tsx
│   ├── PostsList.tsx
│   ├── PostCard.tsx
│   ├── ReportForm.tsx
│   ├── GovernmentSection.tsx
│   └── Providers.tsx
├── lib/
│   ├── auth.ts
│   └── db.ts
├── models/
│   ├── User.ts
│   ├── Post.ts
│   └── Report.ts
└── package.json
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

Follow Next.js deployment guide for Railway, Netlify, etc.

## Security Features

- Password hashing with bcryptjs
- JWT-based session management
- NextAuth.js for secure authentication
- MongoDB connection pooling
- Environment variable protection

## Future Enhancements

- Real-time notifications
- File storage (AWS S3)
- Advanced filtering and search
- Report tracking dashboard
- Email notifications
- Admin panel
- Verification badges

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your needs.

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for Kenya's civic engagement**
