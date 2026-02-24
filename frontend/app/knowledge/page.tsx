'use client';

import { useState } from "react";
import Image from "next/image";

import { KnowledgeBase } from "../types";
import { saveKnowledge } from "../services/knowledge";
import { KnowledgeBaseRow } from "@/app/types";

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{title}</p>
      <div className="grid grid-cols-2 gap-1">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, editMode }: { label: string, value?: string, onChange?: (val: string) => void, editMode: boolean }) {
  if (!value && !editMode) return null
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-zinc-400 w-28 shrink-0">{label}</span>
      {editMode ? (
        <input
          defaultValue={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="text-zinc-700 border-b border-zinc-300 focus:outline-none focus:border-blue-500 flex-1 bg-transparent"
        />
      ) : (
        <span className="text-zinc-700">{value}</span>
      )}
    </div>
  )
}

export default function Knowledge() {
  const [url, setUrl] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [editMode, setEditMode] = useState(false)
  const [completedSave, setCompletedSave] = useState(false)
  const [scraped, isScraped] = useState(false);
  const [copiedJSON, isCopiedJSON] = useState(false);

  const [data, setData] = useState<KnowledgeBase | null>(null);

  const [errorMsg, setErrorMsg] = useState("")
  const [error, setError] = useState(false)

  function handleDisplayError(errorMsg: string) {
    setError(true)
    setErrorMsg(errorMsg)
  }

  function copyJSON() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    isCopiedJSON(true)
  }

  // scrape
  const scrape = async () => {
    setError(false)
    setCompletedSave(false)
    isScraped(false)
    setLoadingData(true)
    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    // error handling
    if (!url.trim()) {
      handleDisplayError("Please enter a website URL");
      return;
    }
    if (!res.ok) {
      const errData = await res.text();
      let msg = `Failed (status ${res.status})`;

      try {
        const data = JSON.parse(errData);
        msg = data?.error || msg;
      } catch {
        if (errData) msg = errData.slice(0, 200);
      }
      handleDisplayError(msg)
      setLoadingData(false)
      return
    }
    const result = await res.json();
    console.log(result)
    setData(result)
    setLoadingData(false)
    isScraped(true)
  }

  // save button into a JSON structure
  function runSaveKnowledge(data: KnowledgeBase) {
    setLoadingSave(true)
    saveKnowledge(data)
    setLoadingSave(false)
    setCompletedSave(true)
  }

  // review and edit extracted information before saving
  // helper functions
  function cancelEditMode() {
    setEditMode(false);
  }
  function saveEditedData() {
    setEditMode(false);
  }

  return (
    <div className="p-5">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-200 space-y-4">
          <p className="font-semibold text-zinc-600 text-left w-full">Enter website to generate knowledge data</p>
          <input onChange={(e) => setUrl(e.target.value)} className="w-full max-w-200 px-4 py-2 border border-(--brand-blue) border-solid rounded-xl text-zinc-700 bg-transparent transition-colors focus:border-(--brand-blue-light) focus:outline-none" />

          {error && (
            <p className="bg-red-50 text-red-500 text-center p-2 px-2 rounded-xl">Error: {errorMsg}</p>
          )}

          <button onClick={scrape} className="w-full max-w-200 cursor-pointer p-2 shadow-md rounded-2xl border-blue-600 bg-blue-600 hover:bg-blue-700 border-2 active:border-blue-400 font-semibold text-white">
            {loadingData == true ? (
              <p>Scraping website… this may take up to 10 seconds</p>
            ) : (
              <p>Get Data</p>
            )}
          </button>
          {/* href={'/knowledge/view'} */}
          {scraped && data && completedSave == false && (
            <button onClick={() => runSaveKnowledge(data)} className="w-full max-w-200 cursor-pointer p-2 shadow-md rounded-2xl border-blue-600 hover:bg-blue-100 border-2 active:border-blue-200 font-semibold text-blue-600">
              {loadingSave == true ? (
                <p>Saving knowledge base...</p>
              ) : (
                <p>Save to Knowledge Base</p>
              )}
            </button>
          )}
          {scraped && data && completedSave && (
            <button onClick={() => runSaveKnowledge(data)} disabled={completedSave} className="w-full max-w-200 cursor-pointer p-2 shadow-md rounded-2xl border-green-600 hover:bg-green-100 border-2 active:border-green-200 font-semibold text-green-600">
              <p>Completed Save</p>
            </button>
          )}
        </div>
      </div>

      {/* onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))} */}


      {/* Data Display */}
      {scraped && data && (

        <div className="w-full mt-5 flex items-center justify-center">
          <div className="w-full border max-w-325 border-zinc-200 rounded-2xl p-6 space-y-6">
            <div className="flex justify-between">
              <div className="space-x-2">
                {editMode ? (
                  <>
                    <button onClick={() => cancelEditMode()} className="max-w-200 shadow-md cursor-pointer p-1 px-3 rounded-2xl bg-white text-red-600 hover:bg-red-100 border-2 border-red-600 active:border-red-400 font-semibold">Cancel</button>
                    <button onClick={() => saveEditedData()} className="max-w-200 shadow-md cursor-pointer p-1 px-3 rounded-2xl bg-white text-green-600 hover:bg-green-100 border-2 border-green-600 active:border-green-400 font-semibold">Save Data</button>
                  </>
                ) : (
                  <button onClick={() => setEditMode(true)} className="max-w-200 shadow-md cursor-pointer p-1 px-3 rounded-2xl bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-600 active:border-gray-400 font-semibold">Edit Data</button>
                )}
              </div>
              <div>
                {copiedJSON ? (
                  <button className="max-w-200 shadow-md cursor-pointer p-1 px-3 rounded-2xl bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-600 active:border-gray-400 font-semibold">Copied JSON</button>
                ) : (
                  <button onClick={() => copyJSON()} className="max-w-200 shadow-md cursor-pointer p-1 px-3 rounded-2xl bg-white text-blue-600 hover:bg-blue-100 border-2 border-blue-600 active:border-blue-400 font-semibold">Copy JSON</button>
                )}
              </div>
            </div>

            <div>
              <p className="text-2xl font-bold">{data?.companyFoundation?.name}</p>
              <a target="_blank" href={data?.companyFoundation?.websiteUrl} className="text-blue-500 text-sm">{data?.companyFoundation?.websiteUrl}</a>
              <p className="text-zinc-500 mt-1">{data?.companyFoundation?.description}</p>
            </div>

            <Section title="Company Foundation">
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, companyFoundation: { ...data!.companyFoundation, industry: val } })}
                label="Industry" value={data?.companyFoundation?.industry} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, companyFoundation: { ...data!.companyFoundation, businessModel: val } })}
                label="Business Model" value={data?.companyFoundation?.businessModel} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, companyFoundation: { ...data!.companyFoundation, founded: val } })}
                label="Founded" value={data?.companyFoundation?.founded} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, companyFoundation: { ...data!.companyFoundation, employeeCount: val } })}
                label="Employees" value={data?.companyFoundation?.employeeCount} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, companyFoundation: { ...data!.companyFoundation, mainAddress: val } })}
                label="Address" value={data?.companyFoundation?.mainAddress} />
            </Section>

            <Section title="Positioning">
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, positioning: { ...data!.positioning, companyPitch: val } })}
                label="Pitch" value={data?.positioning?.companyPitch} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, positioning: { ...data!.positioning, foundingStory: val } })}
                label="Story" value={data?.positioning?.foundingStory} />
            </Section>

            <Section title="Branding">
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, brandingAndStyle: { ...data!.brandingAndStyle, tone: val.split(', ') } })}
                label="Tone" value={data?.brandingAndStyle?.tone?.join(', ')} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, brandingAndStyle: { ...data!.brandingAndStyle, fonts: val.split(', ') } })}
                label="Fonts" value={data?.brandingAndStyle?.fonts?.join(', ')} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, brandingAndStyle: { ...data!.brandingAndStyle, brandColors: val.split(', ') } })}
                label="Colors" value={data?.brandingAndStyle?.brandColors?.join(', ')} />
            </Section>

            <Section title="Online Presence">
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, onlinePresence: { ...data!.onlinePresence, linkedin: val } })}
                label="LinkedIn" value={data?.onlinePresence?.linkedin} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, onlinePresence: { ...data!.onlinePresence, instagram: val } })}
                label="Instagram" value={data?.onlinePresence?.instagram} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, onlinePresence: { ...data!.onlinePresence, facebook: val } })}
                label="Facebook" value={data?.onlinePresence?.facebook} />
            </Section>

            <Section title="Offerings">
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, offerings: { ...data!.offerings, offeringTypes: val } })}
                label="Types" value={data?.offerings?.offeringTypes} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, offerings: { ...data!.offerings, pricing: val.split(', ') } })}
                label="Pricing" value={data?.offerings?.pricing?.join(', ')} />
            </Section>

            <Section title="Extras">
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, extras: { ...data!.extras, email: val } })}
                label="Email" value={data?.extras?.email} />
              <Field editMode={editMode} onChange={(val) => setData({ ...data!, extras: { ...data!.extras, phone: val } })}
                label="Phone" value={data?.extras?.phone} />
              <Field editMode={false}
                label="Trust Signals" value={data?.extras?.trustSignals?.join(', ')} />
              <Field editMode={false}
                label="Testimonials" value={data?.extras?.testimonials?.join(' | ')?.slice(0, 200)} />
              <Field editMode={false}
                label="USPs" value={data?.extras?.usps?.join(', ')} />
              <Field editMode={false}
                label="FAQs" value={data?.extras?.faqs?.join(' | ')?.slice(0, 200)} />
            </Section>
          </div>
        </div>
      )}
    </div >
  );
}
