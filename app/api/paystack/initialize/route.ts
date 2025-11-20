import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, productId, currency = 'KES' } = body;

    // Validate input
    if (!email || !amount || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize payment with Paystack
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount, // Amount in kobo (smallest currency unit)
        currency,
        channels: ['card'], // Card only
        metadata: {
          productId,
          custom_fields: [
            {
              display_name: 'Product ID',
              variable_name: 'product_id',
              value: productId
            }
          ]
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json({
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference
    });
  } catch (error: any) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Payment initialization failed', details: error.response?.data },
      { status: 500 }
    );
  }
}
