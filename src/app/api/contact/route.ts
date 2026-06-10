import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    console.log('Contact form submission:', { name, email, subject, message });

    // In a real app, send email here (e.g. using Resend or Nodemailer)
    
    return NextResponse.redirect(new URL('/thank-you', req.url), {
      status: 303,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
