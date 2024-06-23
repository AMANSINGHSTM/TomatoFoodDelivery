import userModel from "../models/UserModel.js";
import Stripe from "stripe"
import oredrModel from "../models/OrderModel.js"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// console.log(stripe)


// placing user order for frontend

const placeOrder = async (req, res) => {
    const frontend_url = "https://tomatofooddelivery-frontend.onrender.com/"

    try {
        const newOrder = new oredrModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} })

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1
        })
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId =${newOrder._id}`,
        })
        res.json({ success: true, session_url: session.url })



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body
    try {
        if (success === "true") {
            await oredrModel.findByIdAndUpdate(orderId, { payment: true })
            res.json({ success: true, message: "sucessfully paid" })
        }
        else {
            await oredrModel.findByIdAndUpdate(orderId)
            res.json({ success: false, message: "Not paid" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }


}

//  user orders for frontend

const userOrders = async (req, res) => {

    try {
        const orders = await oredrModel.find({ userId: req.body.userId })
        res.json({ success: true, data: orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }


}

// listing order for admin panel

const listOrders = async (req, res) => {
    try {
        const orders = await oredrModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }


}

// api for updatings order status

const updateStatus = async (req, res) => {
    try {
        await oredrModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error updateStatus:" })
    }

}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };








