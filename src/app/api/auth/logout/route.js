import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');

    return NextResponse.json({
      message: 'Abmeldung erfolgreich',
    });
  } catch (error) {
    console.error('Abmeldefehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}