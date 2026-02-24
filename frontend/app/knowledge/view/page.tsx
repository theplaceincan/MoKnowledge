'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { getKnowledgeData } from "@/lib/knowledge";
import { KnowledgeBaseRow } from "@/app/types";
import { supabase } from "@/lib/supabase";

export default function KnowledgeView() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<KnowledgeBaseRow[]>([])

  const [search, setSearch] = useState("");
  const [openSortMenu, setOpenSortMenu] = useState(false);
  // const sortOptions = ["A-Z", "Z-A"]
  const [sortAZ, setSortAZ] = useState(false);
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const filterOptions = ["name", "industry"]
  type viewModes = "card" | "table" | "detail"
  const [viewMode, setViewMode] = useState<viewModes>("card")
  const [selected, setSelected] = useState<KnowledgeBaseRow | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Getting data
  useEffect(() => {
    console.log("Getting data")
    const getData = async () => {
      const data = await getKnowledgeData()
      setData(data ?? [])
    }
    getData()
    // console.log("Data retrieved")
  }, [])

  // Viewing style helper functions
  function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{title}</p>
        <div className="grid grid-cols-2 gap-1">{children}</div>
      </div>
    )
  }

  function Field({ label, value }: { label: string, value?: string }) {
    if (!value) return null
    const shortened = value.length > 300 ? value.slice(0, 300) + "..." : value
    return (
      <div className="flex gap-2 text-sm">
        <span className="text-zinc-400 w-28 shrink-0">{label}</span>
        <span className="text-zinc-700">{shortened}</span>
      </div>
    )
  }

  function viewDetails(card: KnowledgeBaseRow) {
    setSelected(card)
    setViewMode("detail")
  }

  // Sorting and Filtering
  const filtered = data.filter(e =>
    e.data?.companyFoundation?.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.data?.companyFoundation?.websiteUrl?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const nameA = a.data?.companyFoundation?.name || ''
    const nameB = b.data?.companyFoundation?.name || ''
    return sortAZ ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
  })

  // Search

  // {data.map((e) => (
  //   <div key={e.id}>
  //     <p>{e.data.companyFoundation.name}</p>
  //     <p>{e.data.companyFoundation.websiteUrl}</p>
  //     <p>{e.data.companyFoundation.description}</p>
  //   </div>
  // ))}

  // Delete

  async function deleteKnowledgeBase() {
    if (!selected) return
    setConfirmDelete(false)

    await supabase.from('knowledge_base').delete().eq('id', selected.id)

    setData(prev => prev.filter(row => row.id !== selected.id))
    setSelected(null)
    setViewMode("card")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8">

        {/* Sort, Filter, Search, View */}
        <div className="flex items-center gap-3 max-w-6xl mx-auto">

          {/* Search */}
          <div className="flex-1">
            <input onChange={(e) => setSearch(e.target.value)} value={search}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-700 bg-white focus:outline-none focus:border-blue-500"
              placeholder="Search companies..."
            />
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortAZ(!sortAZ)}
            className="cursor-pointer font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap"
          >
            {sortAZ ? 'A → Z' : 'Z → A'}
          </button>

          {/* Filter */}
          <div className="relative">
            <button
              className="cursor-pointer font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-4 py-2.5 rounded-xl text-sm"
              onClick={() => setOpenFilterMenu(!openFilterMenu)}
            >
              Filter by
            </button>
            {openFilterMenu && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-zinc-200 rounded-xl shadow-md z-10 min-w-32">
                <ul className="py-1">
                  {filterOptions.map((e, i) => (
                    <li key={i}>
                      <a
                        href={'#'}
                        onClick={() => setOpenFilterMenu(false)}
                        className="block px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
                      >
                        {e}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* View */}

          <div className="flex border border-zinc-200 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode("card")} className="p-2.5 cursor-pointer hover:bg-zinc-50 text-zinc-500 border-x border-zinc-200">
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </button>
            <button onClick={() => setViewMode("table")} className="p-2.5 cursor-pointer hover:bg-zinc-50 text-zinc-500">
              <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Data display  */}
        <div className="mt-5" />

        {viewMode == "card" && (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-325 cursor-pointer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((e) => (
                <div key={e.id} onClick={() => viewDetails(e)} className="border border-zinc-200 rounded-2xl p-5 space-y-2 hover:border-blue-400 transition-all">
                  <p className="font-semibold text-zinc-800">{e.data?.companyFoundation?.name}</p>
                  <p className="text-xs text-blue-500">{e.data?.companyFoundation?.websiteUrl}</p>
                  <p className="text-xs text-zinc-500 line-clamp-2">{e.data?.companyFoundation?.description}</p>
                  <p className="text-xs text-zinc-400">{e.data?.companyFoundation?.industry}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode == "table" && (
          <table className="w-full text-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 text-zinc-500 font-semibold">Company</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-semibold">Industry</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-semibold">Model</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-semibold">Founded</th>
                <th className="text-left px-4 py-3 text-zinc-500 font-semibold">Socials</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} onClick={() => viewDetails(e)} className="border-t border-zinc-100 hover:bg-zinc-50 cursor-pointer">
                  <td className="px-4 py-3 font-medium">{e.data?.companyFoundation?.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{e.data?.companyFoundation?.industry || '—'}</td>
                  <td className="px-4 py-3 text-zinc-500">{e.data?.companyFoundation?.businessModel || '—'}</td>
                  <td className="px-4 py-3 text-zinc-500">{e.data?.companyFoundation?.founded || '—'}</td>
                  <td className="px-4 py-3 text-zinc-400">{[e.data?.onlinePresence?.linkedin && 'LinkedIn', e.data?.onlinePresence?.instagram && 'IG'].filter(Boolean).join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}


        {viewMode == "detail" && (
          <>
            {selected && (
              <>
                <div className="w-full mb-5 flex flex-col items-center justify-center">
                  <div className="w-full border max-w-325 border-zinc-200 rounded-2xl p-6 space-y-6">
                    <div>
                      <p className="text-2xl font-bold">{selected.data?.companyFoundation?.name}</p>
                      <a target="_blank" href={selected.data?.companyFoundation?.websiteUrl} className="text-blue-500 text-sm">{selected.data?.companyFoundation?.websiteUrl}</a>
                      <p className="text-zinc-500 mt-1">{selected.data?.companyFoundation?.description}</p>
                    </div>

                    <Section title="Company Foundation">
                      <Field label="Industry" value={selected.data?.companyFoundation?.industry} />
                      <Field label="Business Model" value={selected.data?.companyFoundation?.businessModel} />
                      <Field label="Founded" value={selected.data?.companyFoundation?.founded} />
                      <Field label="Employees" value={selected.data?.companyFoundation?.employeeCount} />
                      <Field label="Address" value={selected.data?.companyFoundation?.mainAddress} />
                    </Section>

                    <Section title="Positioning">
                      <Field label="Pitch" value={selected.data?.positioning?.companyPitch} />
                      <Field label="Story" value={selected.data?.positioning?.foundingStory} />
                    </Section>

                    <Section title="Branding">
                      <Field label="Tone" value={selected.data?.brandingAndStyle?.tone?.join(', ')} />
                      <Field label="Fonts" value={selected.data?.brandingAndStyle?.fonts?.join(', ')} />
                      <Field label="Colors" value={selected.data?.brandingAndStyle?.brandColors?.join(', ')} />
                    </Section>

                    <Section title="Online Presence">
                      <Field label="LinkedIn" value={selected.data?.onlinePresence?.linkedin} />
                      <Field label="Instagram" value={selected.data?.onlinePresence?.instagram} />
                      <Field label="Facebook" value={selected.data?.onlinePresence?.facebook} />
                    </Section>

                    <Section title="Offerings">
                      <Field label="Types" value={selected.data?.offerings?.offeringTypes} />
                      <Field label="Pricing" value={selected.data?.offerings?.pricing?.join(', ')} />
                    </Section>

                    <Section title="Extras">
                      <Field label="Email" value={selected.data?.extras?.email} />
                      <Field label="Phone" value={selected.data?.extras?.phone} />
                      <Field label="Trust Signals" value={selected.data?.extras?.trustSignals?.join(', ')} />
                      <Field label="Testimonials" value={selected.data?.extras?.testimonials?.slice(0, 2).join(' | ')} />
                      <Field label="USPs" value={selected.data?.extras?.usps?.join(', ')} />
                    </Section>
                  </div>
                  <div className="mt-5">
                    {confirmDelete ? (
                      <div className="space-x-3">
                        <button onClick={() => deleteKnowledgeBase()} className="max-w-200 shadow-md cursor-pointer p-1 px-3 rounded-2xl bg-white text-red-600 hover:bg-blue-100 border-2 border-red-600 active:border-red-400 font-semibold">Confirm Deletion</button>
                        <button onClick={() => setConfirmDelete(false)} className="max-w-200 shadow-md cursor-pointer p-1 px-3 rounded-2xl bg-white text-gray-600 hover:bg-blue-100 border-2 border-gray-600 active:border-gray-400 font-semibold">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(true)} className="max-w-200 shadow-md cursor-pointer p-1 px-3 rounded-2xl bg-white text-red-600 hover:bg-blue-100 border-2 border-red-600 active:border-red-400 font-semibold">Delete Knowledge Base</button>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}


      </div>
    </div>
  );
}
