# Frontend Components Analysis - CSS Classes Inventory

## Overview
This document catalogues all CSS classes used across 16 JSX component files in the `frontend/src/components` directory, identifies Tailwind classes, and notes missing or incomplete CSS definitions.

---

## 1. UI COMPONENTS (`components/ui/`)

### Avatar.jsx
**Tailwind Classes Used:**
- `w-6`, `h-6`, `text-xs` (xs size)
- `w-8`, `h-8`, `text-xs` (sm size)
- `w-10`, `h-10`, `text-sm` (md size)
- `w-14`, `h-14`, `text-base` (lg size)
- `w-20`, `h-20`, `text-xl` (xl size)
- `w-28`, `h-28`, `text-2xl` (2xl size)
- `rounded-full` (border radius)
- `object-cover` (image fit)
- `ring-2` (border ring)
- `ring-surface-3` ⚠️ **MISSING** - Custom color not in standard Tailwind
- `flex-shrink-0`
- `bg-gradient-to-br`, `from-brand-500`, `to-brand-700` ⚠️ **MISSING** - Custom colors
- `flex`, `items-center`, `justify-center`
- `font-display` ⚠️ **MISSING** - Custom font family
- `font-bold`
- `text-white`

**Custom Classes Missing from CSS:**
- `ring-surface-3` (CSS class not defined)
- `brand-500`, `brand-700` (Tailwind color not configured)
- `font-display` (font family)

---

### Button.jsx
**Custom Classes Used:**
- `btn-primary` ✅ (defined)
- `btn-secondary` ⚠️ **MISSING**
- `btn-ghost` ⚠️ **MISSING**
- `btn` (generic button class)
- `bg-red-500/10`, `hover:bg-red-500/20` ✅ (Tailwind opacity)
- `text-red-400` ✅ (Tailwind red)
- `px-5`, `py-2.5`, `text-sm` ✅ (Tailwind spacing)
- `btn-sm` ⚠️ **MISSING**
- `px-7`, `py-3.5`, `text-base`, `rounded-2xl` ✅ (Tailwind)
- `w-4`, `h-4`, `border-2`, `border-current`, `border-t-transparent`, `rounded-full`, `animate-spin` ✅

**Missing Button Variants:**
- `btn-secondary` class not defined in CSS
- `btn-ghost` class not defined in CSS
- `btn-sm` size variant not defined in CSS

---

### Input.jsx
**Tailwind Classes Used:**
- `flex`, `flex-col`, `gap-1.5` ✅
- `text-xs`, `font-medium`, `text-zinc-400` ⚠️ `text-zinc-400` (non-standard, missing Tailwind config)
- `uppercase`, `tracking-wider` ✅
- `input` ⚠️ **MISSING** - Custom input class
- `border-red-500`, `focus:border-red-500`, `focus:ring-red-500` ⚠️ (Tailwind error styles not in config)
- `text-red-400`, `mt-0.5` ✅

**Missing Classes:**
- `input` base class not defined in CSS
- Error state styling may be incomplete

---

### Loader.jsx
**Tailwind Classes Used:**
- `w-4`, `h-4`, `w-6`, `h-6`, `w-10`, `h-10` ✅
- `border-2` ✅
- `border-surface-4` ⚠️ **MISSING** - Custom surface color
- `border-t-brand-500` ⚠️ **MISSING** - Custom brand color
- `rounded-full`, `animate-spin`, `inline-block` ✅
- `fixed`, `inset-0`, `bg-surface` ⚠️ `bg-surface` **MISSING** - Not standard Tailwind
- `flex`, `items-center`, `justify-center`, `z-50` ✅
- `font-display`, `font-bold`, `text-2xl`, `text-brand-500` ⚠️ Missing custom classes
- `tracking-tight` ✅
- `card` ⚠️ **MISSING** - Custom card class
- `p-5` ✅
- `animate-pulse` ✅
- `flex-shrink-0` ✅
- `space-y-2` ✅
- `bg-surface-3` ⚠️ **MISSING**
- `rounded` ✅
- `w-1/3`, `w-full`, `w-4/5`, `w-3/5` ✅
- `py-8` ✅

**Custom Classes Missing:**
- `bg-surface`, `bg-surface-3`, `bg-surface-4` (surface color system)
- `card` (card component class)
- `border-t-brand-500` (brand color)

---

### Modal.jsx
**Tailwind Classes Used:**
- `fixed`, `inset-0`, `z-50`, `flex`, `items-center`, `justify-center`, `p-4` ✅
- `absolute`, `bg-black/70`, `backdrop-blur-sm` ✅
- `relative`, `w-full`, `max-w-lg` ✅
- `card` ⚠️ **MISSING**
- `p-6` ✅
- `shadow-2xl` ✅
- `animate-slide-up` ⚠️ **MISSING** - Custom animation not in CSS
- `font-display`, `font-bold`, `text-lg`, `text-zinc-100` ⚠️ Missing custom classes
- `mb-5` ✅
- `p-1.5`, `rounded-lg`, `hover:bg-surface-3` ⚠️ Missing surface color
- `text-zinc-400`, `hover:text-zinc-100` ⚠️ Non-standard Tailwind
- `transition-colors` ✅
- `w-5`, `h-5` ✅

**Missing Animations/Classes:**
- `animate-slide-up` animation not defined
- `card` class
- `bg-surface-3` color variant

---

## 2. LAYOUT COMPONENTS (`components/layout/`)

### MainLayout.jsx
**Classes Used:**
- `app-layout` ✅ (defined)
- `mobile-nav` ✅ (defined)
- `mobile-nav-inner` ✅ (defined)
- `mobile-nav-btn` ✅ (defined)

**Status:** ✅ All defined

---

### Navbar.jsx
**Status:** Uses inline styles instead of CSS classes - not ideal for styling consistency

---

### Sidebar.jsx
**Classes Used:**
- `sidebar` ✅ (defined)
- `sidebar-logo` ✅ (defined)
- `sidebar-logo-mark` ✅ (defined)
- `sidebar-logo-text` ✅ (defined)
- `sidebar-nav` ✅ (defined)
- `nav-item` ✅ (defined)
- `nav-item.active` ✅ (defined)
- `sidebar-user` ✅ (defined)
- `sidebar-user-info` ⚠️ **MISSING** - Component uses this but CSS has `user-info` instead
- `sidebar-user-name` ⚠️ **MISSING** - Component uses this but CSS has `user-name` instead
- `sidebar-user-handle` ⚠️ **MISSING** - Component uses this but CSS has `user-handle` instead

**Issues Found:**
- Naming inconsistency: CSS uses `user-info`, `user-name`, `user-handle` but component uses `sidebar-user-info`, `sidebar-user-name`, `sidebar-user-handle`

---

### RightPanel.jsx
**Classes Used:**
- `right-panel` ✅ (defined)
- `search-wrap` ⚠️ **MISSING** - Not defined in CSS
- `search-results` ⚠️ **MISSING** - Not defined in CSS (component uses inline position styles)
- `search-result-item` ✅ (defined)
- `search-result-name` ⚠️ **MISSING** - Not defined in CSS
- `search-result-handle` ⚠️ **MISSING** - Not defined in CSS
- `panel-card` ⚠️ **MISSING** - Not defined in CSS
- `panel-title` ⚠️ **MISSING** - Not defined in CSS
- `suggest-item` ⚠️ **MISSING** - Not defined in CSS
- `suggest-info` ⚠️ **MISSING** - Not defined in CSS
- `suggest-name` ⚠️ **MISSING** - Not defined in CSS
- `suggest-handle` ⚠️ **MISSING** - Not defined in CSS
- `btn-follow-sm` ⚠️ **MISSING** - Not defined in CSS

**Missing Classes (Should be added):**
```
.search-wrap { /* Search input wrapper */ }
.search-results { /* Results dropdown */ }
.search-result-name { /* Result name text */ }
.search-result-handle { /* Result username text */ }
.panel-card { /* Suggestion/trending card */ }
.panel-title { /* Panel section title */ }
.suggest-item { /* Suggested user item */ }
.suggest-info { /* Info section of suggestion */ }
.suggest-name { /* User name in suggestion */ }
.suggest-handle { /* Username in suggestion */ }
.btn-follow-sm { /* Small follow button */ }
```

---

## 3. POST COMPONENTS (`components/post/`)

### PostCard.jsx
**Classes Used:**
- `post-card` ✅ (defined)
- `post-header` ✅ (defined)
- `post-author` ⚠️ **MISSING** - Not defined in CSS
- `post-author-info` ⚠️ **MISSING** - Not defined in CSS
- `post-author-name` ⚠️ **MISSING** - Not defined in CSS
- `post-author-handle` ⚠️ **MISSING** - Not defined in CSS
- `post-time` ✅ (defined)
- `post-content` ✅ (defined)
- `post-image` ✅ (defined)
- `post-actions` ✅ (defined)
- `action-btn` ✅ (defined)
- `action-btn.liked` ✅ (defined)

**Missing Classes:**
```
.post-author { /* Author section wrapper */ }
.post-author-info { /* Author name and handle container */ }
.post-author-name { /* Author display name */ }
.post-author-handle { /* Author @username */ }
```

---

### PostList.jsx
**Classes Used:**
- `empty-state` ⚠️ **MISSING** - Not defined in CSS
- `empty-icon` ⚠️ **MISSING** - Not defined in CSS
- `empty-title` ⚠️ **MISSING** - Not defined in CSS

**Missing Classes:**
```
.empty-state { /* Empty state container */ }
.empty-icon { /* Empty state icon */ }
.empty-title { /* Empty state message */ }
```

---

### CreatePost.jsx
**Classes Used:**
- `composer` ⚠️ **MISSING** - Not defined in CSS (CSS has `create-post` instead)
- `composer-row` ⚠️ **MISSING** - Not defined in CSS (CSS has `create-post-header` instead)
- `composer-input` ⚠️ **MISSING** - Not defined in CSS (CSS has `create-post-input` instead)
- `composer-footer` ⚠️ **MISSING** - Not defined in CSS (CSS has `create-post-actions` instead)
- `composer-actions` ⚠️ **MISSING** - Not defined in CSS (CSS has `create-post-icons` instead)
- `icon-btn` ✅ (defined)
- `char-count` ⚠️ **MISSING** - Not defined in CSS
- `char-count.warn` ⚠️ **MISSING** - Not defined in CSS
- `btn-post` ✅ (defined)

**Naming Inconsistency Issues:**
| Component Class | CSS Class | Notes |
|---|---|---|
| `composer` | `create-post` | Should align |
| `composer-row` | `create-post-header` | Should align |
| `composer-input` | `create-post-input` | Should align |
| `composer-footer` | `create-post-actions` | Should align |
| `composer-actions` | `create-post-icons` | Should align |

**Additional Missing:**
```
.char-count { /* Character counter */ }
.char-count.warn { /* Warning state for char count */ }
```

---

### CommentSection.jsx
**Classes Used:**
- `comments-section` ⚠️ **MISSING** - Not defined in CSS
- `comment-item` ⚠️ **MISSING** - Not defined in CSS
- `comment-body` ⚠️ **MISSING** - Not defined in CSS
- `comment-author` ⚠️ **MISSING** - Not defined in CSS
- `comment-text` ⚠️ **MISSING** - Not defined in CSS
- `comment-input-row` ⚠️ **MISSING** - Not defined in CSS
- `comment-input` ⚠️ **MISSING** - Not defined in CSS
- `btn-comment` ⚠️ **MISSING** - Not defined in CSS

**Missing Classes:**
```
.comments-section { /* Comment section container */ }
.comment-item { /* Individual comment */ }
.comment-body { /* Comment content wrapper */ }
.comment-author { /* Comment author name */ }
.comment-text { /* Comment text content */ }
.comment-input-row { /* Comment form */ }
.comment-input { /* Comment input field */ }
.btn-comment { /* Post comment button */ }
```

---

## 4. USER COMPONENTS (`components/user/`)

### UserCard.jsx
**Classes Used:**
- `suggest-item` ⚠️ **MISSING** - Not defined in CSS
- `suggest-info` ⚠️ **MISSING** - Not defined in CSS
- `suggest-name` ⚠️ **MISSING** - Not defined in CSS
- `suggest-handle` ⚠️ **MISSING** - Not defined in CSS

**Status:** Same as RightPanel.jsx - missing suggestion UI classes

---

### ProfileHeader.jsx
**Classes Used:**
- `profile-card` ⚠️ **MISSING** - Not defined in CSS
- `profile-cover` ⚠️ **MISSING** - Not defined in CSS
- `profile-cover-gradient` ⚠️ **MISSING** - Not defined in CSS
- `profile-info` ⚠️ **MISSING** - Not defined in CSS
- `profile-top` ⚠️ **MISSING** - Not defined in CSS
- `profile-avatar-wrap` ⚠️ **MISSING** - Not defined in CSS
- `profile-avatar-border` ⚠️ **MISSING** - Not defined in CSS
- `btn-edit` ⚠️ **MISSING** - Not defined in CSS
- `profile-name` ⚠️ **MISSING** - Not defined in CSS
- `profile-handle` ⚠️ **MISSING** - Not defined in CSS
- `profile-bio` ⚠️ **MISSING** - Not defined in CSS
- `profile-stats` ⚠️ **MISSING** - Not defined in CSS
- `stat` ⚠️ **MISSING** - Not defined in CSS (but `.stat` IS defined)
- `stat-num` ⚠️ **MISSING** - Not defined in CSS
- `stat-label` ⚠️ **MISSING** - Not defined in CSS
- `fade-up` ⚠️ **MISSING** - Custom animation not in CSS

**Missing Classes:**
```
.profile-card { /* Profile header card */ }
.profile-cover { /* Cover image area */ }
.profile-cover-gradient { /* Gradient overlay */ }
.profile-info { /* Profile info section */ }
.profile-top { /* Top section with avatar */ }
.profile-avatar-wrap { /* Avatar wrapper */ }
.profile-avatar-border { /* Avatar border/ring */ }
.btn-edit { /* Edit profile button */ }
.profile-name { /* Profile display name */ }
.profile-handle { /* Profile @username */ }
.profile-bio { /* Bio text */ }
.profile-stats { /* Stats container */ }
.stat-num { /* Number in stat */ }
.stat-label { /* Label in stat */ }

/* Animation */
@keyframes fade-up { /* Fade and slide up animation */ }
.fade-up { /* Apply fade-up animation */ }
```

---

### FollowButton.jsx
**Classes Used:**
- `btn-unfollow` ⚠️ **MISSING** - Not defined in CSS
- `btn-follow` ⚠️ **MISSING** - Not defined in CSS

**Missing Classes:**
```
.btn-follow { /* Follow button */ }
.btn-unfollow { /* Unfollow button */ }
```

---

## SUMMARY OF ISSUES

### 🔴 Critical Missing Classes (Cannot Find in CSS)

**UI Components:**
1. `input` - Base input styling
2. `card` - Card component styling
3. `animate-slide-up` - Modal animation
4. `btn-secondary`, `btn-ghost`, `btn-sm` - Button variants
5. Surface color system: `bg-surface`, `bg-surface-3`, `bg-surface-4`
6. Brand color system: `from-brand-500`, `to-brand-700`, `border-t-brand-500`
7. Font system: `font-display`

**Layout Components:**
8. `search-wrap` - Search input container
9. `search-results` - Search dropdown
10. `search-result-name`, `search-result-handle`
11. `panel-card` - Suggestion panel card
12. `panel-title` - Panel section title
13. `suggest-item`, `suggest-info`, `suggest-name`, `suggest-handle`
14. `btn-follow-sm` - Small follow button

**Post Components:**
15. `post-author` - Author section wrapper
16. `post-author-info`, `post-author-name`, `post-author-handle`
17. `empty-state`, `empty-icon`, `empty-title`
18. Naming conflict: `composer*` classes vs CSS `create-post*` classes
19. `char-count` - Character counter
20. `comments-section`, `comment-item`, `comment-body`
21. `comment-author`, `comment-text`, `comment-input-row`, `comment-input`
22. `btn-comment` - Post comment button

**User Components:**
23. `profile-card`, `profile-cover`, `profile-cover-gradient`
24. `profile-info`, `profile-top`, `profile-avatar-wrap`, `profile-avatar-border`
25. `btn-edit` - Edit profile button
26. `profile-name`, `profile-handle`, `profile-bio`
27. `profile-stats`, `stat-num`, `stat-label`
28. `btn-follow`, `btn-unfollow` - Follow buttons
29. `fade-up` - Animation

### ⚠️ Naming Inconsistencies

1. **Sidebar User Info**: Component uses `sidebar-user-info/name/handle` but CSS defines `user-info/name/handle`
2. **Create Post**: Component uses `composer*` classes but CSS uses `create-post*` classes

### 📝 Tailwind Configuration Issues

Missing from Tailwind config or custom classes:
- Surface color system (`surface`, `surface-3`, `surface-4`)
- Brand color system (`brand-500`, `brand-700`)
- Font family: `font-display`
- Custom zinc colors for dark theme

---

## RECOMMENDATIONS

### Priority 1: Add Missing Core Classes
- [ ] Add `.input` base styling
- [ ] Add `.card` component styling
- [ ] Add color system variables (surface, brand)
- [ ] Add font-family system

### Priority 2: Fix Naming Inconsistencies
- [ ] Rename sidebar user classes OR update CSS
- [ ] Rename composer classes OR update CSS to match

### Priority 3: Add Missing UI Classes
- [ ] Button variants: `btn-secondary`, `btn-ghost`, `btn-sm`
- [ ] Follow/Unfollow button styles
- [ ] Profile component styles
- [ ] Comment section styles
- [ ] Suggestion/trending panel styles

### Priority 4: Add Missing Animations
- [ ] `animate-slide-up` for modal
- [ ] `fade-up` for profile card

### Priority 5: Extend Tailwind Config
- [ ] Add surface color palette
- [ ] Add brand color palette
- [ ] Add font-display to font families
- [ ] Add custom animations

