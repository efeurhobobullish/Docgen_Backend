import Stripe from "stripe";
import TeamModel from "../team/team.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ======================
   CREATE TEAM CHECKOUT
====================== */
export const createTeamCheckoutSession = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await TeamModel.findOne({
      _id: teamId,
      owner: req.user.id,
    });

    if (!team) {
      return res.status(403).json({
        message: "Only team owner can upgrade",
      });
    }

    let customerId = team.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { teamId: team.id },
      });

      customerId = customer.id;

      team.stripeCustomerId = customerId;
      await team.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_TEAM_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/team/${team.id}/billing-success`,
      cancel_url: `${process.env.CLIENT_URL}/team/${team.id}/billing-cancel`,
      metadata: {
        teamId: team.id,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};