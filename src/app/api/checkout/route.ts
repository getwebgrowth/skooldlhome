import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/dodopayments';

export async function POST(request: Request) {
  try {
    const { planId, email } = await request.json();

    if (!planId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const session = await createCheckoutSession(planId, email);

    return NextResponse.json({ url: session.checkout_url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
