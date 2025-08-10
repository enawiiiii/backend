import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Trash2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ColorSection from "@/components/color-section";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { insertDressSchema, type Dress, type InsertDress, type ColorAndSize } from "@shared/schema";

interface DressFormProps {
  dress?: Dress | null;
  onClose: () => void;
}

export default function DressForm({ dress, onClose }: DressFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const form = useForm<InsertDress>({
    resolver: zodResolver(insertDressSchema),
    defaultValues: dress ? {
      modelNumber: dress.modelNumber,
      specifications: dress.specifications,
      companyName: dress.companyName,
      pieceType: dress.pieceType,
      imageUrl: dress.imageUrl || "",
      colorsAndSizes: dress.colorsAndSizes || []
    } : {
      modelNumber: "",
      specifications: "",
      companyName: "",
      pieceType: "",
      imageUrl: "",
      colorsAndSizes: []
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: InsertDress) => {
      if (dress?.id) {
        return await apiRequest("PUT", `/api/dresses/${dress.id}`, data);
      } else {
        return await apiRequest("POST", "/api/dresses", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "نجح الحفظ",
        description: dress ? "تم تحديث الفستان بنجاح" : "تم إضافة الفستان بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dresses"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في الحفظ",
        description: error.message || "حدث خطأ أثناء حفظ البيانات",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!dress?.id) return;
      return await apiRequest("DELETE", `/api/dresses/${dress.id}`);
    },
    onSuccess: () => {
      toast({
        title: "تم الحذف",
        description: "تم حذف الفستان بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dresses"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في الحذف",
        description: error.message || "حدث خطأ أثناء حذف الفستان",
      });
    },
  });

  const onSubmit = (data: InsertDress) => {
    saveMutation.mutate(data);
  };

  const handleReset = () => {
    setConfirmDialog({
      open: true,
      title: "إعادة تعيين النموذج",
      message: "هل أنت متأكد من إعادة تعيين جميع البيانات؟ ستفقد جميع التغييرات غير المحفوظة.",
      onConfirm: () => {
        form.reset();
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const handleDelete = () => {
    setConfirmDialog({
      open: true,
      title: "حذف الفستان",
      message: "هل أنت متأكد من حذف هذا الفستان؟ لا يمكن التراجع عن هذا الإجراء.",
      onConfirm: () => {
        deleteMutation.mutate();
        setConfirmDialog({ ...confirmDialog, open: false });
      },
    });
  };

  const addColor = () => {
    const currentColors = form.getValues("colorsAndSizes");
    const newColor: ColorAndSize = {
      id: Date.now().toString(),
      name: "",
      sizes: [{ id: Date.now().toString(), value: "" }]
    };
    form.setValue("colorsAndSizes", [...currentColors, newColor]);
  };

  const removeColor = (colorId: string) => {
    const currentColors = form.getValues("colorsAndSizes");
    form.setValue("colorsAndSizes", currentColors.filter(c => c.id !== colorId));
  };

  const updateColor = (colorId: string, updatedColor: ColorAndSize) => {
    const currentColors = form.getValues("colorsAndSizes");
    form.setValue("colorsAndSizes", currentColors.map(c => c.id === colorId ? updatedColor : c));
  };

  const imageUrl = form.watch("imageUrl");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                العودة
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">
                {dress ? "تعديل فستان" : "إضافة فستان جديد"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto px-4 py-6">
        {/* Dress Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-l from-gold-50 to-pink-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">تفاصيل الفستان</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">رقم الموديل</Label>
                <Input
                  {...form.register("modelNumber")}
                  placeholder="أدخل رقم الموديل"
                  className="rtl-input focus:ring-gold focus:border-gold"
                />
                {form.formState.errors.modelNumber && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.modelNumber.message}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">اسم الشركة</Label>
                <Input
                  {...form.register("companyName")}
                  placeholder="اسم الشركة المصنعة"
                  className="rtl-input focus:ring-gold focus:border-gold"
                />
                {form.formState.errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.companyName.message}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">نوع القطعة</Label>
                <Input
                  {...form.register("pieceType")}
                  placeholder="مثال: فستان، فستان سهرة، فستان كاجوال"
                  className="rtl-input focus:ring-gold focus:border-gold"
                />
                {form.formState.errors.pieceType && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.pieceType.message}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">رابط صورة الفستان (اختياري)</Label>
                <Input
                  {...form.register("imageUrl")}
                  placeholder="https://example.com/dress-image.jpg"
                  className="rtl-input focus:ring-gold focus:border-gold"
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.imageUrl.message}</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <Label className="text-sm font-medium text-gray-700 mb-2">مواصفات الموديل</Label>
              <Textarea
                {...form.register("specifications")}
                placeholder="اكتب تفاصيل ومواصفات الفستان هنا..."
                rows={4}
                className="rtl-input focus:ring-gold focus:border-gold resize-none"
              />
              {form.formState.errors.specifications && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.specifications.message}</p>
              )}
            </div>

            {/* Image Preview Section */}
            {imageUrl && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-3">معاينة الصورة</h3>
                <img
                  src={imageUrl}
                  alt="معاينة الفستان"
                  className="w-48 h-72 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Colors and Sizes Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-l from-light-pink to-gold-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">الألوان والمقاسات</h2>
            <Button
              type="button"
              onClick={addColor}
              className="bg-gold hover:bg-gold/90 text-white text-sm"
            >
              إضافة لون
            </Button>
          </div>

          <div className="p-6">
            {form.formState.errors.colorsAndSizes && (
              <p className="text-red-500 text-sm mb-4">{form.formState.errors.colorsAndSizes.message}</p>
            )}
            
            <div className="space-y-4">
              {form.watch("colorsAndSizes").map((color, index) => (
                <ColorSection
                  key={color.id}
                  color={color}
                  onUpdate={(updatedColor) => updateColor(color.id, updatedColor)}
                  onRemove={() => removeColor(color.id)}
                />
              ))}
              
              {form.watch("colorsAndSizes").length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لم يتم إضافة أي ألوان بعد
                  <br />
                  <Button
                    type="button"
                    onClick={addColor}
                    className="mt-2 bg-gold hover:bg-gold/90 text-white"
                  >
                    إضافة أول لون
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-gold hover:bg-gold/90 text-white px-8 py-3 font-medium"
          >
            {saveMutation.isPending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 ml-2" />
            )}
            حفظ البيانات
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            className="px-8 py-3 font-medium"
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          
          {dress && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-8 py-3 font-medium"
            >
              {deleteMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Trash2 className="w-4 h-4 ml-2" />
              )}
              حذف الفستان
            </Button>
          )}
        </div>
      </form>

      <ConfirmationDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      />
    </div>
  );
}
