import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'সব ফিল্ড পূরণ করা প্রয়োজন' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }, { status: 400 });
    }
    await connectDB();
    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return NextResponse.json({ message: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে' }, { status: 400 });
    }
    const user = new User({ name, email: emailLower, password, role: 'admin', isActive: true });
    await user.save();
    console.log('User registered:', { id: user._id, email: user.email });
    return NextResponse.json({
      message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে',
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' }, { status: 500 });
  }
} 