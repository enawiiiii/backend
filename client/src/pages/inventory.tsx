import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import DressForm from "@/components/dress-form";
import SearchFilter from "@/components/search-filter";
import type { Dress } from "@shared/schema";

export default function InventoryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDress, setEditingDress] = useState<Dress | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");

  const { data: dresses = [], isLoading, refetch } = useQuery({
    queryKey: searchQuery ? ["/api/dresses/search", { q: searchQuery }] : ["/api/dresses"],
  });

  const handleNewDress = () => {
    setEditingDress(null);
    setIsFormOpen(true);
  };

  const handleEditDress = (dress: Dress) => {
    setEditingDress(dress);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDress(null);
    refetch();
  };

  const filteredAndSortedDresses = dresses
    .filter(dress => {
      if (!filterBy) return true;
      const lowerFilter = filterBy.toLowerCase();
      return dress.colorsAndSizes.some(color => 
        color.name.toLowerCase().includes(lowerFilter) ||
        color.sizes.some(size => size.value.toLowerCase().includes(lowerFilter))
      );
    })
    .sort((a, b) => {
      if (sortBy === "رقم الموديل") {
        return a.modelNumber.localeCompare(b.modelNumber);
      } else if (sortBy === "تاريخ الإضافة") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      return 0;
    });

  if (isFormOpen) {
    return <DressForm dress={editingDress} onClose={handleCloseForm} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">لاروزا - إدارة مخزون الفساتين</h1>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleNewDress}
                className="bg-gold hover:bg-gold/90 text-white"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة فستان جديد
              </Button>
              <div className="w-8 h-8 bg-light-pink rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
        />

        {/* Dresses List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
              <p className="text-gray-600 mt-2">جاري التحميل...</p>
            </div>
          ) : filteredAndSortedDresses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-lg">لا توجد فساتين مسجلة</p>
              <Button 
                onClick={handleNewDress}
                className="mt-4 bg-gold hover:bg-gold/90 text-white"
              >
                إضافة أول فستان
              </Button>
            </div>
          ) : (
            filteredAndSortedDresses.map((dress) => (
              <div
                key={dress.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleEditDress(dress)}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{dress.modelNumber}</h3>
                    <p className="text-gray-600">{dress.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">نوع القطعة</p>
                    <p className="text-gray-800">{dress.pieceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الألوان المتوفرة</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dress.colorsAndSizes.slice(0, 3).map((color) => (
                        <span
                          key={color.id}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {color.name}
                        </span>
                      ))}
                      {dress.colorsAndSizes.length > 3 && (
                        <span className="text-gray-500 text-xs">+{dress.colorsAndSizes.length - 3}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">إجمالي المقاسات</p>
                    <p className="text-gold font-semibold">
                      {dress.colorsAndSizes.reduce((total, color) => total + color.sizes.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
