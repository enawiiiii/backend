import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterBy: string;
  onFilterChange: (value: string) => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
}: SearchFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">البحث</Label>
          <Input
            type="text"
            placeholder="ابحث برقم الموديل أو اسم الشركة..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rtl-input focus:ring-gold focus:border-gold"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">ترتيب حسب</Label>
          <Input
            type="text"
            placeholder="رقم الموديل / تاريخ الإضافة"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rtl-input focus:ring-gold focus:border-gold"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2">فلترة حسب</Label>
          <Input
            type="text"
            placeholder="اللون أو المقاس"
            value={filterBy}
            onChange={(e) => onFilterChange(e.target.value)}
            className="rtl-input focus:ring-gold focus:border-gold"
          />
        </div>
      </div>
    </div>
  );
}
