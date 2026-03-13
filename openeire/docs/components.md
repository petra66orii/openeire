# Component Catalog

This document is based on a scan of `src/components/*.tsx` and current imports in `src/App.tsx`, `src/pages/*`, and component-to-component usage.

## App Shell and Navigation

### Navbar
- Purpose: Top navigation, auth/menu links, bag count entry point.
- Location: `src/components/Navbar.tsx`
- Used In: `src/App.tsx`
- Key Props: None.

### Footer
- Purpose: Site-wide footer links and newsletter/community CTA.
- Location: `src/components/Footer.tsx`
- Used In: `src/App.tsx`
- Key Props: None.

### Breadcrumbs
- Purpose: Displays route breadcrumbs, including dynamic titles from breadcrumb context.
- Location: `src/components/Breadcrumbs.tsx`
- Used In: `src/App.tsx`
- Key Props: None.

### ScrollToTop
- Purpose: Resets window scroll on route changes.
- Location: `src/components/ScrollToTop.tsx`
- Used In: `src/App.tsx`
- Key Props: None.

### BackToTop
- Purpose: Floating "back to top" action for long pages.
- Location: `src/components/BackToTop.tsx`
- Used In: `src/App.tsx`
- Key Props: None.

### AppErrorBoundary
- Purpose: Captures unhandled render errors and renders a safe fallback page.
- Location: `src/components/AppErrorBoundary.tsx`
- Used In: `src/main.tsx`
- Key Props:
  - `children: React.ReactNode`

## Access Control Components

### ProtectedRoute
- Purpose: Route guard for authenticated-only pages.
- Location: `src/components/ProtectedRoute.tsx`
- Used In: `src/App.tsx` (`/profile`)
- Key Props:
  - `children: React.ReactElement`

### GalleryGuard
- Purpose: Route guard for digital gallery access based on `gallery_access` session in local storage.
- Location: `src/components/GalleryGuard.tsx`
- Used In: `src/App.tsx` (digital gallery/photo/video routes)
- Key Props: None.

## Gallery and Product Browsing

### VisualCategoryHero
- Purpose: Swiper coverflow hero used to select gallery collection.
- Location: `src/components/VisualCategoryHero.tsx`
- Used In: `src/pages/GalleryPage.tsx`
- Key Props:
  - `activeCollection: string`
  - `onSelectCollection: (id: string) => void`
  - `isPaused: boolean`

### MinimalToolbar
- Purpose: Gallery search and sort controls.
- Location: `src/components/MinimalToolbar.tsx`
- Used In: `src/pages/GalleryPage.tsx`
- Key Props:
  - `onSearch: (q: string) => void`
  - `onSortChange: (s: string) => void`

### ProductCard
- Purpose: Unified card for gallery and related product listings with media preview behavior.
- Location: `src/components/ProductCard.tsx`
- Used In:
  - `src/pages/GalleryPage.tsx`
  - `src/components/RelatedProducts.tsx`
- Key Props:
  - `product: GalleryItem`
  - `onModalOpen?: () => void`
  - `onModalClose?: () => void`

### QuickAddModal
- Purpose: Physical-print quick-add modal for selecting variant/material/size before adding to bag.
- Location: `src/components/QuickAddModal.tsx`
- Used In: `src/components/ProductCard.tsx`
- Key Props:
  - `productId: number`
  - `onClose: () => void`

### RelatedProducts
- Purpose: Horizontal scroll carousel for related products.
- Location: `src/components/RelatedProducts.tsx`
- Used In:
  - `src/pages/ProductDetailPage.tsx`
  - `src/pages/ShoppingBagPage.tsx`
- Key Props:
  - `products: GalleryItem[]`

### AddToCartForm
- Purpose: Quantity selector + add-to-bag action for physical product contexts.
- Location: `src/components/AddToCartForm.tsx`
- Used In: Not currently imported by other files in `src` (available for physical product flow integration).
- Key Props:
  - `product: PhysicalCartProduct`

## Checkout and Bag

### BagItem
- Purpose: Renders a cart line item and quantity/update/remove controls.
- Location: `src/components/BagItem.tsx`
- Used In: `src/pages/ShoppingBagPage.tsx`
- Key Props:
  - `item: CartItem`

### OrderSummary
- Purpose: Displays subtotal, shipping, total, and checkout/login CTA logic.
- Location: `src/components/OrderSummary.tsx`
- Used In:
  - `src/pages/ShoppingBagPage.tsx`
  - `src/pages/CheckoutPage.tsx`
- Key Props:
  - `isCheckoutPage?: boolean`
  - `shippingCost: number`
  - `isShippingPending?: boolean`

### CheckoutForm
- Purpose: Shipping/contact form + Stripe `PaymentElement` submission flow.
- Location: `src/components/CheckoutForm.tsx`
- Used In: `src/pages/CheckoutPage.tsx`
- Key Props:
  - `initialData?: UserProfile | null`
  - `shippingDetails: ShippingDetails`
  - `onShippingChange: React.Dispatch<React.SetStateAction<ShippingDetails>>`
  - `saveInfo: boolean`
  - `onSaveInfoChange: (save: boolean) => void`
  - `shippingMethod: string`
  - `onShippingMethodChange: (method: string) => void`
  - `isUpdatingIntent?: boolean`
  - `isPaymentReady?: boolean`

## Reviews and Blog

### ReviewForm
- Purpose: Auth-aware review submission UI for photo/video products.
- Location: `src/components/ReviewForm.tsx`
- Used In: `src/pages/ProductDetailPage.tsx`
- Key Props:
  - `productType: ReviewProductType`
  - `productId: string`
  - `onReviewSubmitted: () => void`

### ProductReviewList
- Purpose: Fetches and renders product reviews; refreshes after submission events.
- Location: `src/components/ProductReviewList.tsx`
- Used In: `src/pages/ProductDetailPage.tsx`
- Key Props:
  - `productType: ReviewProductType`
  - `productId: string`
  - `refreshKey: number`

### CommentList
- Purpose: Displays blog comments.
- Location: `src/components/CommentList.tsx`
- Used In: `src/pages/BlogDetailPage.tsx`
- Key Props:
  - `comments: Comment[]`

### CommentForm
- Purpose: Blog comment submission form with auth checks.
- Location: `src/components/CommentForm.tsx`
- Used In: `src/pages/BlogDetailPage.tsx`
- Key Props:
  - `onSubmit: (content: string) => Promise<void> | void`

### SocialShareButtons
- Purpose: Blog post social share links.
- Location: `src/components/SocialShareButtons.tsx`
- Used In: `src/pages/BlogDetailPage.tsx`
- Key Props:
  - `url: string`
  - `title: string`
  - `image?: string`

## Auth/Profile and Account

### SocialLogin
- Purpose: Google OAuth login flow integrated with backend token exchange.
- Location: `src/components/SocialLogin.tsx`
- Used In:
  - `src/pages/LoginPage.tsx`
  - `src/pages/RegisterPage.tsx`
- Key Props:
  - `redirectPath?: string`

### AuthForm
- Purpose: Registration form component used by register page.
- Location: `src/components/AuthForm.tsx`
- Used In: `src/pages/RegisterPage.tsx`
- Key Props: Component-managed form props (no external props).

### EditProfileForm
- Purpose: User profile details update form.
- Location: `src/components/EditProfileForm.tsx`
- Used In: `src/pages/ProfilePage.tsx`
- Key Props:
  - `initialData: UserProfile`

### SecuritySettings
- Purpose: Aggregates account-security actions.
- Location: `src/components/SecuritySettings.tsx`
- Used In: `src/pages/ProfilePage.tsx`
- Key Props: None.
- Internal Composition:
  - `ChangeEmailForm`
  - `ChangePasswordForm`
  - `DeleteAccount`

### OrderHistoryList
- Purpose: Query-driven order history list with loading/error/empty states.
- Location: `src/components/OrderHistoryList.tsx`
- Used In: `src/pages/ProfilePage.tsx`
- Key Props: None.

## SEO and Error Pages

### SEOHead
- Purpose: Updates document title and social/meta tags per route content.
- Location: `src/components/SEOHead.tsx`
- Used In:
  - `src/pages/HomePage.tsx`
  - `src/pages/BlogDetailPage.tsx`
  - `src/pages/ProductDetailPage.tsx`
  - `src/pages/LicensingPage.tsx`
- Key Props:
  - `title: string`
  - `description: string`
  - `image?: string`
  - `url?: string`

### ErrorPageLayout
- Purpose: Shared layout wrapper for 403/404/500 pages.
- Location: `src/components/ErrorPageLayout.tsx`
- Used In:
  - `src/pages/ForbiddenPage.tsx`
  - `src/pages/NotFoundPage.tsx`
  - `src/pages/ServerErrorPage.tsx`
- Key Props:
  - `statusCode: "403" | "404" | "500"`
  - `title: string`
  - `message: string`
  - `actions: React.ReactNode`
