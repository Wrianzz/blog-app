export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  coverImage?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Minimalism in Web Design",
    excerpt: "Why less is often more when it comes to creating effective user interfaces.",
    content: `
Minimalism in web design isn't just about removing elements; it's about focusing on what truly matters. By stripping away the non-essential, we allow the core message and functionality to shine through.

### The Core Principles

1. **Negative Space:** Often referred to as "white space," this is the empty area around elements. It's not wasted space; it's active space that guides the user's eye and provides breathing room.
2. **Typography:** In a minimalist design, typography often takes center stage. Choosing the right font and using it effectively can communicate tone and hierarchy without the need for excessive graphics.
3. **Color Palette:** A limited color palette, often relying heavily on black, white, and grays, helps maintain focus. Accents can be used sparingly to draw attention to interactive elements.

### Why It Works

Minimalist designs load faster, are easier to navigate, and often convert better because there are fewer distractions. It's a timeless approach that prioritizes the user's needs over flashy trends.
    `,
    date: "Oct 24, 2025",
    readTime: "4 min read",
    author: "Arthur Wiriansyah"
  },
  {
    id: "2",
    title: "Building Scalable React Applications",
    excerpt: "A guide to structuring your React projects for long-term maintainability.",
    content: `
As React applications grow, maintaining a clean and understandable architecture becomes crucial. Without a solid foundation, you'll quickly find yourself tangled in a web of prop drilling and tightly coupled components.

### Folder Structure

A feature-based folder structure often works best for large applications. Instead of grouping files by type (e.g., all components in one folder, all hooks in another), group them by feature.

\`\`\`
src/
  features/
    auth/
      components/
      hooks/
      api/
    dashboard/
      components/
      hooks/
\`\`\`

### State Management

Don't reach for Redux or Zustand immediately. Start with local state (\`useState\`, \`useReducer\`) and React Context for state that needs to be shared across a few components. Only introduce a global state management library when the complexity demands it.

### Component Design

Aim for small, focused components. If a component is doing too many things, break it down. Use composition to build complex UIs from simple building blocks.
    `,
    date: "Nov 12, 2025",
    readTime: "6 min read",
    author: "Arthur Wiriansyah"
  },
  {
    id: "3",
    title: "Embracing the Dark Mode",
    excerpt: "Designing interfaces that look great when the lights go out.",
    content: `
Dark mode is no longer a niche feature; it's an expectation. Designing for dark mode requires more than just inverting colors. It requires careful consideration of contrast, depth, and visual hierarchy.

### Contrast is Key

Pure black (\`#000000\`) can often be too harsh on the eyes, especially when paired with pure white text. Consider using dark grays (e.g., \`#121212\`) for backgrounds to reduce eye strain.

### Depth and Elevation

In light mode, we often use shadows to indicate depth. In dark mode, shadows are less effective. Instead, use lighter shades of gray to indicate elevation. The closer an element is to the user, the lighter it should be.

### Testing

Always test your dark mode designs in actual low-light environments. What looks good on a bright monitor in a well-lit office might be unreadable in a dark room.
    `,
    date: "Jan 05, 2026",
    readTime: "3 min read",
    author: "Arthur Wiriansyah"
  }
];
