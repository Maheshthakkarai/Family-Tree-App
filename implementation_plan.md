# Implementation Plan - Family Tree Web Application

## Overview
A high-end, interactive Family Tree application featuring an "Apple-esque" minimalist design. Built with React Flow for visualization and Zustand for state management, optimized for complex relational mapping.

## Phase 1: Architecture & Data Modeling

### 1.1 Data Structure (Adjacency List + Meta)
We will use a graph-based structure where individuals are nodes and relationships are edges.
- **Node (Person)**:
  ```typescript
  interface Person {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string; // ISO
    deathDate?: string;
    photoUrl?: string;
    bio?: string;
    occupation?: string;
  }
  ```
- **Edge (Relationship)**:
  ```typescript
  interface Relationship {
    id: string;
    source: string; // Person ID
    target: string; // Person ID
    type: 'parent' | 'spouse' | 'child'; // child is often redundant but useful for UI
  }
  ```

### 1.2 State Management (Zustand)
- `useFamilyStore`:
  - `people`: Flat array of Person objects.
  - `relationships`: Flat array of Relationship objects.
  - Actions: `addPerson`, `updatePerson`, `deletePerson`, `addRelationship`.
  - Computed: `getNodes`, `getEdges` (transforming state for React Flow).

### 1.3 Layout Algorithm
- Use **Dagre** or **ELK.js** to handle the layouting logic (top-down tree) so nodes are positioned automatically when added.

---

## Phase 2: Tech Stack & Scaffolding

- **Frontend**: Vite + React + TypeScript.
- **Styling**: Tailwind CSS.
- **Icons**: Lucide React.
- **Graph Engine**: React Flow (v11+).
- **Utility**: `date-fns` for age calculation and formatting.

---

## Phase 3: UI/UX Design (Apple-esque Standards)

### 3.1 Design Tokens
- **Colors**: 
  - Bg: `#F5F5F7` (Off-white)
  - Card: `#FFFFFF` with `backdrop-filter: blur(20px)`
  - Accent: `#0071E3` (Apple Blue)
  - Text: `#1D1D1F` (Primary), `#86868B` (Secondary)
- **Typography**: Sans-serif (Inter/System UI).
- **Components**:
  - `PersonNode`: A custom React Flow node showing thumbnail, name, and age.
  - `DataEntrySidebar`: Slide-in drawer for adding/editing people.
  - `DetailSidebar`: Slide-in drawer for viewing bio and timeline.

---

## Phase 4: Core Logic & Validation

### 4.1 Circular Dependency Check
- Before adding a "Parent" relationship, perform a DFS (Depth First Search) to ensure the target is not already an ancestor of the source.

### 4.2 Relationship Inversion
- Adding A as a "Parent" of B automatically creates the directed edge A -> B.
- Adding A as a "Spouse" of B creates a non-directional (or bi-directional) visual link.

---

## Phase 5: Implementation Roadmap

1. **Sprint 1: Setup & Store**
   - Initialize Vite project.
   - Setup Tailwind & Zustand Store.
   - Basic localStorage persistence layer.

2. **Sprint 2: Graph Visualization**
   - Integrate React Flow.
   - Create `PersonNode` custom component.
   - Implement Dagre auto-layout.

3. **Sprint 3: Data Entry & Management**
   - Build the sidebar forms.
   - Implement relationship validation (no cycles).
   - Add Search/Filter functionality.

4. **Sprint 4: Detail View & Polish**
   - Person detail view with timeline.
   - Animation transitions.
   - Responsive design (Mobile vs Desktop canvas).

---

## Phase 6: Verification Plan
- **Test Case 1**: Add "Grandfather" -> Add "Father" (related to Grandfather) -> Add "Son" (related to Father).
- **Expected Result**: 3-level vertical hierarchy rendered.
- **Test Case 2**: Attempt to add "Grandfather" as "Child" of "Son".
- **Expected Result**: Validation error prevented.
