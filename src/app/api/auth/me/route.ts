import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/security/rbac';
import { decrypt, maskNIK, maskPhone } from '@/lib/security/encryption';

export async function GET(req: Request) {
  try {
    const auth = await getAuthUser(req);
    
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = auth.profile;

    // Decrypt and mask
    let displayNik = '***';
    let displayNoHp = '***';

    try {
      if (profile.nik) displayNik = maskNIK(decrypt(profile.nik));
      if (profile.no_hp) displayNoHp = maskPhone(decrypt(profile.no_hp));
    } catch (e) {
      console.error('Error decrypting profile data:', e);
    }

    return NextResponse.json({ 
      success: true, 
      profile: {
        ...profile,
        nik: displayNik,
        no_hp: displayNoHp
      } 
    }, { status: 200 });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
