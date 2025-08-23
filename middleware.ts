import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

const isPublicRoute = createRouteMatcher([
  "/",
  "/car",
  "/house",
  "/car-for-sale",
  "/house-for-rent",
  "/car-for-rent",
  "/about-us",
  "/contact-us",
  "/api/cars(.*)",
  "/api/house(.*)",
  "/api/featured-products(.*)",
  "/api/advertisements(.*)",
  "/api/reviews(.*)",
  "/api/requests(.*)",
  "/api/messages(.*)",
  "/api/notifications(.*)",
  "/api/reports(.*)",
  "/api/search(.*)",
  "/api/users(.*)",
  "/api/webhook(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/car/:id",
  "/house/:id",
  "/privacy-policy",
  "/terms-of-service",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
