import Stripe from "stripe";
import UserModel from "../../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    let customerId = user.stripeCustomerId;

    // Create Stripe customer if not exists
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });

      customerId = customer.id;

      await UserModel.findByIdAndUpdate(user.id, {
        stripeCustomerId: customerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/billing/success`,
      cancel_url: `${process.env.CLIENT_URL}/billing/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const createCustomerPortal = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user.stripeCustomerId) {
      return res.status(400).json({
        message: "No active subscription found",
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/dashboard`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
