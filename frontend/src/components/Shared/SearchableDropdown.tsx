import React, { useEffect, useState } from "react";
import { GetAllVehicleNames } from "../../api/vehicleApi";
import { LookUp } from "../../interfaces/Shared";


interface DropdownProps {
  onSelect: (id: number) => void; // parent will receive the ID
}

const SearchableDropdown: React.FC<DropdownProps> = ({ onSelect }) => {
    const [options, setOptions] = useState<LookUp[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

    // Fetching Contract Data
  useEffect(() => {
    const loadContract = async () => {
        const data = await GetAllVehicleNames();
        setOptions(data as LookUp[]);
    };
    loadContract();
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(query.toLowerCase())
  );

 const handleSelect = (option: LookUp) => {
    setQuery(option.name);
    setIsOpen(false);
    onSelect(option.id);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Select a vehicle..."
        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
              >
                {option.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;