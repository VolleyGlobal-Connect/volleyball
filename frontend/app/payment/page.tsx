import React from 'react'

const page = () => {

    return (
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

                    <button className='min-w-[80%] bg-blue-600 text-white mt-[70%] text-xl font-medium px-2 py-3 rounded-md' >Pay</button>

                </div>
            </div>
        </main>
    )
}

export default page