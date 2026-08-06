"use client";

import { Bookmark, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PetCard from "@/components/PetCard";
import { pets, type Pet } from "@/lib/data";
import { useFeedback } from "@/components/FeedbackProvider";

const initialFilters = {
  type: "All", breed: "All", age: "All", location: "All", size: "All",
  sex: "All", vaccinated: "All", compatibility: "All", personality: "All",
  special: false, urgent: false,
};
type Filters = typeof initialFilters;
type SavedSearch = { id: string; name: string; query: string; filters: Filters; sort: string };
const savedSearchKey = "furu-saved-searches";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sort, setSort] = useState("Featured");
  const [advanced, setAdvanced] = useState(false);
  const [limit, setLimit] = useState(6);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(savedSearchKey) || "[]"); } catch { return []; }
  });
  const [marketplacePets, setMarketplacePets] = useState<Pet[]>(pets);
  const { notify } = useFeedback();

  useEffect(() => {
    void fetch("/api/listings", { headers: { Accept: "application/json" } }).then((response) => response.ok ? response.json() : []).then((livePets: Pet[]) => {
      if (livePets.length) setMarketplacePets([...livePets, ...pets.filter((pet) => !livePets.some((livePet) => livePet.id === pet.id))]);
    });
    void fetch("/api/saved-searches", { headers: { Accept: "application/json" } }).then(async (response) => {
      if (!response.ok) return;
      const rows = await response.json() as { id: string; name: string; criteria: { query?: string; filters?: Filters; sort?: string } }[];
      setSavedSearches(rows.map((row) => ({ id: row.id, name: row.name, query: row.criteria.query || "", filters: row.criteria.filters || initialFilters, sort: row.criteria.sort || "Featured" })));
    });
  }, []);

  const setFilter = (key: keyof Filters, value: string | boolean) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setLimit(6);
  };
  const filtered = useMemo(() => {
    let list = marketplacePets.filter((pet) =>
      (filters.type === "All" || pet.type === filters.type) &&
      (filters.breed === "All" || pet.breed === filters.breed) &&
      (filters.age === "All" || pet.ageGroup === filters.age) &&
      (filters.location === "All" || pet.location === filters.location) &&
      (filters.size === "All" || pet.size === filters.size) &&
      (filters.sex === "All" || pet.sex === filters.sex) &&
      (filters.vaccinated === "All" || (filters.vaccinated === "Yes") === pet.vaccinated) &&
      (filters.compatibility === "All" || pet.goodWith.includes(filters.compatibility)) &&
      (filters.personality === "All" || pet.traits.includes(filters.personality)) &&
      (!filters.special || Boolean(pet.specialNeeds)) &&
      (!filters.urgent || pet.urgency === "Urgent") &&
      `${pet.name} ${pet.breed} ${pet.description} ${pet.traits.join(" ")} ${pet.goodWith.join(" ")}`.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "Name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Urgency") list = [...list].sort((a, b) => (a.urgency === "Urgent" ? -1 : b.urgency === "Urgent" ? 1 : 0));
    if (sort === "Youngest") list = [...list].sort((a, b) => ["Young", "Adult", "Senior"].indexOf(a.ageGroup) - ["Young", "Adult", "Senior"].indexOf(b.ageGroup));
    return list;
  }, [query, filters, sort, marketplacePets]);
  const activeCount = Object.values(filters).filter((value) => value !== "All" && value !== false).length + (query ? 1 : 0);
  const reset = () => { setQuery(""); setFilters(initialFilters); setSort("Featured"); setLimit(6); };
  const saveSearch = () => {
    const name = query.trim() || [filters.type, filters.location].filter((value) => value !== "All").join(" in ") || "My pet search";
    const next = [{ id: crypto.randomUUID(), name, query, filters, sort }, ...savedSearches].slice(0, 8);
    localStorage.setItem(savedSearchKey, JSON.stringify(next));
    setSavedSearches(next);
    notify("Search saved on this device.");
    void fetch("/api/saved-searches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, criteria: { query, filters, sort } }) }).then(async (response) => {
      if (!response.ok) return;
      const row = await response.json() as { id: string };
      setSavedSearches((current) => current.map((search, index) => index === 0 ? { ...search, id: row.id } : search));
      notify("Search synced to your FurU account.");
    });
  };
  const loadSearch = (search: SavedSearch) => { setQuery(search.query); setFilters(search.filters); setSort(search.sort); setLimit(6); };
  const removeSearch = (id: string) => {
    const next = savedSearches.filter((search) => search.id !== id);
    localStorage.setItem(savedSearchKey, JSON.stringify(next));
    setSavedSearches(next);
    if (/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id)) void fetch(`/api/saved-searches?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  };

  return (
    <main className="page browse-page"><div className="shell">
      <div className="page-title"><span className="eyebrow">Find your companion</span><h1>Good matches start with good stories.</h1><p>Search by personality, care needs, location, age, and home compatibility.</p></div>
      <section className="filter-surface" aria-label="Pet filters">
        <div className="filter-bar">
          <div className="search-wrap"><Search size={19} /><input className="input" aria-label="Search pets" placeholder="Name, breed, personality, or care need…" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(6); }} /></div>
          <Filter value={filters.type} label="Species" options={["All", "Dog", "Cat", "Rabbit"]} onChange={(value) => setFilter("type", value)} />
          <Filter value={filters.breed} label="Breed" options={["All", ...new Set(marketplacePets.filter((pet) => filters.type === "All" || pet.type === filters.type).map((pet) => pet.breed))]} onChange={(value) => setFilter("breed", value)} />
          <Filter value={filters.location} label="Location" options={["All", ...new Set(marketplacePets.map((pet) => pet.location))]} onChange={(value) => setFilter("location", value)} />
        </div>
        <div className="filter-action-row"><button className="advanced-toggle" onClick={() => setAdvanced(!advanced)} aria-expanded={advanced}><SlidersHorizontal size={17} /> More compatibility filters {activeCount > 0 && <span>{activeCount}</span>}<ChevronDown size={16} /></button><button className="btn btn-ghost btn-small" onClick={saveSearch}><Bookmark size={15} /> Save this search</button></div>
        {advanced && <div className="advanced-filters">
          <Filter value={filters.age} label="Age" options={["All", "Young", "Adult", "Senior"]} onChange={(value) => setFilter("age", value)} />
          <Filter value={filters.size} label="Size" options={["All", "Small", "Medium", "Large"]} onChange={(value) => setFilter("size", value)} />
          <Filter value={filters.sex} label="Sex" options={["All", "Female", "Male"]} onChange={(value) => setFilter("sex", value)} />
          <Filter value={filters.vaccinated} label="Vaccinated" options={["All", "Yes", "No"]} onChange={(value) => setFilter("vaccinated", value)} />
          <Filter value={filters.compatibility} label="Home compatibility" options={["All", "Children", "Cats", "Dogs"]} onChange={(value) => setFilter("compatibility", value)} />
          <Filter value={filters.personality} label="Personality" options={["All", ...new Set(marketplacePets.flatMap((pet) => pet.traits))]} onChange={(value) => setFilter("personality", value)} />
          <label className="check-filter"><input type="checkbox" checked={filters.special} onChange={(event) => setFilter("special", event.target.checked)} /> Special care needs</label>
          <label className="check-filter"><input type="checkbox" checked={filters.urgent} onChange={(event) => setFilter("urgent", event.target.checked)} /> Needs a home soon</label>
        </div>}
      </section>
      {savedSearches.length > 0 && <section className="saved-search-row" aria-label="Saved searches"><b>Saved searches</b>{savedSearches.map((search) => <span key={search.id}><button onClick={() => loadSearch(search)}>{search.name}</button><button aria-label={`Delete ${search.name}`} onClick={() => removeSearch(search.id)}><X size={12} /></button></span>)}</section>}
      <div className="browse-top"><div><b>{filtered.length} pets</b> <span>match your preferences</span></div><div className="browse-controls">{activeCount > 0 && <button className="btn btn-ghost btn-small" onClick={reset}><X size={15} /> Clear filters</button>}<select className="input sort-select" aria-label="Sort pets" value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Urgency</option><option>Youngest</option><option>Name</option></select></div></div>
      <div className="chips" aria-live="polite">{Object.entries(filters).filter(([, value]) => value !== "All" && value !== false).map(([key, value]) => <button className="chip chip-button" key={key} onClick={() => setFilter(key as keyof Filters, typeof value === "boolean" ? false : "All")}>{String(value === true ? key : value)} <X size={12} /></button>)}</div>
      <div className="cards">{filtered.length ? filtered.slice(0, limit).map((pet) => <PetCard key={pet.id} pet={pet} />) : <div className="empty"><SlidersHorizontal size={38} /><h2>No pets match yet.</h2><p>Try widening your search or clearing a filter.</p><button className="btn btn-primary" onClick={reset}>Clear all filters</button></div>}</div>
      {filtered.length > limit && <div className="load-more"><button className="btn btn-dark" onClick={() => setLimit((current) => current + 6)}>Show more gentle faces</button><p>{filtered.length - limit} more pets to meet</p></div>}
    </div></main>
  );
}

function Filter({ value, label, options, onChange }: { value: string; label: string; options: Iterable<string>; onChange: (value: string) => void }) {
  return <select className="input" aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}><option value="All">{label}</option>{[...options].filter((option) => option !== "All").map((option) => <option key={option} value={option}>{option}</option>)}</select>;
}
