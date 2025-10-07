import { NextResponse } from 'next/server';
import { createStakeholder } from "@/server/useractions";
import { requestProductConfig } from '@/server/useractions';
import { UpdateProductsConfig } from '@/server/useractions';
export async function POST(request: Request) {

    try {
        const body = await request.json();
        const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
        const response = await fetch('https://api.razorpay.com/v2/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        await createStakeholder(data.id, body);
        const productId = await requestProductConfig(data.id);
        UpdateProductsConfig(data.id, productId.id, body);
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Error creating Razorpay account:", error);
        return NextResponse.json({ error }, { status: 500 });
    }

}