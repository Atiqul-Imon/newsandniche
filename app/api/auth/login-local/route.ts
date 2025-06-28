import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'ইমেইল এবং পাসওয়ার্ড প্রয়োজন' }, { status: 400 });
    }
    await connectDB();
    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      console.warn('Login failed: user not found', emailLower);
      return NextResponse.json({ message: 'ব্যবহারকারী পাওয়া যায়নি' }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn('Login failed: wrong password', emailLower);
      return NextResponse.json({ message: 'ভুল পাসওয়ার্ড' }, { status: 401 });
    }
    console.log('Login successful:', { id: user._id, email: user.email });
    return NextResponse.json({
      message: 'লগইন সফল হয়েছে',
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'লগইন ব্যর্থ হয়েছে' }, { status: 500 });
  }
} 