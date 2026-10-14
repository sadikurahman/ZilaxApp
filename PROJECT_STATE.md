# PROJECT_STATE — Zilax

Updated: Stage 1 built (needs the user's Supabase setup + test, see STAGE1_SETUP.md)

## Goal
Zilax super app (Food, Technical Service, Shop, Rent a Car, Decoration, Sound & Light).
Launch Food first in Islampur and Dewangonj (Jamalpur). Master plan = the "Zilax AI Master Project Plan" PDF.

## Stack (free path, iPhone only)
Plain HTML / CSS / JavaScript on GitHub Pages. Supabase (free) is added in Stage 1.
No build tools. All files sit flat in the repo root (no folders) so they can be uploaded from an iPhone.

## Design decision (latest)
Home page now follows a Pathao-style layout (user request): header with logo + wallet pill + cart + profile, area/language strip, search, swipeable banners, big service-card grid (Food, Technical, Rent a Car, Shop, Decoration, Sound & Light), QUICK ACTIONS, Your orders, Zilax Spotlight (offers, trending plates, trending fashion), flat bottom nav (Home, Offers, Activity, Inbox, Account). Font: Poppins (English) + Hind Siliguri (Bangla). Zilax green brand colours stay. Do NOT copy Pathao's logo, illustrations or text.
The layout is driven by ZX.data.home in data.js (Stage 2: Super Admin Home Builder edits it and uploads photos).

## Done (Stage 0)
- index.html — customer home page (see Design decision above).
- Views: Home, Offers, Activity, Inbox, Account, Shop, Food, Service, Join as Partner (7 partner types and documents).
- panels.html#merchant | rider | sales | admin | super — layout shells with small working demos:
  merchant stock-out toggles (affect the home page), rider online toggle and order accept, sales leads list,
  admin live order board, super admin pricing view and calculator.
- calc.js — all money rules in ONE file: delivery slabs 20/30/50/60 (<=1, <=2, <=5, >5 km), food commission 15% on the food subtotal only, rider keeps the full delivery charge. Self-test: 1000 food + 1.5 km -> customer 1030, merchant 850, commission 150, rider 30.
- i18n: EN and Bangla everywhere (toggle in the header, saved in localStorage).
- Cart and stock-out are stored in the browser only (localStorage).

## Rules for the AI
- Full files only, no placeholders. One Stage at a time. Keep earlier Stages working.
- No values hard-coded: commission, delivery slabs, categories, banners come from data (Supabase later; Super Admin edits them in Stage 2).
- Never put service_role key or payment secrets in the front-end or in GitHub.


## Stage 1 (built, not yet tested against the user's real Supabase)
Files: stage1.sql (run once in Supabase SQL Editor), config.js (URL + anon key, user fills), auth.js (client + helpers), stage1.js (login, sign up, account, Join as Partner forms with photo upload, My applications), panels-live.js (access gate, Sales review, Admin approvals, Super Admin roles, areas, audit log). index.html, panels.html, app.js, zilax.css were extended.
- Login = phone number + password. The phone becomes the e-mail "<phone>@users.zilax.app"; the user must switch OFF "Confirm email" in Supabase. SMS OTP comes later (needs a paid SMS service).
- Tables: areas, profiles, user_roles, partner_applications, application_documents, audit_logs, storage bucket partner-docs (private). RLS on all. All role/application changes go through secure SQL functions (submit_partner_application, add_application_document, sales_review, admin_decide, super_grant_role, super_revoke_role, upsert_area). The first Super Admin is made with `select public.bootstrap_super_admin('01XXXXXXXXX');` in the SQL Editor.
- Roles: customer (auto), merchant_food, merchant_shop, rider, technician, car_partner, decoration, sound_light (partner roles: pending until Admin approves), sales_admin, admin, super_admin (only Super Admin can give these).
- Approval flow: pending -> Sales recommends / not recommends -> Admin approves / rejects (Admin may decide at any point). Approve turns the role on.
- Union names are NOT seeded (only 2 upazilas and 2 paurashavas); Super Admin adds unions in the Areas screen.
- Tested in a headless browser against a fake in-memory Supabase (29 checks: sign up, duplicate phone, login, apply with photos, duplicate application, partial upload, approve, grant roles, access gates, area add, audit). The SQL itself could NOT be executed in the build environment (no Postgres), so it is reviewed by eye only: if the user reports an SQL error, fix the SQL first.
- Merchant, rider, technician panels are still the Stage 0 demos behind the real access gate.

## Next: Stage 2 (Super Admin core, no-code settings)
Services on/off, food categories, delivery slabs and commission stored in the database, Home Builder (banners, offers, photos upload), 2FA groundwork. Needs Stage 1 working first.

## (old) Next
Stage 1: Supabase connection, user sign-up (phone), Join as Partner (7 categories + document upload), approval flow (pending -> sales recommends -> admin approves), staff accounts created only by Super Admin, role-based access (RLS).
Before Stage 1 the user needs: Supabase Project URL and anon (public) key. Pass phone login via password first, SMS OTP later.

## Known issues
- Photos were cut from the reference screenshot with the baked-in text removed (hero banners, offers, service cards, 4 food/fashion items). Kacchi Biryani and Lawn Kurti photos are missing (emoji placeholder). Replace all photos with real ones through the Super Admin Home Builder in Stage 2.

## Restaurant page design reference (built in Stage 4, menu data in Stage 3)
Reference: a Pathao-style restaurant page the user shared. Layout and behaviour only; no Pathao assets.
- Top bar: back arrow, "Search dishes" box, favourite heart, more menu.
- Restaurant header: logo, name, rating and review count, delivery fee (old price struck through, new price) with distance in km, "Long distance delivery" badge.
- Offer ticket banner (for example "50% off on orders above 199") and a cashback banner. Offers come from Stage 9, cashback from the wallet in Stage 7.
- Sticky category tabs (Most Popular, then the restaurant's own categories) that scroll to each section.
- "Most Popular" row of cards with image, name, price and an ADD button.
- Category sections: list rows with name, price, short note and a photo with ADD.
- Floating "Menu" button that opens a category list.
- Bottom bar with a progress line toward free delivery (for example "Order 399 to get Free Delivery"). New rule, to be set by Super Admin (global or per restaurant).
- RULE: a cart may hold many items from ONE restaurant. Adding an item from a different restaurant asks "Start a new cart? Items from the first restaurant will be removed." Yes clears the cart and adds the new item; No keeps the old cart.
- Delivery fee uses the GPS distance slabs (20 / 30 / 50 / 60); strikethrough price only when a discount or free-delivery rule applies.
- Out-of-stock items show "Sold out" and cannot be added (merchant one-tap stock out).
Status: not built yet. The user asked to be told the Stage first and to generate code only after they say so.
