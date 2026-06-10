import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("x-dodo-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Verify signature (Assuming HMAC SHA256)
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
  if (secret) {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(payload).digest("hex");
    if (digest !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const event = JSON.parse(payload);

  try {
    switch (event.type) {
      case "checkout.succeeded":
        const { customer_email, product_id, id: dodoId } = event.data;
        
        // Find or create user
        const user = await prisma.user.upsert({
          where: { email: customer_email },
          update: {},
          create: { email: customer_email },
        });

        // Update or create subscription
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            status: "active",
            plan: product_id, // Map product_id to plan name if needed
            dodoId: dodoId,
          },
          create: {
            userId: user.id,
            status: "active",
            plan: product_id,
            dodoId: dodoId,
          },
        });
        break;

      case "subscription.cancelled":
        await prisma.subscription.update({
          where: { dodoId: event.data.id },
          data: { status: "cancelled" },
        });
        break;

      // Add more cases as needed
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
