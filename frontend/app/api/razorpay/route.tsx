import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        // rezorpay_order_id (need to be retrive form the server/database not  the the one return form the checkout)

        const razorpay_order_id = formData.get("razorpay_order_id") as string;
        const razorpay_payment_id = formData.get("razorpay_payment_id") as string;
        const razorpay_signature = formData.get("razorpay_signature") as string;
        const hmac_sha256 = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        hmac_sha256.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac_sha256.digest("hex");
        if (generated_signature == razorpay_signature) {
            return NextResponse.json({
                msg: "success",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            });

        }
        else {
            return NextResponse.json({ msg: "Transaction is not legit!" });
        }

    } catch (err: any) {
        console.error("Error in /api/razorpay:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
