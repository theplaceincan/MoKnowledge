'use client';

import { useState } from "react";
import Image from "next/image";

import { KnowledgeBase } from "../types";

export default function Knowledge() {
  const [url, setUrl] = useState("");
  const [loading, isLoading] = useState(false);
  const [scraped, isScraped] = useState(false);
  const [data, setData] = useState<KnowledgeBase | null>(null);

  // form validation

  // error handling

  // scrape
  const scrape = async () => {
    isScraped(false)
    isLoading(true)
    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    const result = await res.json();
    console.log(result)
    setData(result)
    isLoading(false)
    isScraped(true)
  }

  // review and edit extracted information before saving

  // save button into a JSON structure

  return (
    <div className="p-5">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-200 space-y-4">
          <p className="font-semibold text-zinc-500 text-left w-full">Enter website to generate knowledge data</p>
          <input onChange={(e) => setUrl(e.target.value)} className="w-full max-w-200 px-4 py-3 border border-(--brand-blue) border-solid rounded-xl text-zinc-700 bg-transparent transition-colors focus:border-(--brand-blue-light) focus:outline-none" />
          {loading == true ? (
            <button onClick={scrape} className="w-full max-w-200 cursor-pointer p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 border-2 border-transparent active:border-blue-400 font-semibold text-white">
              Loading
            </button>
          ) : (
            <button onClick={scrape} className="w-full max-w-200 cursor-pointer p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 border-2 border-transparent active:border-blue-400 font-semibold text-white">
              Get Data
            </button>
          )}
          {/* href={'/knowledge/view'} */}
          {scraped && (
            <button className="w-full max-w-200 cursor-pointer p-3 rounded-2xl bg-white text-blue-600 hover:bg-blue-100 border-2 border-blue-600 active:border-blue-400 font-semibold">
              Save to Knowledge Base
            </button>
          )}

        </div>
      </div>

      {/* Data Display */}

    </div >
  );
}
