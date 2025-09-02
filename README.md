# BuyMeAChai ☕

A minimal way for creators to receive support. Built for India with native UPI.

## What it does

- Creators get a simple page: `yoursite.com/username`
- Supporters send money via UPI/cards
- Clean dashboard to track everything
- That's it

## Why this exists

Existing platforms are bloated or don't work well in India. This is simple, fast, and has native UPI support.

## Tech

- **Frontend**: Next.js 15, Tailwind
- **Auth**: Clerk
- **Database**: Supabase
- **Payments**: Razorpay
- **Deploy**: Vercel

## Setup

1. Clone it
```bash
git clone https://github.com/yourusername/buymeachai
cd buymeachai
npm install
```

2. Environment variables
```bash
cp .env.example .env.local
# Fill in your keys
```

3. Run it
```bash
npm run dev
```

## Deploy

- Push to GitHub
- Connect to Vercel
- Add environment variables
- Done

## Database

Uses Supabase. Tables:
- `creators` - user profiles
- `supports` - payments/donations

Run this SQL in Supabase:
```sql
CREATE OR REPLACE FUNCTION increment_creator_stats(creator_id uuid, amount_to_add integer)
RETURNS void AS $$
BEGIN
  UPDATE creators 
  SET 
    total_earnings = COALESCE(total_earnings, 0) + amount_to_add,
    supporter_count = COALESCE(supporter_count, 0) + 1
  WHERE id = creator_id;
END;
$$ LANGUAGE plpgsql;
```

## Contributing

PRs welcome. Keep it simple.

## License

MIT

---

Made this because i wanted an easy upi native supporting tool. No BS, just works.
