import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Security check: Only allow admin
  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { slug, title, date, author, category, users, rating, icon, tldr, description, video_url, content } = data;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postsDirectory = path.join(process.cwd(), 'content/blog');
    const filePath = path.join(postsDirectory, `${slug}.md`);

    const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date || new Date().toISOString().split('T')[0]}"
lastUpdated: "${new Date().toISOString().split('T')[0]}"
author: "${author || 'Skool Support Team'}"
category: "${category || 'Guides'}"
users: "${users || '4,000+ readers'}"
rating: "${rating || '4.9'}"
icon: "${icon || 'media'}"
tldr: "${tldr.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
video_url: "${video_url || ''}"
---

${content}`;

    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Article published successfully' });
  } catch (error: any) {
    console.error('Error publishing article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
