export const dynamic = 'force-static';

import { NextResponse } from 'next/server';

export async function GET() {
  // Статична заглушка для авторизації
  return NextResponse.json({ 
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      image: '/placeholder.svg?height=50&width=50',
      role: 'admin'
    }
  });
}

export async function POST() {
  // Статична заглушка для авторизації
  return NextResponse.json({ 
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      image: '/placeholder.svg?height=50&width=50',
      role: 'admin'
    }
  });
}
