import { Input } from "@/components/ui/input";
import { searchCities } from "@/lib/graphql";
import type { City } from "@/types/weather";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  onSelect: (city: City) => void;
  selectedCity: City | null;
}

export function SearchBar({ onSelect, selectedCity }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const cities = await searchCities(query.trim());
        setResults(cities.slice(0, 8));
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function handleSelect(city: City) {
    setQuery("");
    setOpen(false);
    onSelect(city);
  }

  function clearSelection() {
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelect(null!);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5 pointer-events-none" />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 animate-spin" />
        )}
        {selectedCity && !loading && (
          <button
            onClick={clearSelection}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <Input
          id="city-search"
          placeholder={
            selectedCity
              ? `${selectedCity.name}, ${selectedCity.country}`
              : "Search for a city..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="
            pl-12 pr-12 h-14 text-base
            bg-white/8 border-white/15 text-white placeholder:text-white/35
            rounded-2xl backdrop-blur-sm
            focus-visible:ring-sky-500/50 focus-visible:border-sky-400/50
            transition-all duration-200
          "
        />
      </div>

      {open && results.length > 0 && (
        <div
          className="
            absolute top-full left-0 right-0 mt-2 z-50
            bg-slate-900/95 backdrop-blur-xl border border-white/10
            rounded-2xl overflow-hidden shadow-2xl shadow-black/40
          "
        >
          {results.map((city, i) => (
            <button
              key={`${city.id}-${i}`}
              onClick={() => handleSelect(city)}
              className="
                w-full flex items-center gap-3 px-4 py-3.5
                hover:bg-white/8 transition-colors text-left
                border-b border-white/5 last:border-0
              "
            >
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="text-white font-medium">{city.name}</span>
                <span className="text-white/50 text-sm ml-2">
                  {[city.state, city.country].filter(Boolean).join(", ")}
                </span>
              </div>
              <span className="ml-auto text-white/30 text-xs font-mono">
                {city.countryCode}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
