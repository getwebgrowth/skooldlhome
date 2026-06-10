"use client";

import React, { useState } from "react";
import styles from "./dashboard.module.css";

interface PricingSectionProps {
  userEmail: string;
}

export default function PricingSection({ userEmail }: PricingSectionProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCheckout = async (planId: string) => {
    setLoadingPlan(planId);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          email: userEmail,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className={styles.pricingSection}>
      <div className={styles.pricingHeader}>
        <h2>Unlock Unlimited Access</h2>
        <p>Upgrade your account to enable the premium downloader features and archive all video content.</p>
        {error && <p className={styles.pricingError}>{error}</p>}
      </div>

      <div className={styles.pricingGrid}>
        {/* Monthly Plan */}
        <div className={styles.priceCard}>
          <div className={styles.planTitle}>Standard Monthly</div>
          <div className={styles.planPrice}>
            <span>$</span>20<span>/mo</span>
          </div>
          <p className={styles.planDesc}>Flexible monthly billing. Cancel anytime with a single click.</p>
          <ul className={styles.planFeatures}>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Unlimited Skool Downloads
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Loom Player Support
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Email Customer Support
            </li>
          </ul>
          <button
            onClick={() => handleCheckout("monthly")}
            disabled={loadingPlan !== null}
            className={styles.pricingButton}
          >
            {loadingPlan === "monthly" ? "Redirecting..." : "Upgrade to Monthly"}
          </button>
        </div>

        {/* Lifetime Plan */}
        <div className={`${styles.priceCard} ${styles.premiumPriceCard}`}>
          <div className={styles.bestValueBadge}>Best Value</div>
          <div className={styles.planTitle}>Lifetime Pro</div>
          <div className={styles.planPrice}>
            <span>$</span>39<span>one-time</span>
          </div>
          <p className={styles.planDesc}>Pay once, own forever. The ultimate choice with zero recurring fees.</p>
          <ul className={styles.planFeatures}>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Everything in Standard
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Lifetime Feature Updates
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Priority Feature Requests
            </li>
          </ul>
          <button
            onClick={() => handleCheckout("lifetime")}
            disabled={loadingPlan !== null}
            className={styles.premiumPricingButton}
          >
            {loadingPlan === "lifetime" ? "Redirecting..." : "Get Lifetime Access"}
          </button>
        </div>
      </div>
    </section>
  );
}
