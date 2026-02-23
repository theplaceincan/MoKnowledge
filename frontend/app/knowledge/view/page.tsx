'use client';

import { useState } from "react";
import Image from "next/image";


export default function KnowledgeView() {
  const [url, setUrl] = useState("");

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-200 space-y-4">
          <p className="font-semibold text-zinc-500 text-left w-full">Knowledge View</p>
        </div>
      </div>


    </div>
  );
}
