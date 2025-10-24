# OILCHAIN360 Design Guidelines

## Design Approach: Carbon Design System
**Rationale**: Carbon Design System (IBM) is optimized for data-intensive enterprise applications with complex dashboards, analytics, and productivity workflows - perfect for an agricultural marketplace combining IoT data, blockchain transactions, and AI-powered analytics.

## Core Design Principles
1. **Data-First Clarity**: Prioritize information hierarchy and data visualization legibility
2. **Progressive Disclosure**: Show complexity gradually based on user role and context
3. **Trust Through Transparency**: Make blockchain transactions, IoT readings, and AI predictions clear and verifiable
4. **Mobile-Responsive Productivity**: Full functionality across devices for farmers in the field

---

## Typography System

**Font Family**: IBM Plex Sans (via Google Fonts CDN)
- Primary: IBM Plex Sans (400, 500, 600)
- Monospace: IBM Plex Mono (for data, prices, blockchain hashes)

**Hierarchy**:
- Hero Headlines: text-5xl md:text-6xl font-semibold
- Page Titles: text-3xl md:text-4xl font-semibold
- Section Headers: text-2xl font-semibold
- Card Titles: text-xl font-medium
- Body Text: text-base font-normal
- Data Labels: text-sm font-medium uppercase tracking-wide
- Metrics/Stats: text-4xl md:text-5xl font-semibold (IBM Plex Mono)
- Micro Text: text-xs text-gray-600

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing: p-2, gap-2 (data tables, compact lists)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Section spacing: p-6 md:p-8 (component padding)
- Major divisions: mb-8, py-12, gap-16 (page sections)

**Grid Structure**:
- Dashboard: 12-column grid with sidebar (sidebar: w-64, main: flex-1)
- Data Tables: Full-width with horizontal scroll on mobile
- Marketplace Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Analytics Panels: grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6

**Container Widths**:
- Dashboard content: max-w-screen-2xl mx-auto
- Marketing pages: max-w-7xl mx-auto
- Form containers: max-w-2xl mx-auto
- Data tables: w-full (responsive horizontal scroll)

---

## Component Library

### Navigation & Layout
**Top Navigation Bar**:
- Fixed header with search, notifications, profile dropdown
- Height: h-16, shadow-sm
- Quick actions: Add Listing, View Market, IoT Dashboard

**Sidebar Navigation** (Dashboard):
- Width: w-64, collapsible to w-16 on mobile
- Sections: Dashboard, Marketplace, My Listings, Analytics, IoT Devices, Blockchain Ledger, Export Opportunities, Settings
- Active state: Bold text with subtle left border accent

**Breadcrumbs**: 
- Below header, text-sm with icon separators (Heroicons chevron-right)

### Data Display Components
**Stat Cards**:
- Padding: p-6, rounded-lg border
- Layout: Icon (top-left) + Label (text-sm uppercase) + Value (text-3xl font-semibold) + Change indicator (text-sm with up/down icon)
- 3-4 cards per row on desktop

**Data Tables**:
- Zebra striping (subtle), sticky headers
- Row height: h-12, hover state with subtle background shift
- Sortable columns with icons
- Action menu (kebab icon) on row hover
- Pagination at bottom with items-per-page selector

**Price Charts** (AI Analytics):
- Full-width responsive charts using Chart.js or Recharts
- Time range selector (24h, 7d, 30d, 3m, 1y)
- Tooltip on hover with exact values
- Grid lines with low opacity

**IoT Device Cards**:
- Layout: Device icon + Name + Status badge + Last reading + Battery/connection indicator
- Real-time pulse animation for active devices (subtle glow)
- Grid layout: 2-3 cards per row

### Marketplace Components
**Product Listing Cards**:
- Image (aspect-ratio-4/3) + Title + By-product type badge + Quantity + Price + Quality score + Seller info + CTA button
- Hover: Subtle elevation increase
- Quick view modal on click

**Filter Sidebar**:
- Collapsible sections: By-product Type, Price Range, Quality Grade, Location, Certification
- Checkboxes and range sliders
- Active filter chips at top with clear option

**Transaction History**:
- Timeline layout with blockchain verification badges
- Status indicators: Pending, Verified, Completed, Disputed
- Smart contract address (truncated with copy button)

### Forms & Inputs
**Form Fields**:
- Label above input (text-sm font-medium mb-2)
- Input: h-11, rounded-md border px-4
- Helper text below (text-xs)
- Error state: Red border + error icon + message

**Quality Scanner Interface**:
- Camera viewfinder with overlay guides
- Real-time AI quality indicators overlay
- Capture button: Large, bottom-center
- Results panel: Quality score gauge + breakdown metrics

**Smart Contract Builder**:
- Step-by-step wizard (progress indicator at top)
- Fields: Buyer/Seller, Quantity, Price, Delivery terms, Payment conditions
- Preview panel (right side) showing contract in plain language
- Sign button with blockchain wallet integration

### Modals & Overlays
**Modal Structure**:
- Max-width: max-w-2xl (small), max-w-4xl (medium), max-w-6xl (large)
- Padding: p-6
- Header with title + close button
- Scrollable content area
- Footer with action buttons (right-aligned)

**Toast Notifications**:
- Position: top-right, fixed
- Types: Success (green accent), Error (red), Info (blue), Warning (yellow)
- Auto-dismiss after 5s with progress bar
- Icon + message + close button

### Buttons & Actions
**Primary Button**: 
- Height: h-11, px-6, rounded-md, font-medium
- Use for main CTAs (List Product, Confirm Purchase, Sign Contract)

**Secondary Button**: 
- Border variant, same sizing
- Use for cancel, view details

**Icon Buttons**: 
- Size: h-10 w-10, rounded-full
- Use for actions like edit, delete, share

**Floating Action Button** (Mobile):
- Fixed bottom-right, size: h-14 w-14, rounded-full
- Primary action (Add Listing, Scan Quality)

---

## Dashboard Layouts

### Farmer Dashboard:
**Hero Stats Row**: Active listings, Total earnings, Pending transactions, Carbon credits earned (4 stat cards)
**Main Content**: 
- Left (2/3): Price forecast chart + My listings table
- Right (1/3): Recent transactions + IoT device status + Export opportunities widget

### Processor/Buyer Dashboard:
**Search Bar**: Prominent at top with advanced filters
**Content Grid**: Available listings (cards) + Saved searches + Price alerts + Market trends chart

### Admin Dashboard:
**KPI Overview**: Platform volume, Active users, Transaction value, Disputes
**Sections**: User management table + Fraud detection alerts + Blockchain audit logs + System health monitors

---

## Animations (Minimal & Professional)

**Micro-interactions**:
- Button hover: Subtle brightness increase (duration-150)
- Card hover: transform scale-[1.02] shadow-lg transition-all duration-200
- Data refresh: Subtle spin icon for 1s when updating IoT/price data
- Number counter: Animated count-up for statistics (subtle, 0.5s)

**Page Transitions**:
- Fade-in content on route change (opacity 0 → 1, duration-300)
- Stagger children in lists (delay-50 increments)

**Avoid**: Parallax, complex scroll animations, auto-playing videos

---

## Icons
**Library**: Heroicons (via CDN)
**Usage**:
- Navigation: outline variant, size-6
- Buttons: size-5 (inline with text)
- Data metrics: size-8 to size-12 (prominent)
- Status indicators: size-4 (with badges)

---

## Images

**Hero Section** (Marketing Landing):
- Large hero image: Agricultural field with farmer using mobile device, modern/tech feel
- Position: Full-width, height: 70vh, with gradient overlay for text readability
- CTA buttons on blur background (backdrop-blur-sm bg-white/20)

**Dashboard**:
- User avatars: Circular, size-10 in headers, size-8 in listings
- Product images: Rectangular, consistent aspect ratio in marketplace
- IoT device illustrations: SVG icons, not photos

**Empty States**:
- Illustrations for no listings, no data, no devices connected
- Style: Simple line art, isometric or flat style

---

## Special Features

**Blockchain Explorer Widget**:
- Compact transaction hash display with verification badge
- Click to expand: Full transaction details, block number, timestamp, gas fees
- Visual chain link icon animation

**Export Matchmaking Interface**:
- Map view showing global demand hotspots
- Match score indicator (0-100) for opportunities
- Quick contact/inquiry buttons

**Carbon Credit Tracker**:
- Circular progress gauge showing credits earned
- Breakdown: By-product reuse + Efficient logistics + Sustainable practices
- NFT-style visual for achieved milestones

This design system balances enterprise-grade data presentation with agricultural accessibility, ensuring farmers can efficiently monetize by-products while processors and exporters access reliable market intelligence.