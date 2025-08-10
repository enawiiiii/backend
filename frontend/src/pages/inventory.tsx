import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, User, BarChart3, Package, TrendingUp, Globe, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import DressForm from "@/components/dress-form";
import SearchFilter from "@/components/search-filter";
import StatsDashboard from "@/components/ui/stats-dashboard";
import logoPath from "@assets/LR_1754863757279.jpg";
import type { Dress } from "@shared/schema";

export default function InventoryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDress, setEditingDress] = useState<Dress | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");

  const { data: dresses = [], isLoading, refetch } = useQuery({
    queryKey: searchQuery ? ["/api/dresses/search", searchQuery] : ["/api/dresses"],
    queryFn: async () => {
      if (searchQuery) {
        const response = await fetch(`/api/dresses/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error('Search failed');
        return response.json();
      } else {
        const response = await fetch('/api/dresses');
        if (!response.ok) throw new Error('Failed to fetch dresses');
        return response.json();
      }
    }
  }) as { data: Dress[], isLoading: boolean, refetch: () => void };

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
      return dress.colorsAndSizes?.some(color => 
        color.name.toLowerCase().includes(lowerFilter) ||
        color.sizes.some(size => size.value.toLowerCase().includes(lowerFilter))
      ) || false;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-gold backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={logoPath} 
                alt="شعار لاروزا" 
                className="w-12 h-12 object-contain rounded-lg bg-black/5 p-1"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gold to-amber-600 bg-clip-text text-transparent">
                  لاروزا
                </h1>
                <p className="text-sm text-gray-600">إدارة مخزون الفساتين</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleNewDress}
                className="bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة فستان جديد
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-light-pink to-pink-400 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics Dashboard */}
        <StatsDashboard dresses={dresses} />

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
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gold/50 transition-all duration-300 cursor-pointer group"
                onClick={() => handleEditDress(dress)}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="flex items-center gap-3">
                    {dress.imageUrl && (
                      <img
                        src={dress.imageUrl}
                        alt={`فستان ${dress.modelNumber}`}
                        className="w-12 h-16 object-cover rounded-lg border-2 border-gray-200 group-hover:border-gold/50 transition-colors"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-gold transition-colors">
                        {dress.modelNumber}
                      </h3>
                      <p className="text-gray-600 text-sm">{dress.companyName}</p>
                      <p className="text-gray-500 text-xs">{dress.pieceType}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">الأسعار</p>
                    <div className="space-y-1">
                      {dress.onlinePrice && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700">{dress.onlinePrice} ر.س</span>
                        </div>
                      )}
                      {dress.storePrice && (
                        <div className="flex items-center gap-1">
                          <Store className="w-3 h-3 text-green-500" />
                          <span className="text-sm font-medium text-green-700">{dress.storePrice} ر.س</span>
                        </div>
                      )}
                      {!dress.onlinePrice && !dress.storePrice && (
                        <span className="text-xs text-gray-400">غير محدد</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">الألوان المتوفرة</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dress.colorsAndSizes?.slice(0, 2).map((color) => (
                        <span
                          key={color.id}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs border border-gray-200"
                        >
                          {color.name}
                        </span>
                      ))}
                      {(dress.colorsAndSizes?.length || 0) > 2 && (
                        <span className="text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-full border">
                          +{(dress.colorsAndSizes?.length || 0) - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">الألوان</p>
                    <p className="text-lg font-bold text-purple-600">
                      {dress.colorsAndSizes?.length || 0}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">المقاسات</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-lg font-bold bg-gradient-to-r from-gold to-amber-600 bg-clip-text text-transparent">
                        {dress.colorsAndSizes?.reduce((total, color) => total + color.sizes.length, 0) || 0}
                      </p>
                      <Package className="w-4 h-4 text-gold" />
                    </div>
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
