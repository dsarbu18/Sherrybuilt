# Sheridan Built - General Contractor Website

A modern, professional website for Sheridan Built general contractors, featuring quote request forms, service showcases, and customer testimonials.

## 🌐 Live Site

- **GitHub Pages:** https://dsarbu18.github.io/Sherrybuilt/
- **Future Custom Domain:** sheridanbuilt.com (when configured)

## ✨ Features

- 🏠 **Modern Homepage** - Hero section with compelling CTAs
- 📋 **Quote Request System** - Fully functional form with email notifications
- 🛠️ **Services Showcase** - Kitchen remodeling, bathroom renovations, home additions, basement finishing
- ⭐ **Client Testimonials** - 5-star reviews from satisfied customers
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Professional UI** - Built with Material-UI and Tailwind CSS
- ⚡ **Fast Performance** - Optimized React application with smooth animations

## 🚀 Quick Start

### Development

```bash
# This is a Figma Make project
# Preview it directly in Figma Make
```

### Production Build

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# The dist folder contains the built site ready for deployment
```

## 📦 Tech Stack

- **Framework:** React 18.3 with TypeScript
- **Router:** React Router 7
- **Styling:** Material-UI 7 + Tailwind CSS 4
- **Build Tool:** Vite 6
- **Animations:** Motion (Framer Motion)
- **Backend:** Supabase Edge Functions
- **Email:** Resend API
- **Icons:** Lucide React
- **Forms:** React Hook Form

## 📄 Pages

1. **Home** (`/`) - Main landing page with all sections
2. **Quote Request** (`/quote`) - Dedicated quote request form
3. **Our Story** (`/our-story`) - Company information

## 🔧 Configuration

### Environment Variables (Supabase)

The following environment variables are configured in Supabase:

- `RESEND_API_KEY` - API key for sending emails
- `CONTRACTOR_EMAIL` - Email address to receive quote requests
- `SUPABASE_URL` - Auto-configured
- `SUPABASE_ANON_KEY` - Auto-configured

### Deployment Settings

- **Base Path:** `/Sherrybuilt/` (for GitHub Pages)
- **Router Basename:** `/Sherrybuilt` (production only)
- **Build Output:** `dist/`

## 📧 Quote Request System

When a visitor submits a quote request:

1. Form data is validated on the frontend
2. Request is sent to Supabase Edge Function
3. Data is stored in Supabase KV store
4. Email notification is sent via Resend API
5. User receives confirmation message

### Email Template

Emails include:
- Client contact information
- Project details and requirements
- Service requested
- Preferred contact method
- Timestamp and unique request ID

## 🎨 Design Features

- **Color Scheme:** Blue/Gray professional palette
- **Typography:** Clean, modern fonts
- **Animations:** Smooth transitions and hover effects
- **Images:** High-quality Unsplash photography
- **Layout:** Grid-based responsive design

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

## 🔐 Security

- Environment variables stored securely in Supabase
- API keys never exposed to frontend
- CORS properly configured
- Input validation on all forms

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[GitHub Actions Workflow](./.github/workflows/deploy.yml)** - Auto-deployment configuration

## 🐛 Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting) for common issues and solutions.

## 📝 License

Private project for Sheridan Built general contracting business.

## 🤝 Support

For questions about the website, contact the development team or refer to the deployment documentation.

---

Built with ❤️ using Figma Make
