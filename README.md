# Paystack Next.js Payment Integration

## Motivation
To have a reference guide when using paystack for card payments for future projects

## Description
A complete implementation of Paystack payment gateway for Next.js applications with card-only payments in Kenya Shillings (KES).

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)
- [License](#license)

## ✨ Features

- ✅ Card-only payment processing
- ✅ Kenya Shillings (KES) currency support
- ✅ Product-based checkout system
- ✅ Secure payment initialization
- ✅ Payment verification
- ✅ Success/failure callback handling
- ✅ Responsive UI design
- ✅ TypeScript support
- ✅ Server-side API routes for security

## 📦 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Paystack account ([Sign up here](https://paystack.com/))
- Next.js 13+ (App Router)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone or Setup Project

```bash
# If starting fresh
npx create-next-app@latest paystack-payment
cd paystack-payment
```

### 2. Install Dependencies

```bash
npm install axios
# or
yarn add axios
```

### 3. Create Environment File

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **Important**: Never commit your `.env.local` file to version control!

### 4. Get Your Paystack API Keys

1. Log in to your [Paystack Dashboard](https://dashboard.paystack.com/)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. Copy your **Public Key** and **Secret Key**
4. Use **Test Keys** for development (they start with `pk_test_` and `sk_test_`)

## 📁 Project Structure

```
your-project/
├── app/
│   ├── api/
│   │   └── paystack/
│   │       ├── initialize/
│   │       │   └── route.ts          # Initialize payment endpoint
│   │       └── verify/
│   │           └── route.ts          # Verify payment endpoint
│   └── payment/
│       ├── page.tsx                  # Main payment page
│       └── callback/
│           └── page.tsx              # Payment callback page
├── models/
│   └── products.ts                   # Product data model
├── .env.local                        # Environment variables (DO NOT COMMIT)
└── README.md                         # This file
```

## ⚙️ Configuration

### 1. Product Model (`models/products.ts`)

Define your products with prices in Kenya Shillings:

```typescript
export interface Product {
  id: string;
  name: string;
  price: number;        // Price in KES (e.g., 25000 = KES 25,000)
  description: string;
  image: string;
  category?: string;
  stock?: number;
}

export const getProducts = (): Product[] => {
  return [
    {
      id: 'prod_1',
      name: 'Premium Headphones',
      price: 25000,      // KES 25,000
      description: 'High-quality wireless headphones',
      image: '🎧',
      category: 'Electronics',
      stock: 50
    }
  ];
};
```

### 2. Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Your Paystack public key | `pk_test_xxx` |
| `PAYSTACK_SECRET_KEY` | Your Paystack secret key (server-side only) | `sk_test_xxx` |
| `NEXT_PUBLIC_APP_URL` | Your application URL | `http://localhost:3000` |

## 🎯 Usage

### Starting the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000/payment` to see the payment page.

### Payment Flow

1. **User selects a product** from the available list
2. **User enters their email address**
3. **User clicks "Pay with Card"**
4. System initializes payment with Paystack (server-side)
5. **User is redirected** to Paystack's secure payment page
6. **User enters card details** on Paystack's page
7. After payment, user is redirected back to callback page
8. System verifies payment status (server-side)
9. **Success or failure message** is displayed

### Code Example: Making a Payment

```typescript
// Frontend code (already implemented in app/payment/page.tsx)
const initializePayment = async () => {
  const response = await axios.post('/api/paystack/initialize', {
    email: 'customer@example.com',
    amount: 25000 * 100,  // Convert KES to kobo (smallest unit)
    productId: 'prod_1',
    currency: 'KES'
  });

  // Redirect to Paystack checkout
  window.location.href = response.data.authorization_url;
};
```

## 🔌 API Routes

### Initialize Payment (`POST /api/paystack/initialize`)

Initializes a payment transaction with Paystack.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "amount": 2500000,
  "productId": "prod_1",
  "currency": "KES"
}
```

**Response:**
```json
{
  "authorization_url": "https://checkout.paystack.com/xxx",
  "access_code": "xxx",
  "reference": "xxx"
}
```

### Verify Payment (`GET /api/paystack/verify`)

Verifies the status of a completed payment.

**Query Parameters:**
- `reference`: The payment reference from Paystack

**Response:**
```json
{
  "status": "success",
  "reference": "xxx",
  "amount": 25000,
  "currency": "KES",
  "customer": {
    "email": "customer@example.com"
  },
  "paid_at": "2024-01-01T12:00:00.000Z"
}
```

## 🧪 Testing

### Test Cards

Use these test cards on Paystack's test environment:

| Card Number | CVV | PIN | Expiry | Result |
|-------------|-----|-----|--------|--------|
| 4084 0840 8408 4081 | 408 | 0000 | Any future date | Success |
| 4084 0840 8408 4081 | 408 | 0606 | Any future date | Failed |

### Testing Flow

1. Ensure you're using **test API keys** (starting with `pk_test_` and `sk_test_`)
2. Navigate to `/payment`
3. Select a product
4. Enter any email address
5. Click "Pay with Card"
6. Use the test card details above
7. Complete the payment flow
8. You should be redirected back with success/failure status

### Test Different Scenarios

```typescript
// Success scenario
// Use PIN: 0000

// Failed payment scenario
// Use PIN: 0606

// Test different amounts
// Modify product prices in models/products.ts
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Payment initialization failed"

**Cause**: Invalid API keys or network issues

**Solution**:
- Verify your API keys in `.env.local`
- Ensure you're using test keys in development
- Check your internet connection
- Verify Paystack service status

#### 2. "Payment verification failed"

**Cause**: Invalid reference or verification timeout

**Solution**:
- Ensure the payment reference is correct
- Wait a few seconds before verifying
- Check server logs for detailed error messages

#### 3. Environment variables not loading

**Cause**: Next.js not recognizing `.env.local`

**Solution**:
```bash
# Restart the development server
npm run dev
```

#### 4. CORS errors

**Cause**: Incorrect callback URL configuration

**Solution**:
- Ensure `NEXT_PUBLIC_APP_URL` matches your current URL
- In production, update to your production URL

### Debugging Tips

```typescript
// Add console logs in API routes
console.log('Request data:', body);
console.log('Paystack response:', response.data);

// Check Paystack dashboard for transaction logs
// Visit: https://dashboard.paystack.com/#/transactions
```

## 🔒 Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env.local` to version control
- ✅ Use different keys for development and production
- ✅ Prefix client-side variables with `NEXT_PUBLIC_`
- ✅ Keep secret keys server-side only

### 2. API Routes

- ✅ All Paystack API calls are made server-side
- ✅ Secret keys are never exposed to the client
- ✅ Validate all input data before processing
- ✅ Implement rate limiting in production

### 3. Payment Verification

- ✅ Always verify payments server-side
- ✅ Never trust client-side payment status
- ✅ Check transaction reference matches your records
- ✅ Verify amount matches expected amount

### 4. Production Checklist

```bash
# 1. Switch to live API keys
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_SECRET_KEY=sk_live_xxx

# 2. Update callback URL to production domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# 3. Enable webhook for automated verification
# Configure at: https://dashboard.paystack.com/#/settings/webhooks

# 4. Add .env.local to .gitignore
echo ".env.local" >> .gitignore
```

## 🌐 Production Deployment

### 1. Update Environment Variables

Replace test keys with live keys in your hosting platform:

**Vercel:**
```bash
Settings → Environment Variables → Add:
- NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
- PAYSTACK_SECRET_KEY
- NEXT_PUBLIC_APP_URL
```

**Other Platforms:**
- Follow platform-specific instructions for environment variables

### 2. Set Callback URL

Update your callback URL in `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Configure Webhooks (Recommended)

For real-time payment notifications:

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add your webhook URL: `https://yourdomain.com/api/paystack/webhook`
3. Select events: `charge.success`
4. Save your webhook secret

### 4. Test in Production

- Use real cards (not test cards)
- Test small amounts first
- Verify callback redirects work
- Check payment appears in dashboard

## 📊 Monitoring & Analytics

### View Transactions

Monitor payments in your [Paystack Dashboard](https://dashboard.paystack.com/#/transactions):
- Transaction history
- Success/failure rates
- Revenue analytics
- Customer data

### Implement Logging

```typescript
// Add logging to track payments
console.log('Payment initiated:', {
  email,
  amount,
  productId,
  timestamp: new Date()
});
```

## 🤝 Support

- **Paystack Documentation**: [https://paystack.com/docs](https://paystack.com/docs)
- **Paystack Support**: support@paystack.com
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)

## 📝 Additional Resources

- [Paystack API Reference](https://paystack.com/docs/api/)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Next.js and Paystack**

For questions or issues, please open an issue in the repository.