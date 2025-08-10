import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmationDialog from "@/components/confirmation-dialog";
import type { ColorAndSize } from "@shared/schema";

interface ColorSectionProps {
  color: ColorAndSize;
  onUpdate: (color: ColorAndSize) => void;
  onRemove: () => void;
}

export default function ColorSection({ color, onUpdate, onRemove }: ColorSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const addSize = () => {
    const newSize = { id: Date.now().toString(), value: "" };
    onUpdate({
      ...color,
      sizes: [...color.sizes, newSize]
    });
  };

  const removeSize = (sizeId: string) => {
    setConfirmDialog({
      open: true,
      title: "تأكيد حذف المقاس",
      message: "هل أنت متأكد من حذف هذا المقاس؟ لا يمكن التراجع عن هذا الإجراء.",
      onConfirm: () => {
        onUpdate({
          ...color,
          sizes: color.sizes.filter(s => s.id !== sizeId)
        });
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const updateSize = (sizeId: string, value: string) => {
    onUpdate({
      ...color,
      sizes: color.sizes.map(s => s.id === sizeId ? { ...s, value } : s)
    });
  };

  const updateColorName = (name: string) => {
    onUpdate({ ...color, name });
  };

  const handleRemoveColor = () => {
    setConfirmDialog({
      open: true,
      title: "تأكيد حذف اللون",
      message: "هل أنت متأكد من حذف هذا اللون وجميع مقاساته؟ لا يمكن التراجع عن هذا الإجراء.",
      onConfirm: () => {
        onRemove();
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const stockCount = color.sizes.filter(size => size.value.trim() !== "").length;

  return (
    <>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div
          className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-gray-300"></div>
            <span className="font-medium text-gray-800">
              {color.name || "لون جديد"}
            </span>
            <span className="text-sm text-gray-500">({color.sizes.length} مقاسات)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-gold text-white px-2 py-1 rounded">
              مخزون: {stockCount}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="p-4 bg-white">
            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-700 mb-2">اسم اللون</Label>
              <Input
                value={color.name}
                onChange={(e) => updateColorName(e.target.value)}
                placeholder="أدخل اسم اللون"
                className="rtl-input focus:ring-gold focus:border-gold"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">المقاسات المتوفرة</h4>
                <Button
                  type="button"
                  onClick={addSize}
                  className="bg-light-pink hover:bg-light-pink/80 text-gray-700 px-3 py-1 text-sm"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة مقاس
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {color.sizes.map((size) => (
                  <div key={size.id} className="relative">
                    <Input
                      value={size.value}
                      onChange={(e) => updateSize(size.id, e.target.value)}
                      placeholder="المقاس"
                      className="rtl-input focus:ring-gold focus:border-gold pr-8"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSize(size.id)}
                      className="absolute left-1 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700 p-1 h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {color.sizes.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  لم يتم إضافة أي مقاسات بعد
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveColor}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                <X className="w-4 h-4 ml-1" />
                حذف اللون
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </>
  );
}
