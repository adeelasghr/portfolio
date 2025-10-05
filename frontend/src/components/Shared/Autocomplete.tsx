import { useState, useEffect } from "react";
import { getAllCode } from "../../api/bookingApi";
import { LookUp } from "../../interfaces/Shared";

interface AutocompleteProps {
  onSelect: (code: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [codes, setCodes] = useState<LookUp[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setCodes([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchMatchingCodes(query);
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  const fetchMatchingCodes = async (searchText: string) => {
    try {
      setLoading(true);
        const response = await getAllCode(searchText);
        console.log(response);
        setCodes(response as LookUp[]);
    } catch (error) {
      console.error("Failed to fetch codes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (code: string) => {
    setSelected(code);
    setQuery(code);
    setCodes([]);
      onSelect(code);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected("");
        }}
        placeholder="Enter booking number"
        className="w-full border border-gray-300 p-2 rounded"
      />

      {loading && <p className="absolute right-2 top-2 text-sm text-gray-400">Loading...</p>}

      {codes.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-200 shadow-lg rounded mt-1 max-h-48 overflow-auto z-10">
          {codes.map((code) => (
            <li
              key={code.id}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleSelect(code.name)}
            >
              {code.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
