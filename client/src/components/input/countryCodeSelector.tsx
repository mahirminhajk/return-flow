import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const countryCodes = [
  { code: "91", label: "🇮🇳" },
  { code: "971", label: "🇦🇪" },
  { code: "966", label: "🇸🇦" },
  { code: "974", label: "🇶🇦" },
  { code: "968", label: "🇴🇲" },
  { code: "965", label: "🇰🇼" },
  { code: "973", label: "🇧🇭" },
];

interface CountryCodeSelectorProps {
  selectCountryCode: string;
  setSelectCountryCode: (code: string) => void;
}

function CountryCodeSelector({
  selectCountryCode,
  setSelectCountryCode,
}: CountryCodeSelectorProps) {
  return (
    <div>
      <Select
        onValueChange={(value) => setSelectCountryCode(value)}
        defaultValue={selectCountryCode}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map(({ code, label }) => (
            <SelectItem key={code} value={code}>
              {`${label} (+${code})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CountryCodeSelector;
