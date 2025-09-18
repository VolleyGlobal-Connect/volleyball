"use client"
import React from 'react'
import { initiate } from '@/actions/useractions'
import Script from 'next/script'
import { useState } from 'react';
declare global {
    interface Window {
        Razorpay: any;
    }
}

const page = () => {
    const [amount, setAmount] = useState<number | null>(null);
    const pay = async (amount: number | null) => {
        if (!amount) return;
        let a = await initiate(amount)
        let orderId = a.id
        var options = {
            "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            "amount": amount,// Amount is in currency subunits. 
            "currency": "INR",
            "name": "Acme Corp", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "John Doe", //your customer's name
                "email": "john@email.com",
                "contact": "7820017990" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const rzp1 = new window.Razorpay(options);

        rzp1.open();

    }



    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive"></Script>

            <main className='min-h-screen nata items-center flex flex-col mt-24  '>
                <div className="text-center space-y-8">
                    <h1 className='text-4xl'>Payment Page</h1>
                    <div className="mt-10 text-2xl">
                        Fund In ETH or IN local currencies
                    </div>
                    <div className="flex  gap-6 justify-around">
                        <button>
                            ETH
                        </button>
                        <button>
                            Rupees
                        </button>
                    </div>
                    <div className="shadow-md min-h-[350px]  shadow-blue-200 ">
                        <input type="number" name="" id="" value={amount ? amount : ""} placeholder='enter amount' className='text-lg' onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)} />
                        <button className='min-w-[80%] bg-blue-600 text-white mt-[70%] text-xl font-medium px-2 py-3 rounded-md' onClick={() => pay(amount ? amount * 100 : null)}>Pay</button>

                    </div>
                </div>
            </main>
        </>
    )
}

export default page