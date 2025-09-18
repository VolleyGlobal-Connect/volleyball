"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
const Payment = () => {
    const router = useRouter()
    return (
        <div className="my-20 flex flex-col items-center p-6 shadow-xl shadow-cyan-100 min-h-[300px] rounded-xl justify-around">
            <h2 className="text-5xl">Fund Your Sports</h2>
            <button className="bg-blue-700 px-2 py-1 text-white font-medium text-2xl text-center rounded-md" onClick={() => router.push('/payment')}>Fund</button>
        </div>
    )
}

export default Payment