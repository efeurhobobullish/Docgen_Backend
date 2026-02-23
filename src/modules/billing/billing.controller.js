import Stripe from "stripe";
import UserModel from "../../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================
   CREATE CHECKOUT SESSION
====================== */
export const createCheckoutSession = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/billing/success`,
      cancel_url: `${process.env.CLIENT_URL}/billing/cancel`,
      metadata: {
        userId: user.id,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ======================
   STRIPE WEBHOOK
====================== */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const userId = session.metadata.userId;

      await UserModel.findByIdAndUpdate(userId, {
        plan: "pro",
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const customerEmail = subscription.customer_email;

      await UserModel.findOneAndUpdate(
        { email: customerEmail },
        { plan: "free" }
      );
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
