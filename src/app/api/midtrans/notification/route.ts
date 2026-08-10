import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { verifySignature } from '@/lib/midtrans';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const isVerified = verifySignature({
      order_id: body.order_id,
      status_code: body.status_code,
      gross_amount: body.gross_amount,
      signature_key: body.signature_key,
    });

    if (!isVerified) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabaseAdmin = createServiceClient();

    const { data: tx, error: txError } = await supabaseAdmin.from('transaksi')
      .select('id, total_harga, status, unit_id')
      .eq('midtrans_order_id', body.order_id)
      .single();

    if (txError || !tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Validate gross_amount matches database
    if (Math.round(parseFloat(body.gross_amount)) !== Math.round(parseFloat(tx.total_harga))) {
      return NextResponse.json({ error: 'Gross amount mismatch' }, { status: 400 });
    }

    let newStatus = tx.status;
    const { transaction_status, fraud_status } = body;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        newStatus = 'dibayar';
      } else {
        newStatus = 'dibatalkan';
      }
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newStatus = 'dibatalkan';
    } else if (transaction_status === 'pending') {
      newStatus = 'menunggu_pembayaran';
    }

    if (newStatus !== tx.status) {
      const updatePayload: any = { status: newStatus };
      if (newStatus === 'dibayar') {
        // e.g., generate QR URL if needed, or could just be derived
        updatePayload.qr_code_url = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${tx.id}`;
      } else if (newStatus === 'dibatalkan') {
        updatePayload.identitas_dijadwalkan_hapus_at = new Date().toISOString();
        if (tx.unit_id) {
           await supabaseAdmin.from('unit').update({ status: 'tersedia' }).eq('id', tx.unit_id);
        }
      }

      await supabaseAdmin.from('transaksi').update(updatePayload).eq('id', tx.id);
    }

    // Save to pembayaran table
    await supabaseAdmin.from('pembayaran').insert({
      transaksi_id: tx.id,
      midtrans_transaction_id: body.transaction_id,
      status: transaction_status,
      gross_amount: body.gross_amount,
      payment_type: body.payment_type,
      raw_response: body
    });

    // Log audit: PAYMENT action
    await supabaseAdmin.from('audit_logs').insert({
      user_id: null, // system
      user_nama: 'System',
      user_role: 'system',
      aksi: 'PAYMENT',
      entitas: 'transaksi',
      entitas_id: tx.id,
      deskripsi: `Midtrans webhook: ${transaction_status}`,
      ip_address: 'midtrans-webhook',
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Midtrans notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
