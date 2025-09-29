import React from 'react'
import { TypeAnimation } from 'react-type-animation';
import Logo from '../assets/logo.png'
import NewsSection from './NewsSection';

const Home = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center">
            <div className='flex items-center justify-center w-full sm:py-40'>
                <div className="py-10 px-10 grid sm:grid-cols-2 gap-20 md:gap-30 lg:gap-60">
                    <div className='flex flex-col justify-center gap-4 px-5 py-10'>
                        <h1 className='text-5xl text-gray-800'>Disaster Support</h1>
                        <TypeAnimation
                            sequence={[
                                "Be Safe, Stay Informed", 3000,
                                "Your Safety, Our Priority", 3000,
                                "Helping Hands in Crisis", 3000,
                            ]}

                            wrapper="span"
                            speed={70}
                            repeat={Infinity}
                            className="text-2xl text-gray-700"
                        />
                        <div className='flex gap-4 flex-col sm:flex-row mt-4'>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md mt-4">Request Help</button>
                            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md mt-4">Report Disaster</button>
                        </div>
                    </div>
                    <div className='flex gap-4 items-center justify-end'>
                        <img src={Logo} alt=""
                            className="w-72 h-72 object-contain drop-shadow-2xl rounded-2xl bg-white/5 p-4 backdrop-blur-sm"
                        />
                    </div>
                </div>
            </div>

            <div>
                <NewsSection />
            </div>
        </section>
    )
}

export default Home
