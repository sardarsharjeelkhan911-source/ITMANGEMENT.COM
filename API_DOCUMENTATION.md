# API Documentation

All responses follow `{ "success": boolean, "data": ... }` or `{ "success": false, "error": { "message": string } }`. Browser sessions use an HTTP-only `session` cookie; non-browser clients can use `Authorization: Bearer <token>`.

## Public
- `GET /api/health`
- `GET /api/products?search=&category=&featured=&sort=price-asc|price-desc&page=&limit=`
- `GET /api/products/:id` (also accepts a slug)
- `GET /api/categories`
- `GET /api/settings`

## Authentication
- `POST /api/auth/register` — `{ name, email, password, phone? }`
- `POST /api/auth/login` — `{ email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Authenticated customer routes
- `GET /api/cart`
- `POST /api/cart/items` — `{ productId, quantity }`
- `PUT /api/cart/items/:id` — `{ quantity }`
- `DELETE /api/cart/items/:id`, `DELETE /api/cart`
- `POST /api/orders` — shipping fields plus `paymentMethod: "COD"`, optional `couponCode` and `notes`
- `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders/:id/cancel`

## Administrator routes
- `GET /api/admin/dashboard`
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` (delete safely archives)
- `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`
- `GET /api/coupons`, `POST /api/coupons`
- `PUT /api/settings`

The Prisma schema defines the remaining extension entities (reviews, wishlists, addresses, payments, tax settings, and inventory transactions). Those endpoints should be enabled as the JSON adapter is replaced by Prisma in production.
