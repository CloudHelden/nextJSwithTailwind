import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET current user profile
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token.value);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Ungültiges Token' },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        registriertAm: user.registriertAm,
        alter: user.alter,
        hobbies: user.hobbies,
        adresse: user.adresse
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token.value);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Ungültiges Token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, profilePicture, alter, hobbies, adresse } = body;

    // Validate profile picture size (base64 string shouldn't be too large)
    if (profilePicture && profilePicture.length > 10 * 1024 * 1024) { // ~7.5MB actual file size
      return NextResponse.json(
        { error: 'Profilbild ist zu groß' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    if (alter !== undefined) updateData.alter = alter;
    if (hobbies !== undefined) updateData.hobbies = hobbies;
    if (adresse !== undefined) updateData.adresse = adresse;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profil erfolgreich aktualisiert',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        registriertAm: user.registriertAm,
        alter: user.alter,
        hobbies: user.hobbies,
        adresse: user.adresse
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// DELETE profile picture
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token.value);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Ungültiges Token' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { profilePicture: null },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profilbild erfolgreich gelöscht',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Profile picture delete error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}