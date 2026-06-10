import React from 'react';
import styles from '../dashboard/dashboard.module.css';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const userCount = await prisma.user.count();
  const subscriptionCount = await prisma.subscription.count({
    where: { status: "active" }
  });
  
  // Recent subscribers
  const recentSubscribers = await prisma.subscription.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Admin Overview</h1>
          <p>Global system status and revenue monitoring.</p>
        </div>
        <div className={styles.badge}>Administrator</div>
      </header>

      <div className={styles.grid}>
        <div className="premium-card">
          <h3>Total Users</h3>
          <h2 style={{ color: '#10b981', margin: '10px 0' }}>{userCount}</h2>
          <p>Active accounts in system</p>
        </div>

        <div className="premium-card">
          <h3>Active Subscribers</h3>
          <h2 style={{ margin: '10px 0' }}>{subscriptionCount}</h2>
          <p>Paying customers</p>
        </div>

        <div className="premium-card">
          <h3>Recent Signups</h3>
          <div style={{ marginTop: '16px' }}>
            {recentSubscribers.map((sub, index) => (
              <p key={sub.id}>{index + 1}. {sub.user.email} ({sub.plan})</p>
            ))}
            {recentSubscribers.length === 0 && <p>No recent subscriptions.</p>}
          </div>
        </div>

        <div className="premium-card">
          <h3>System Health</h3>
          <p>Dodo Webhooks: <strong>Active</strong></p>
          <p>Database: <strong>Operational</strong></p>
          <button className={styles.secondaryButton}>View Logs</button>
        </div>

        <div className="premium-card" style={{ border: '2px dashed #10b981' }}>
          <h3>Content Manager</h3>
          <p>Create and publish new blog guides for the community.</p>
          <a href="/admin/publish">
            <button className="button button--primary" style={{ marginTop: '16px', width: '100%' }}>Publish Article</button>
          </a>
        </div>
      </div>
    </div>
  );
}
