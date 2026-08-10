import crypto from 'crypto';

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const API_URL = isProduction 
  ? 'https://app.midtrans.com/snap/v1/transactions' 
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

export async function createSnapToken(params: { 
  order_id: string; 
  gross_amount: number; 
  customer_details: { first_name: string; email?: string; phone?: string } 
}): Promise<string> {
  const authString = Buffer.from(`${SERVER_KEY}:`).toString('base64');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${authString}`
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: params.order_id,
        gross_amount: params.gross_amount
      },
      customer_details: params.customer_details
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Midtrans API Error: ${errorText}`);
  }

  const data = await response.json();
  return data.token;
}

export function verifySignature(params: { 
  order_id: string; 
  status_code: string; 
  gross_amount: string; 
  signature_key: string 
}): boolean {
  const payload = params.order_id + params.status_code + params.gross_amount + SERVER_KEY;
  const hash = crypto.createHash('sha512').update(payload).digest('hex');
  return hash === params.signature_key;
}
