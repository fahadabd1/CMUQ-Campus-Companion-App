# CMUQ Campus Companion App - Design Specifications

## Design System

### Color Palette

**Primary Colors:**
- Primary: Indigo (#3F51B5)
- Primary Hover: Indigo Dark (#303F9F)
- Accent: Amber (#FFC107)
- Accent Hover: Amber Dark (#FFA000)

**Neutral Colors:**
- Background: White (#FFFFFF) / Dark mode: (#1A1A1A)
- Surface: Gray-50 (#F9FAFB) / Dark mode: (#2D2D2D)
- Text Primary: Gray-900 (#111827) / Dark mode: (#F3F4F6)
- Text Secondary: Gray-600 (#4B5563) / Dark mode: (#9CA3AF)
- Border: Gray-200 (#E5E7EB) / Dark mode: (#374151)

**Status Colors:**
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Warning: Amber (#F59E0B)
- Info: Blue (#3B82F6)

### Typography

**Font Family:**
- Primary: Roboto Light
- Fallback: system-ui, -apple-system, sans-serif

**Font Sizes:**
- Heading 1: 24px (1.5rem) - Bold
- Heading 2: 20px (1.25rem) - Semibold
- Heading 3: 18px (1.125rem) - Medium
- Body: 16px (1rem) - Regular
- Small: 14px (0.875rem) - Regular
- Caption: 12px (0.75rem) - Light

**Line Heights:**
- Headings: 1.2
- Body: 1.5
- Small text: 1.4

### Spacing System

**Base Unit:** 4px

**Spacing Scale:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 20px
- xl: 24px
- 2xl: 32px
- 3xl: 48px

**Container Padding:**
- Mobile: 16px
- Safe area top: 48px (for status bar)
- Bottom navigation clearance: 80px

### Mobile Constraints

**Container:**
- Maximum width: 448px (max-w-md)
- Center alignment on larger screens
- Full width on mobile devices

**Touch Targets:**
- Minimum size: 44px × 44px
- Recommended: 48px × 48px
- Bottom navigation icons: 60px × 60px

## Component Specifications

### Navigation

#### Bottom Navigation Bar
- **Height:** 60px
- **Position:** Fixed bottom with safe area padding
- **Background:** White with top border (1px gray-200)
- **Icons:** 24px × 24px, centered in 60px touch targets
- **Active State:** Primary color (#3F51B5) with text label
- **Inactive State:** Gray-600 (#4B5563)
- **Labels:** 10px font size below icons
- **Shadow:** 0 -2px 10px rgba(0,0,0,0.1)

### Cards

#### Event Card
- **Padding:** 16px
- **Border Radius:** 8px
- **Background:** White
- **Border:** 1px solid gray-200
- **Shadow:** 0 1px 3px rgba(0,0,0,0.1)
- **Hover State:** Shadow increases, cursor pointer
- **Active State:** Scale 0.98 transform

**Content Structure:**
- Title: 16px semibold, text-gray-900
- Time: 14px with clock icon, text-gray-600
- Location: 14px with map-pin icon, text-gray-600
- Category Badge: 12px, colored background with white text

#### Schedule Card
- **Layout:** Horizontal time | vertical content separator
- **Time Column:** 80px width, right-aligned
- **Content:** Flex-grow with 12px left padding
- **Course Name:** 16px medium
- **Room Number:** 14px text-gray-600
- **Duration Bar:** 2px left border, primary color

### Forms

#### Input Fields
- **Height:** 48px (mobile optimized)
- **Padding:** 12px horizontal
- **Border:** 1px solid gray-300
- **Border Radius:** 6px
- **Focus State:** Primary color border, ring effect
- **Font Size:** 16px (prevents zoom on iOS)

#### Buttons

**Primary Button:**
- **Height:** 48px
- **Padding:** 12px 24px
- **Background:** Primary color (#3F51B5)
- **Text:** White, 16px medium
- **Border Radius:** 6px
- **Active State:** Scale 0.98, darker background

**Secondary Button:**
- **Height:** 48px
- **Border:** 1px solid gray-300
- **Background:** White
- **Text:** Gray-700
- **Hover:** Gray-50 background

**Icon Button:**
- **Size:** 40px × 40px
- **Border Radius:** Full (circular)
- **Icon Size:** 20px × 20px

### Modals and Sheets

#### Modal
- **Background Overlay:** rgba(0,0,0,0.5)
- **Content Background:** White
- **Border Radius:** 12px top corners only
- **Padding:** 20px
- **Max Height:** 90vh
- **Animation:** Slide up from bottom

#### Filter Sheet (Mobile)
- **Width:** 280px
- **Position:** Fixed right, full height
- **Animation:** Slide in from right
- **Background:** White
- **Shadow:** -2px 0 10px rgba(0,0,0,0.1)

## Screen Layouts

### Home Screen

**Header:**
- Welcome message with current date
- 24px bold title
- 14px gray-600 subtitle

**Campus Map Section:**
- Height: 200px
- Interactive preview with "View Full Map" overlay button
- Border radius: 8px

**Recent Events:**
- Tab switcher: "Today" | "Tomorrow"
- Event cards in vertical scroll
- 16px gap between cards

### Schedule Screen

**Week Navigation:**
- Horizontal date selector
- Current week display with arrows
- Active day highlighted with primary color

**Day View:**
- Time slots from 8:00 AM to 8:00 PM
- 1-hour increments
- Classes displayed as cards with time alignment

**Add Event Button:**
- Floating action button style
- Bottom-right position (20px offset)
- Primary color with plus icon

### Lost & Found Screen

**Filter Tabs:**
- Horizontal scroll
- Active tab with primary color underline
- 12px horizontal padding per tab

**Item Grid:**
- 2-column grid on mobile
- 12px gap between items
- Image aspect ratio: 1:1
- Badge overlay for Lost/Found status

**Report Button:**
- Sticky header position
- Primary color button

### Map Screen

**Search Bar:**
- Fixed top position below header
- 48px height
- Filter icon button right-aligned

**Floor Selector:**
- Horizontal tabs: Floor 1 | Floor 2 | Floor 3
- Active floor with primary background
- Sticky position below search

**Interactive Map:**
- Full screen minus header/tabs
- SVG-based floor plan
- Room states:
  - Available: Green (#10B981)
  - Occupied: Red (#EF4444)
  - Selected: Blue (#3B82F6)
- Touch to select room
- Selected room info overlay

**Room Information Card:**
- Appears on room selection
- Fixed bottom position
- Slides up animation
- Contains: Room number, capacity, department, availability

### Event Details Screen

**Hero Section:**
- Event image: 16:9 aspect ratio
- Gradient overlay for text readability
- Back button overlay (top-left)

**Content Sections:**
- 20px padding
- Section spacing: 24px
- Dividers between major sections

**RSVP Section:**
- Warning background if deadline approaching
- Google Forms link as text link (not button)
- RSVP deadline prominently displayed

**Action Buttons:**
- Fixed bottom or inline
- Share and Save event options

### Settings Screen (Others)

**Section Headers:**
- 12px uppercase, gray-600
- 16px top margin

**List Items:**
- 48px minimum height
- Right arrow icon for navigation items
- Toggle switches right-aligned
- Divider lines between items

## Interaction Patterns

### Touch Feedback
- **Buttons:** Scale to 0.98 on press
- **Cards:** Subtle shadow increase on press
- **List Items:** Background color change to gray-50

### Navigation Transitions
- **Screen Changes:** Slide animations (200ms)
- **Modal/Sheet:** Slide up/in (300ms)
- **Tab Changes:** Instant with fade

### Loading States
- **Skeleton Screens:** Animated pulse effect
- **Spinner:** Primary color, centered
- **Pull to Refresh:** Standard iOS/Android patterns

### Error States
- **Inline Errors:** Red text below inputs
- **Toast Messages:** Bottom position, 3-second duration
- **Empty States:** Centered illustration with message

## Responsive Breakpoints

**Mobile First Approach:**
- Base: 0-640px (Mobile)
- sm: 640px+ (Tablet portrait)
- md: 768px+ (Tablet landscape)
- lg: 1024px+ (Desktop)

**Container Behavior:**
- Mobile: Full width with padding
- Tablet+: Max-width 448px, centered

## Accessibility

### Touch Targets
- Minimum 44px × 44px for all interactive elements
- 8px minimum spacing between targets
- Clear focus indicators for keyboard navigation

### Color Contrast
- Normal text: 4.5:1 minimum ratio
- Large text: 3:1 minimum ratio
- Interactive elements: Clear visual distinction

### Text Handling
- Line clamping for long text (2-3 lines max)
- Ellipsis for truncated text
- Readable font sizes (minimum 12px)

## Platform-Specific Considerations

### iOS
- Safe area insets for notch/home indicator
- Rubber band scrolling enabled
- Native date/time pickers
- San Francisco font alternative

### Android
- Material Design ripple effects
- Back button navigation support
- Native share sheet
- Roboto font primary

## Dark Mode

**Automatic Detection:** Follow system preference

**Color Adaptations:**
- Backgrounds: Inverted with reduced contrast
- Primary colors: Slightly lighter tones
- Shadows: Reduced or eliminated
- Borders: Lighter in dark mode

**Component Adjustments:**
- Cards: Dark surface color
- Inputs: Dark background with light borders
- Navigation: Dark background with adjusted icons