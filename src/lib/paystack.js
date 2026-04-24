import axios from 'axios';

const paystackClient = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function initializePayment(data) {
  try {
    const response = await paystackClient.post('/transaction/initialize', {
      email: data.email,
      amount: data.amount * 100, // Convert to kobo/cents
      reference: data.reference,
      metadata: data.metadata,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
    });
    return response.data;
  } catch (error) {
    // console.error('Paystack API Error:', error);
    throw error;
  }
}

export async function verifyPayment(reference) {
  try {
    const response = await paystackClient.get(`/transaction/verify/${reference}`);
    return response.data;
  } catch (error) {
    // console.error('Paystack API Error:', error);
    throw error;
  }
}

export async function listTransactions() {
  try {
    const response = await paystackClient.get('/transaction');
    return response.data;
  } catch (error) {
    // console.error('Paystack API Error:', error);
    throw error;
  }
}