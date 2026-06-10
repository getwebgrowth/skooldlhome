export const createCheckoutSession = async (planId: string, userEmail: string) => {
  // This is a mock implementation of the Dodo Payments SDK call
  // In a real app, you would use their official library
  const response = await fetch('https://api.dodopayments.com/v1/checkouts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DODO_PAYMENTS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: planId,
      customer_email: userEmail,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    }),
  });

  return response.json();
};
