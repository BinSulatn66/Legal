import React, { useState } from "react";
import { BookOpen, Search, Scale, ShieldAlert, CheckCircle, ExternalLink, Hash } from "lucide-react";
import { motion } from "motion/react";

interface LawDetail {
  id: string;
  name: string;
  issuedBy: string;
  number: string;
  date: string;
  description: string;
  chaptersCount: number;
  keyPrinciples: string[];
  status: "سارٍ" | "معدل" | "مستبدل";
}

const SAUDI_LAWS_DB: LawDetail[] = [
  {
    id: "civil_transactions",
    name: "نظام المعاملات المدنية",
    issuedBy: "مرسوم ملكي رقم (م/191)",
    number: "م/191",
    date: "1444/11/29 هـ",
    description: "النظام الأساسي الحاكم لجميع الالتزامات والعقود والحقوق العينية في المملكة العربية السعودية، وهو يمثل نقلة تاريخية كبرى في تقنين أحكام الفقه الإسلامي والقانون المدني.",
    chaptersCount: 721,
    keyPrinciples: [
      "مبدأ العقد شريعة المتعاقدين وحرية الشروط ما لم تخالف النظام العام.",
      "تأصيل المسؤولية التقصيرية والتعويض الشامل عن الضرر.",
      "تنظيم عقود البيع، المقاولة، الشركة، الغرر، والإيجار بالكامل.",
      "تحديد القواعد الفقهية الـ 41 الحاكمة للنظام في خاتمته."
    ],
    status: "سارٍ"
  },
  {
    id: "evidence",
    name: "نظام الإثبات",
    issuedBy: "مرسوم ملكي رقم (م/43)",
    number: "م/43",
    date: "1443/05/26 هـ",
    description: "ينظم طرق الإثبات في المسائل المدنية والتجارية للتيسير على القضاء وسرعة الفصل بالاستناد إلى الوسائل الرقمية والخبرات والشهادة والكتابة والمقاطيع الموثقة.",
    chaptersCount: 129,
    keyPrinciples: [
      "حجية الكتابة والمستندات الإلكترونية الرسمية وغير الرسمية.",
      "تحديد عبء الإثبات على المدعي وحق توجيه اليمين الحاسمة.",
      "تنظيم أطر شهادة الشهود وشروط مقبوليّتها.",
      "تنظيم إجراءات المعاينة والاستعانة بالخبراء والتقارير المكتوبة."
    ],
    status: "سارٍ"
  },
  {
    id: "commercial_courts",
    name: "نظام المحاكم التجارية",
    issuedBy: "مرسوم ملكي رقم (م/93)",
    number: "م/93",
    date: "1441/08/15 هـ",
    description: "يختص بتنظيم المنازعات التجارية بين التجار وتثبيت مبدأ الإعذار وأصول المرافعات السريعة، وتوثيق السوابق والغرامات المالية للحد من الدعاوى الكيدية.",
    chaptersCount: 96,
    keyPrinciples: [
      "وجوب إخطار الخصم كتابة بطلب الوفاء قبل 15 يوماً من رفع الدعوى.",
      "إتاحة اللجوء للوساطة والتحكيم والتسوية بمدة نظامية محكمة.",
      "صلاحية القاضي في فرض تكاليف التقاضي على الطرف المماطل أو الخاسر.",
      "حصر تمثيل الشركات والطلبات الكبرى بوجود محامٍ مرخص."
    ],
    status: "سارٍ"
  },
  {
    id: "companies",
    name: "نظام الشركات الجديد",
    issuedBy: "مرسوم ملكي رقم (م/132)",
    number: "م/132",
    date: "1443/12/01 هـ",
    description: "يهدف إلى تيسير الإجراءات وتحفيز ريادة الأعمال وجلب الاستثمارات الأجنبية من خلال إطلاق تنظيمات مرنة لشركات المساهمة المبسطة والمسؤولية المحدودة.",
    chaptersCount: 282,
    keyPrinciples: [
      "مفهوم الشركة ذات المسار الواحد والمسؤولية المحدودة للمساهم الواحد.",
      "تفويض الشركاء لوضع شروط استثنائية وبنود عدم منافسة مرنة.",
      "تمكين الشريك من التخارج العادل وفق معادلة تقييم تجارية معتمدة.",
      "حوكمة الجمعيات العمومية والتصويت الإلكتروني وحماية حقوق الأقلية."
    ],
    status: "سارٍ"
  },
  {
    id: "civil_procedure",
    name: "نظام المرافعات الشرعية",
    issuedBy: "مرسوم ملكي رقم (م/1)",
    number: "م/1",
    date: "1435/01/22 هـ",
    description: "يحدد القواعد الإجرائية والتنظيمية لترتيب الجلسات القضائية والتبليغات، وتعيين الاختصاص المكاني والنوعي وتفاصيل الاعتراض على الأحكام بالحصول على الاستئناف.",
    chaptersCount: 242,
    keyPrinciples: [
      "تحديد اختصاصات المحاكم العامة ومحاكم الأحوال الشخصية والعمالية.",
      "تنظيم مدد الحضور والغياب وشروط رد القضاة.",
      "تنظيم صحف الإدخال والطلبات العارضة والتدخل.",
      "شروط وضوابط تقديم لوائح الاستئناف والتماسات إعادة النظر."
    ],
    status: "سارٍ"
  },
  {
    id: "labor",
    name: "نظام العمل السعودي",
    issuedBy: "مرسوم ملكي رقم (م/51)",
    number: "م/51",
    date: "1426/08/23 هـ (معدل حديثاً)",
    description: "يحكم العلاقة التعاقدية بين أصحاب العمل والعاملين في القطاع الخاص لضمان التوازن وحماية الحقوق مع تنظيم مستحقات مكافأة نهاية الخدمة ولجان تسوية الخلافات العمالية.",
    chaptersCount: 245,
    keyPrinciples: [
      "شروط وضوابط فترة التجربة وحاالت فسخ العقد التعسفي المادة 77.",
      "تأصيل حقوق الإجازات، ساعات العمل القصوى، وتدريب السعوديين.",
      "معادلات احتساب مكافأة نهاية الخدمة بدقة متقدمة.",
      "إجراءات التسوية الودية كمتطلب إلزامي قبل المثول للمحاكم العمالية."
    ],
    status: "سارٍ"
  }
];

export function SaudiLawsReference() {
  const [search, setSearch] = useState("");
  const [selectedLaw, setSelectedLaw] = useState<LawDetail | null>(SAUDI_LAWS_DB[0]);

  const filteredLaws = SAUDI_LAWS_DB.filter(
    (law) =>
      law.name.toLowerCase().includes(search.toLowerCase()) ||
      law.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="saudi_laws_reference_section" className="bg-[#0F0F0F] rounded-2xl border border-[#262626] shadow-xl p-6 overflow-hidden text-right">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[#262626] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-serif">
            <BookOpen className="h-6 w-6 text-[#C5A059]" />
            مرجع الأنظمة واللوائح السعودية الحديثة
          </h2>
          <p className="text-sm text-[#888] mt-1">
            دليل تعريفي تفاعلي لأبرز القوانين والمراسيم الملكية السارية في المملكة العربية السعودية المربوطة افتراضياً بهيئة الخبراء.
          </p>
        </div>
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="ابحث عن نظام أو مادة قانونية..."
            className="w-full text-sm bg-[#1A1A1A] border border-[#333] rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-[#C5A059] focus:bg-[#222] transition-all text-right text-white placeholder-[#555]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Laws */}
        <div className="lg:col-span-1 flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredLaws.length > 0 ? (
            filteredLaws.map((law) => (
              <button
                key={law.id}
                onClick={() => setSelectedLaw(law)}
                className={`w-full text-right p-4 rounded-xl border transition-all flex flex-col gap-1 ${
                  selectedLaw?.id === law.id
                    ? "border-[#C5A059] bg-[#C5A059]/10 shadow-none ring-1 ring-[#C5A059]"
                    : "border-[#222] bg-[#111] hover:border-[#333] hover:bg-[#151515]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-white text-sm md:text-base">{law.name}</span>
                  <span className="text-[10px] bg-emerald-950/50 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-900">
                    {law.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#888] mt-1">
                  <Hash className="h-3 w-3 text-[#C5A059]" />
                  <span>رقم المرسوم: {law.number}</span>
                </div>
                <p className="text-xs text-[#666] mt-1 line-clamp-2 text-right">
                  {law.description}
                </p>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-[#555] text-sm">
              لا توجد نتائج مطابقة لبحثك.
            </div>
          )}
        </div>

        {/* Selected Law Details */}
        <div className="lg:col-span-2 bg-[#141414] rounded-2xl border border-[#222] p-6 flex flex-col justify-between">
          {selectedLaw ? (
            <motion.div
              key={selectedLaw.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 text-right"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[#C5A059]" />
                    <h3 className="text-lg font-bold text-white font-serif">{selectedLaw.name}</h3>
                  </div>
                  <span className="text-xs text-[#888] mt-1 block">
                    الجهة المُصدِرة: {selectedLaw.issuedBy} | تاريخ الإصدار: {selectedLaw.date}
                  </span>
                </div>
                <div className="bg-[#1A1A1A] text-[#C5A059] text-xs px-3 py-1.5 rounded-lg border border-[#333] font-mono">
                  عدد المواد الأساسية: {selectedLaw.chaptersCount} مادة
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#A0A0A0] mb-1 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-[#C5A059]" />
                  نبذة تعريفية:
                </h4>
                <p className="text-sm text-[#CCC] leading-relaxed bg-[#0F0F0F] rounded-lg p-3 border border-[#222] font-serif">
                  {selectedLaw.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#A0A0A0] mb-2 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  أهم المبادئ والأركان الفقهية والنظامية:
                </h4>
                <ul className="text-xs text-[#AAA] space-y-2 pr-3 mt-1 leading-relaxed">
                  {selectedLaw.keyPrinciples.map((principle, index) => (
                    <li key={index} className="list-disc list-inside hover:text-white transition-colors">
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#C5A059]/5 rounded-xl p-4 border border-[#C5A059]/20 text-xs flex gap-3 text-[#C5A059] mt-3">
                <ShieldAlert className="h-5 w-5 text-[#C5A059] shrink-0" />
                <div>
                  <span className="font-bold block text-white text-sm">إشعار حماية السيادة القضائية:</span>
                  <p className="mt-1 leading-5 text-[#AAA]">
                    هذا المحتوى للاطلاع والبحث الفوري. تم ربط نظام عدالة الذكي بقواعد بيانات الأحكام لضمان سريان نصوص المواد وملاءمتها للمطابقة اللحظية أثناء معالجة القضايا.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <a
                  href="https://laws.boe.gov.sa"
                  target="_blank"
                  rel="noreferrer referrer"
                  className="text-xs bg-[#1A1A1A] text-[#C5A059] hover:bg-[#222] px-4 py-2 rounded-lg border border-[#333] flex items-center gap-1.5 transition-all"
                >
                  الاطلاع عبر بوابة هيئة الخبراء
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#555] py-12">
              <Scale className="h-12 w-12 text-[#222] mb-3" />
              <span>يرجى اختيار أحد الأنظمة المطروحة لعرض تفاصيله</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
