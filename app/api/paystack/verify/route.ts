import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { data } = response.data;

    return NextResponse.json({
      status: data.status,
      reference: data.reference,
      amount: data.amount / 100, // Convert from kobo to main currency
      currency: data.currency,
      customer: data.customer,
      metadata: data.metadata,
      paid_at: data.paid_at
    });
  } catch (error: any) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Payment verification failed', details: error.response?.data },
      { status: 500 }
    );
  }
}