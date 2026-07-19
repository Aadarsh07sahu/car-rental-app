import { useState, useRef, useEffect } from "react";

function AutocompleteInput({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        required
        className="
          w-full
          rounded-xl
          border border-gray-200
          bg-gray-50
          px-4
          py-2.5
          text-sm
          text-gray-700
          placeholder:text-gray-400
          outline-none
          transition-all
          duration-200
          focus:border-orange-400
          focus:bg-white
          focus:ring-2
          focus:ring-orange-400
        "
      />

      {isOpen && filteredOptions.length > 0 && (
        <div
          className="
            absolute
            left-0
            right-0
            z-50
            mt-2
            overflow-hidden
            rounded-xl
            border border-gray-100
            bg-white
            shadow-xl
            max-h-56
            overflow-y-auto
          "
        >
          {filteredOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`
                w-full
                px-4
                py-3
                text-left
                text-sm
                transition-colors
                duration-150
                ${
                  value === opt
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutocompleteInput;