# CookPlan Development Guidelines

## TypeScript Configuration
Vercel uses TypeScript 5.9.x with `"module": "NodeNext"`. This requires explicit `.js` extensions on relative imports within the `api/` directory, and route parameters must be cast to `string` due to type widening in newer `@types/express` versions. Always verify the production build locally before deployment.

## Change Process Requirements
The codebase follows a four-step change management process:

1. **Document in spec.md**: "Add user stories to `spec.md` before implementing any change."

2. **Test coverage**: "Every user story must be covered by at least one test."

3. **Test validation**: "All tests must pass before a change is considered done."

4. **Build verification**: "The production build must pass (`npm run build`) before a change is considered done."

All four steps must be completed before any change is considered finalized. Incomplete work with failing tests or broken builds should not be committed or merged.

# Supabase

In case the database schema changes, make sure the migration is applied. 