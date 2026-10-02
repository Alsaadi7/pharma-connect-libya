import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { Pill } from "@/components/admin/ui";
import { seedMedications, useCollection, type AdminMedication } from "@/lib/adminData";

export const Route = createFileRoute("/admin/medications")({ component: MedsPage });

const t = (key: keyof AdminMedication & string, label: string, type?: "textarea") => ({ key, label, ...(type ? { type } : {}) });

function MedsPage() {
  const api = useCollection<AdminMedication>("medications:v1", seedMedications);
  return (
    <CrudPage<AdminMedication>
      title="قاعدة الأدوية"
      api={api}
      exportName="medications"
      labelOf={(r) => r.generic}
      searchOf={(r) => `${r.generic} ${r.brand} ${r.ingredient} ${r.therapeuticClass}`}
      empty={() => ({
        brand: "", generic: "", ingredient: "", therapeuticClass: "", pharmClass: "", form: "", strength: "", route: "",
        indications: "", contraindications: "", sideEffects: "", seriousSideEffects: "", interactions: "", warnings: "",
        storage: "", pregnancy: "", counseling: "", notes: "", reference: "", category: "", image: "", active: true,
      })}
      fields={[
        t("generic", "الاسم العلمي"), t("brand", "الأسماء التجارية"), t("ingredient", "المادة الفعالة"),
        t("therapeuticClass", "الفئة العلاجية"), t("pharmClass", "الفئة الدوائية"), t("category", "التصنيف"),
        t("form", "الشكل الصيدلاني"), t("strength", "التركيز"), t("route", "طريقة الإعطاء"), t("pregnancy", "الحمل"),
        t("storage", "التخزين"), t("image", "رابط الصورة"),
        t("indications", "دواعي الاستعمال", "textarea"), t("contraindications", "موانع الاستعمال", "textarea"),
        t("sideEffects", "الأعراض الجانبية", "textarea"), t("seriousSideEffects", "أعراض خطيرة", "textarea"),
        t("interactions", "التداخلات", "textarea"), t("warnings", "التحذيرات", "textarea"),
        t("counseling", "إرشادات للمريض", "textarea"), t("notes", "ملاحظات", "textarea"), t("reference", "المرجع"),
        { key: "active", label: "مفعّل", type: "switch" },
      ]}
      columns={[
        { key: "g", label: "الدواء", render: (r) => <b className="latin">{r.generic}</b>, sort: (r) => r.generic },
        { key: "b", label: "تجاري", render: (r) => <span className="latin">{r.brand}</span> },
        { key: "c", label: "الفئة", render: (r) => r.therapeuticClass },
        { key: "a", label: "الحالة", render: (r) => <Pill tone={r.active ? "ok" : "muted"}>{r.active ? "مفعّل" : "معطّل"}</Pill> },
      ]}
    />
  );
}
