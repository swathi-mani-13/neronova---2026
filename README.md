# NERONOVA 2026 // National Level AI/ML Hackathon

Official production website and administrative portal for **NERONOVA 2026**, built with a futuristic cyberpunk interface, real-time database architecture, and comprehensive administrative tooling.

---

## ⚡ Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Icons**: Lucide React
- **Export Engine**: SheetJS (`xlsx`) for multi-sheet Excel exports
- **Animation & FX**: Canvas Confetti, CSS keyframe physics (pendulum swinging spider, evil eye tracking)
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth) with automated high-fidelity local fallback persistence

---

## 🎨 Design Theme & Approved Aesthetics

- **Primary Colors**: Jet Black (`#090909`), Crimson Red (`#E50914`), Neon Red (`#FF3030`), White
- **Cyberpunk HUD**: Chamfered polygonal cards, neon glowing accents, HUD reticles, and subtle grid overlays
- **3D Visual Sentinel**: Approved futuristic cyborg robot and illuminated cyber city
- **Spider Sentinel**: Red futuristic arachnid with a glowing blue Evil Eye suspended from a thin thread with smooth left-to-right swinging animation and subtle mouse-responsive pupil tracking (displayed on all public pages, strictly excluded from the Admin Dashboard)

---

## 📍 Event Coordinates

- **Event**: NERONOVA 2026
- **Dates**: 27–28 January 2027
- **Time**: 9:30 AM – 4:30 PM (Offline Mode)
- **Venue**: HICET, Coimbatore, Tamil Nadu
- **Team Size**: 2 to 4 Members per team (Inter & Intra College)

---

## 🌐 9 Public Website Pages

1. **Home (`/`)**: Hero section with live countdown timer, event coordinates, Register CTA, robot visual, and 3 HUD feature cards (*Event Highlights*, *About the Hackathon*, *Event Schedule*).
2. **About the Event (`/about`)**: Vision, mission, operational pillars, host institution details, and benchmark criteria.
3. **Domains (`/domains`)**: 9 clickable domain cards that open interactive modals containing student-friendly scopes, project ideas, and recommended tech stacks:
   - AI in Healthcare
   - Smart Agriculture
   - AI in Education
   - FinTech and Business Intelligence
   - Smart Cities and Transportation
   - Industrial AI and Automation
   - Environment and Sustainability
   - Cybersecurity and Digital Safety
   - Generative AI and Creative Innovation
4. **Rules & Guidelines (`/rules`)**: Team eligibility (2–4 members), originality and Git commit requirements, hardware guidelines, and evaluation matrix.
5. **Schedule (`/schedule`)**: Day 1 and Day 2 detailed timeline with milestones.
6. **Prizes (`/prizes`)**: Strictly displays **`PRIZES & AWARDS`** and **`TO BE ANNOUNCED`**.
7. **FAQ (`/faq`)**: Interactive accordion addressing eligibility, logistics, venue support, and IP rights.
8. **Contact (`/contact`)**: Organizing leads, faculty coordinators, HICET campus location, and working enquiry form.
9. **Team Registration (`/register`)**: Complete team registration form with client and database duplicate checks, leader + member details (2 to 4 members), unique ID assignment (`NERO-2026-XXXX`), celebratory confetti, and printable pass.

---

## 🛡️ Protected Admin Portal (`/admin`)

Access via [`/admin/login`](http://localhost:3000/admin/login).

### Supported Roles:
- **Main Admin**: Full administrative rights (verify payment, update review status, delete records, export Excel).
- **Organizing Team**: Check-in verification, payment toggles, and Excel export.
- **Faculty Coordinator**: Academic proposal auditing, review notes, and Excel export.

### Real Database Statistics (Zero Fake Data):
- **Total Registered Teams**
- **Total Registered Members**
- **Inter College Teams**
- **Intra College Teams**
- **Paid Teams**
- **Unpaid Teams**
- **College-wise Breakdown**
- **Domain Distribution Breakdown**

### Excel Export (`.xlsx`):
One-click export generating an official workbook with 4 sheets:
1. *Registered Teams* (ID, Name, Domain, Category, Leader Info, Payment, Status)
2. *All Members Roster* (All individual student records)
3. *College Breakdown* (College participation counts)
4. *Domain Breakdown* (Domain popularity metrics)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Supabase)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(If no Supabase credentials are provided, the site automatically runs in local storage persistence mode with seeded initial teams for immediate offline testing).*

### 3. Run Supabase Database Migration
Execute the SQL script in `supabase-schema.sql` in the Supabase SQL Editor to set up tables, indexes, and Row Level Security (RLS) policies.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License
© 2026 NERONOVA. All rights reserved.
