import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X } from "lucide-react";
import { LOCATIONS, LocationOption } from "@/data/locations";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationFilter: (location: LocationOption | null) => void;
  selectedLocation: LocationOption | null;
}

const SearchBar = ({ onSearch, onLocationFilter, selectedLocation }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [showLocations, setShowLocations] = useState(false);
  const [locSearch, setLocSearch] = useState("");
  const locRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocations(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = LOCATIONS.filter((l) =>
    `${l.label} ${l.country}`.toLowerCase().includes(locSearch.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, LocationOption[]>>((acc, l) => {
    if (!acc[l.country]) acc[l.country] = [];
    acc[l.country].push(l);
    return acc;
  }, {});

  return (
    <div className="px-4 pb-4 space-y-2">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onSearch(e.target.value); }}
          placeholder="Search posts, people..."
          className="w-full rounded-xl border border-input bg-card pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Location filter */}
      <div className="relative" ref={locRef}>
        <button
          onClick={() => setShowLocations(!showLocations)}
          className="flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MapPin className="h-3.5 w-3.5" />
          {selectedLocation ? (
            <span className="text-foreground font-medium">{selectedLocation.label}, {selectedLocation.country}</span>
          ) : (
            <span>Filter by location</span>
          )}
        </button>

        {selectedLocation && (
          <button
            onClick={() => onLocationFilter(null)}
            className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
          >
            <X className="h-2.5 w-2.5" />
            Clear
          </button>
        )}

        {showLocations && (
          <div className="absolute top-full left-0 mt-1 z-50 w-72 max-h-64 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
            <div className="sticky top-0 bg-card p-2 border-b border-border">
              <input
                value={locSearch}
                onChange={(e) => setLocSearch(e.target.value)}
                placeholder="Search locations..."
                className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
            </div>
            {Object.entries(grouped).map(([country, locs]) => (
              <div key={country}>
                <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{country}</p>
                {locs.map((loc) => (
                  <button
                    key={`${loc.label}-${loc.country}`}
                    onClick={() => { onLocationFilter(loc); setShowLocations(false); setLocSearch(""); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <span>{loc.label}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{loc.type}</span>
                  </button>
                ))}
              </div>
            ))}
            {Object.keys(grouped).length === 0 && (
              <p className="p-3 text-xs text-muted-foreground text-center">No locations found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
