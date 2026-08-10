import { Resend } from 'resend';

// Initialize Resend with API key from env
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Cannot send email.');
    return { success: false, error: 'RESEND_API_KEY is not configured.' };
  }

  try {
    const data = await resend.emails.send({
      from: 'RentMoto Security <onboarding@resend.dev>', // Free tier usually requires verified domain or this default
      to,
      subject,
      html,
    });
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

export async function sendNewDeviceNotification(email: string, namaLengkap: string, ipAddress: string, userAgent: string) {
  const subject = 'Peringatan Keamanan: Login dari Perangkat Baru';
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #7C3AED;">Peringatan Keamanan RentMoto</h2>
      <p>Halo ${namaLengkap},</p>
      <p>Kami mendeteksi aktivitas login ke akun Anda dari IP atau perangkat yang tidak biasa pada <strong>${new Date().toLocaleString('id-ID')}</strong>.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0;"><strong>Alamat IP:</strong> ${ipAddress}</p>
        <p style="margin: 5px 0 0 0;"><strong>Perangkat/Browser:</strong> ${userAgent || 'Tidak diketahui'}</p>
      </div>
      <p style="color: #dc2626; font-weight: bold;">Jika ini bukan Anda, segera ganti password akun Anda.</p>
      <p>Terima kasih,<br>Tim Keamanan RentMoto</p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
}
