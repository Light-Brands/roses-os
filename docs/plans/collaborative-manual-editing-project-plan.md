# Collaborative Manual Editing System
## Project Plan

---

### What We're Building

A web-based system where multiple collaborators can edit, translate, and export sacred teaching manuals — without needing any technical skills or Git access.

---

### The Manuals

| Manual | Status |
|--------|--------|
| Rose Meditation Level 1 | Existing content to migrate |
| Rose Meditation Level 2 | Existing content to migrate |
| Rose Meditation Level 3 | Existing content to migrate |
| Aura Level 1 | New — to be created |
| *(More can be added later)* | — |

---

### Languages Supported

| Language | Status |
|----------|--------|
| English | Already supported |
| Portuguese | Already supported |
| Spanish | Already supported |
| Greek | Already supported |
| **Russian** | **New — to be added** |
| **Ukrainian** | **New — to be added** |

Each manual can be independently edited in each language. Switching languages shows that language's version of the manual.

---

### Two Levels of Access

The system uses simple 4-digit PIN codes (no accounts or passwords to remember).

**Editor PIN** — For collaborators who create and update manual content
- Edit text in any manual and any language
- Upload and replace images
- Add, remove, and reorder sections
- Download manuals in any format

**Teacher PIN** — For teachers who need to view and print manuals
- View manuals in read-only mode
- Download manuals as PDF, Word, or Markdown
- Switch between languages
- Cannot edit content

Both PINs are configurable from the admin dashboard — no code changes needed to update them.

---

### How Editing Works

The editor uses a **block-based approach** (similar to Notion). Each manual is made up of ordered blocks that editors can add, edit, move, and delete.

**Block types available:**

| Block | What it does |
|-------|-------------|
| **Heading** | Section titles — choose from large (h1), medium (h2), or small (h3) |
| **Text** | Paragraphs of content with basic formatting (bold, italic, lists) |
| **Image** | Upload a photo or illustration with an optional caption |
| **Divider** | A decorative horizontal line between sections |
| **Page Break** | Forces a new page when the manual is printed/exported |

**Editing features:**
- Click any block to edit it in place
- Use arrow buttons to move blocks up or down
- Click "+" between blocks to insert a new one
- Changes save automatically (no save button needed)
- A small indicator shows "Saving..." and "Saved" so you know it worked

---

### Downloading & Printing

Teachers and editors can download any manual in three formats:

| Format | Best for |
|--------|----------|
| **PDF** | Printing physical copies — formatted for US Letter size (8.5" x 11") with proper margins, fonts, and images |
| **Word (DOCX)** | Further editing in Microsoft Word or Google Docs if needed |
| **Markdown** | Simple text backup or use in other systems |

All formats maintain the manual's structure, headings, images, and page breaks.

---

### Where You Find It

| URL | What you see |
|-----|-------------|
| `/manuals` | PIN entry screen, then a grid of all available manuals |
| `/manuals/rose-meditation-1` | Rose Meditation Level 1 — editor or viewer depending on your PIN |
| `/manuals/aura-1?locale=pt` | Aura Level 1 in Portuguese |

---

### Admin Controls

In the existing admin dashboard, a new **Manual Access PINs** section lets admins:
- View and change the Editor PIN
- View and change the Teacher PIN
- Changes take effect immediately for new sessions

---

### How Content Is Stored

- All manual text and structure is stored in the **Supabase database** (cloud)
- Images are stored in **Supabase file storage** (cloud)
- This means multiple editors can work from different locations
- No files need to be checked into Git to update content
- Content is backed up automatically by Supabase

---

## Implementation Phases

### Phase 1: Foundation
*Core infrastructure and access control*

- [ ] Add Russian and Ukrainian language support across the site
- [ ] Create the database table for manual content sections
- [ ] Build the two-tier PIN gate (editor vs. teacher access)
- [ ] Add PIN management to the admin dashboard
- [ ] Set up the `/manuals` route and manual listing page

### Phase 2: Block Editor
*The editing experience for collaborators*

- [ ] Build the API for creating, updating, deleting, and reordering blocks
- [ ] Build image upload functionality
- [ ] Create all five block types (heading, text, image, divider, page break)
- [ ] Build the block toolbar for inserting new blocks
- [ ] Build block controls (move up/down, delete)
- [ ] Wire up auto-save with visual feedback
- [ ] Build the main editor page that ties it all together

### Phase 3: Viewer & Export
*Reading and downloading for teachers*

- [ ] Build the read-only manual viewer
- [ ] Build PDF export (US Letter, branded formatting)
- [ ] Build Word/DOCX export
- [ ] Build Markdown export
- [ ] Add download buttons to the viewer
- [ ] Connect editor/viewer to PIN role (editors edit, teachers view)

### Phase 4: Content & Polish
*Populating and refining*

- [ ] Migrate existing Rose Meditation 1, 2, 3 content into the new system
- [ ] Set up the Aura Level 1 manual structure
- [ ] Add Russian and Ukrainian translations for the manual interface
- [ ] Test all export formats across browsers
- [ ] Refine print styling

---

## Technical Notes

**No new software packages needed** — everything builds on what's already installed:
- PDF generation: `pdf-lib` (already in project)
- Word documents: `docx` (already in project)
- Image processing: `sharp` (already in project)
- Database & storage: Supabase (already configured)

**Approximately 25 new files** to create and 4 existing files to update.

---

## How to Kick Off Each Phase

When ready to build, use this prompt:

> Implement Phase [1/2/3/4] of the collaborative manual editing system.
> Reference: `docs/plans/collaborative-manual-editing-plan.md`
>
> Follow the existing codebase patterns and design system.

---

## Questions? Decisions Still Open?

- **Initial content**: Should we auto-migrate the existing HTML manual content, or start fresh and let editors paste it in?
- **Translation workflow**: Should editors translate directly in the system, or import translations from an external tool?
- **Notifications**: Should editors be notified when another editor makes changes to the same manual?
