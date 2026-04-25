export const fallbackArticles = [
  {
    _id: "fallback-article-1",
    slug: "software-engineering-clean-architecture-in-small-projects",
    title: "Software Engineering: Clean Architecture in Small Projects",
    excerpt:
      "How to apply clean architecture principles in portfolio and startup-scale apps without over-engineering.",
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80",
    content:
      "## Why architecture still matters in small projects\nSmall projects can become hard to maintain when features are added quickly without structure. Even simple separation between UI, business logic, and data access improves clarity and reduces bugs over time.\n\n## Keep boundaries practical\nYou do not need heavyweight patterns to get value. Start with clear modules: pages and components for presentation, services for API calls, and utilities for shared logic. That alone makes refactoring safer.\n\n## Design for future change\nGood architecture is mostly about preparing for change. If your article system, project system, and admin tools are isolated cleanly, each can evolve independently without breaking the rest of the app.",
    category: "Software Engineering",
    readTime: "6 min read",
    date: "2026-04-22",
    tags: ["Architecture", "Maintainability", "Code Quality"],
  },
  {
    _id: "fallback-article-2",
    slug: "cloud-basics-for-frontend-focused-developers",
    title: "Cloud Basics for Frontend-Focused Developers",
    excerpt:
      "A practical cloud roadmap for frontend developers: hosting, APIs, storage, and observability in production.",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
    content:
      "## Think in layers\nCloud apps usually involve a static frontend host, an API layer, and a persistence layer. Understanding these three pieces helps you debug faster and deploy with confidence.\n\n## Start with reliable hosting\nUse CDN-backed hosting for frontend assets, then keep your API on a dedicated service. This separation improves scale and makes deployment pipelines easier to reason about.\n\n## Observe what you deploy\nLogs and metrics are essential, even for personal projects. Basic request logging, error reporting, and latency tracking quickly show where the system fails under real usage.",
    category: "Cloud",
    readTime: "5 min read",
    date: "2026-04-20",
    tags: ["Cloud", "Deployment", "Observability"],
  },
  {
    _id: "fallback-article-3",
    slug: "devops-habits-that-improve-release-confidence",
    title: "DevOps Habits That Improve Release Confidence",
    excerpt:
      "Small DevOps habits that make releases safer: repeatable builds, environment parity, and rollback readiness.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    content:
      "## Automate what you can repeat\nAny task you run more than once should be scripted. Build commands, lint checks, and deploy steps become reliable when automated, and reliability reduces production mistakes.\n\n## Keep environments predictable\nMost deployment bugs come from environment drift. Align local, staging, and production behavior as much as possible, including API URLs, runtime settings, and build outputs.\n\n## Plan for rollback\nRelease confidence depends on recovery, not only prevention. Keep deploys incremental and always know how to revert quickly if a bad build reaches production.",
    category: "DevOps",
    readTime: "5 min read",
    date: "2026-04-18",
    tags: ["CI/CD", "Reliability", "Release Engineering"],
  },
  {
    _id: "fallback-article-4",
    slug: "api-design-decisions-that-help-teams-move-faster",
    title: "API Design Decisions That Help Teams Move Faster",
    excerpt:
      "Simple API design rules that reduce frontend-backend friction and make features easier to ship.",
    imageUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1400&q=80",
    content:
      "## Consistency beats cleverness\nPredictable endpoint naming, stable response formats, and clear error structures make APIs easier to consume and test.\n\n## Communicate intent in the payload\nA good API response should be meaningful, not just technically valid. Include fields the UI needs, and avoid forcing the client to reconstruct business meaning from fragmented data.\n\n## Version less, document better\nMany breaking changes can be avoided by additive evolution and stronger contracts. Lightweight docs and examples aligned with real UI flows keep teams synchronized.",
    category: "Software Engineering",
    readTime: "4 min read",
    date: "2026-04-16",
    tags: ["API", "Backend", "Team Productivity"],
  },
];
