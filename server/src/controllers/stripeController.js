const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../utils/prisma');

const createCheckoutSession = async (req, res) => {
    const userId = req.user.id;
    // Use request origin or default to first URL in list
    const origin = req.headers.origin || process.env.FRONTEND_URL.split(',')[0];

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Promptify Pro - Monthly',
                            description: 'Unlimited tokens for 1 month',
                        },
                        unit_amount: 1900, // $19.00
                        recurring: { interval: 'month' },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/dashboard?success=true`,
            cancel_url: `${origin}/pricing?canceled=true`,
            client_reference_id: userId,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const stripeId = session.subscription;

        await prisma.user.update({
            where: { id: userId },
            data: {
                plan: 'PRO',
                tokens: { increment: 10000 } // Give high tokens for PRO
            }
        });

        await prisma.subscription.create({
            data: {
                userId,
                stripeId,
                status: 'active',
                currentPeriodEnd: new Date(session.expires_at * 1000)
            }
        });
    }

    res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhook };
