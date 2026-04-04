
# PHD Website

## Overview
**PHD** is a secure, modern web application designed for academic research workflows. It provides authentication, project management, and an operations workspace where users can upload papers, analyze contradictions, validate claims, and generate hypotheses. The interface follows a clean, Overleaf-style layout with Light/Dark mode support.

---

## Features

### Authentication
- **Sign Up Page**
  - Email, password, re-enter password fields
  - Password constraints: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol
  - OAuth 2.0 integration
- **Sign In Page**
  - Email and password fields
  - Forgot Password link
  - Sign Up link

---

### Saved Page (Project Management)
- Projects auto-saved with all data (files, options, metadata)
- Ordered by **latest updated**
- Project card actions:
  - Rename (inline editing)
  - Delete
  - Bookmark toggle
- **Top-right controls (not in topbar):**
  - New Project → opens Ops Page
  - Select → multi-select for bulk actions
  - Bookmark filter → show only bookmarked projects
- Clicking a project opens the Ops Page with saved content
- Removed unused three-dot menu (⋯)

---

### Ops Page (Project Workspace)
- **Header:** Editable project name replaces “Operations Hub”
- **File Handling:**
  - Upload via drag-and-drop or button
  - Files persist with project and reload when reopened
  - Select button → delete chosen files
  - Clear button → delete all files
  - Removed “Process Sources” button
- **Options (Modes):**
  1. **Contradict**
     - Inputs: domain (required), optional prompt, paper upload (required), corpus selector (Uploaded/External/both)
     - Outputs: contradictions in uploaded paper + contradictions in external papers
  2. **Claim**
     - Inputs: paper upload (required)
     - Outputs: citation validation; highlights incorrect citations
  3. **Hypothesis**
     - Inputs: domain (required)
     - Outputs: gaps per paper, hypotheses for gaps, novel idea suggestions

---

### Theme & UI
- **Light Mode Palette:**
  - Background: `#E9E3DF`
  - Accent: `#FF7A30`
  - Secondary: `#465C88`
  - Text: `#000000`
- **Dark Mode Palette:**
  - Background: `#061E29`
  - Accent: `#1D546D`
  - Secondary: `#5F9598`
  - Text: `#F3F4F4`
- Responsive design for desktop and mobile
- Inline validation for required fields
- Overleaf-style project management layout

---

## Future Enhancements
- Integration with external academic databases
- Advanced citation validation
- Collaborative project sharing

---
