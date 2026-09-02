# Community Builds

The Builds section includes discovery, a structured authoring workshop, a public reader, ratings, and discussion. It uses the existing catalog tooltips, skill planner, character viewer, and authentication.

## Research and product direction

Reviewed September 2, 2026. These are useful patterns, not an objective ranking of which site is best.

| Reference | Pattern used here |
| --- | --- |
| [Mobalytics build planner](https://mobalytics.gg/diablo-4/planner/builds) | Draft saving, guide explanations alongside interactive planning, and multiple setups in one guide. Our workshop also supports narrow screens. |
| [Mobalytics build library](https://mobalytics.gg/diablo-4/builds) | Filterable discovery, visible authorship and update dates, and a clear separation between browsing and authoring. No invented verification badges. |
| [D4Builds planner](https://d4builds.gg/build-planner/) | Equipment and skills belong within the guide experience, not on disconnected pages. Reuse the website's D2R-specific tools. |
| [pobb.in](https://pobb.in/) | Shareable build URLs and a compact reader-friendly presentation. |

The requested [Maxroll example](https://maxroll.gg/d2/guides/mirrored-blades-warlock-guide) could not be inspected: page retrieval failed and the browser blocked the site. It remains the user's reference, not a claimed source of verified implementation details.

## Routes and workflows

- `/builds`: server-rendered public library, search, class/focus/budget/patch/tag filters, updated/newest/top-rated sorting, pagination, and honest empty/error states.
- `/builds/new`: workshop; visitors can experiment locally, but account sign-in is required to save or publish.
- `/builds/mine`: the current user's private drafts and published guides.
- `/builds/[id]`: public reader with variant navigation, contents links, reusable interactive displays, share links, ratings, and comments/replies.
- `/builds/[id]/edit`: owner-only workshop with revision-safe saving.

Authors can add, reorder, duplicate, and remove sections; create or duplicate up to eight variants; preview with the same renderer used publicly; save private changes; and explicitly publish, unpublish, or remove a guide. Publishing requires a completeness check and confirmation. Edits to a published guide stay private until the next publication.

Local backups are scoped to the account and guide, with a guest-draft recovery offer after sign-in. They do not silently overwrite account content. Stale revisions receive a server conflict. Navigation warns about unsaved changes. JSON export contains the editable guide, not server-owned equipment snapshots; JSON import is not included.

## Authoring tools

Each variant supports up to 40 sections:

- Rich text with toolbar-assisted Markdown: headings, bold/italic/strikethrough, lists, links, quotations, tables, code, and dividers.
- Tip, warning, strengths, and weaknesses callouts.
- Catalog item references, including inline `[[item:uniques:key]]` tokens inserted by the item picker. The picker also supports sets, runewords, and base items. References render the existing catalog card on hover, focus, or tap.
- An embedded editable skill planner with allocations saved per section; the public reader is read-only and does not alter the standalone planner's local state.
- Equipment and inventory snapshots from selectable uploaded characters, using the existing character viewer. Saving captures the snapshot; refresh is explicit. Copying a section or variant preserves its saved snapshot.
- HTTPS images with captions and supported YouTube links rendered through the privacy-enhanced embed domain.

Text is rendered as Svelte elements, never raw HTML. This is a documented Markdown subset, not a WYSIWYG editor or a complete CommonMark parser. Arbitrary HTML/iframes/scripts are not accepted. Images are loaded by the reader's browser with no referrer; there is no upload service or server-side URL fetching.

Equipment snapshots display an uploaded character's actual loadout; this release does not implement a hypothetical drag-and-drop gear calculator. Authors can describe alternative gear with item sections and separate setups. Skill planning uses the website's current skill data and planner rules, not a new server-side damage simulator.

## Community and safety

Signed-in players can leave or change one 1–5-star rating per guide, remove it, and comment or reply. Authors cannot rate their own guides. Top-rated discovery uses a prior of five votes at three stars to reduce single-vote dominance. Comments are paginated and rate-limited; commenters, guide authors, Admins, and Moderators can remove comments.

Draft ownership, publication separation, character access, revision checks, ratings, and comment permissions are enforced by the API. Equipment snapshots redact unidentified item secrets before storage and publication and omit unrelated save history, stash contents, raw data, and file/realm identifiers. A later character change does not silently change a published guide.

Reporting queues, moderation audit history, bookmarks, a creator verification program, and a hypothetical gear/stat simulator are future extensions, not completed features.

## Verification and deployment

Normal website checks:

```powershell
pnpm exec vitest run
pnpm exec svelte-check --tsconfig ./tsconfig.json
pnpm exec vite build
```

On this Windows host, verification used the installed `.cmd` binaries with the bundled Node runtime on `PATH`. Browser QA used the real UI and a disposable local API test host, at 1280 px desktop and 390 px mobile widths. It covered filtering, authoring, skills, item tooltips, section movement, variant duplication, saving, publishing, ratings, and comments. Wide skill trees scroll within their section rather than widening the page.

Deploy the companion API and its `AddCommunityBuilds` migration before exposing this website release. The migration was generated but was not applied to a live database during implementation. See the API's `docs/builds.md` for the endpoints, tests, and local fixture instructions. The existing `PUBLIC_API_BASE_URL` configuration is unchanged.
