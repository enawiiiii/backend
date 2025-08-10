import { BarChart3, Package, Palette, Ruler } from "lucide-react";
import type { Dress } from "@shared/schema";

interface StatsDashboardProps {
  dresses: Dress[];
}

export default function StatsDashboard({ dresses }: StatsDashboardProps) {
  const totalDresses = dresses.length;
  const totalColors = dresses.reduce((acc, dress) => acc + (dress.colorsAndSizes?.length || 0), 0);
  const totalSizes = dresses.reduce((acc, dress) => 
    acc + (dress.colorsAndSizes?.reduce((colorAcc, color) => colorAcc + color.sizes.length, 0) || 0), 0
  );
  const uniqueCompanies = new Set(dresses.map(dress => dress.companyName)).size;

  const stats = [
    {
      title: "إجمالي الفساتين",
      value: totalDresses,
      icon: Package,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "إجمالي الألوان",
      value: totalColors,
      icon: Palette,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "إجمالي المقاسات",
      value: totalSizes,
      icon: Ruler,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "عدد الشركات",
      value: uniqueCompanies,
      icon: BarChart3,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-200`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}