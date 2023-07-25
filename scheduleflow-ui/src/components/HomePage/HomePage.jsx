import { CalendarDaysIcon} from '@heroicons/react/20/solid';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from 'react';
import NavBar from '../Navbar/Navbar';

export default function HomePage() {
  return (
    <>
    <NavBar />
    <div className="bg-gray-800 text-white">
    
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0  -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-85"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-12 text-center">
          {/* Your text content goes here */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">How it Works</h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">Select the classes you want to take for your current semester, add them to your cart, and hit "Generate." We'll take care of the rest for you!</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/shoppingcart"
              className="rounded-md text-white bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Start Scheduling
            </a>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Image */}
          <div className="relative w-full rounded-xl shadow-xl ring-1 ring-gray-400/10 mt-8 mx-auto" style={{ height: "500px" }}>
            <img
              src="https://scitechdaily.com/images/Advanced-Computer-Chip-Concept.gif"
              alt="Product screenshot"
              className="w-full h-full rounded-xl"
            />
            {/* Add overlay to image */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-40 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}