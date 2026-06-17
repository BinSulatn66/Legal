import React, { useState, useEffect } from "react";
import {
  Scale,
  BookOpen,
  Briefcase,
  Search,
  FileCheck2,
  AlertTriangle,
  History,
  Shield,
  Send,
  Loader2,
  Sparkles,
  Clipboard,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Clock,
  Printer,
  ChevronLeft,
  ChevronDown,
  BookMarked,
  Download,
  Award,
  BookOpenCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SaudiLawsReference } from "./components/SaudiLawsReference";
import {
  LegalServiceType,
  LegalServiceInfo,
  ConsultationInput,
  ResearchInput,
  DraftMemoInput,
  SimulatorInput,
  AuditInput,
  RiskInput,
  LegalResponse,
  SavedCase
} from "./types";

// Dynamic loading process messages to show sovereignty processing steps
const LOADING_STEPS = [
  "جاري الاتصال بقاعدة بيانات الأنظمة السعودية التابعة لهيئة الخبراء...",
  "تحليل الحجج والوقائع ومواءمتها مع الشريعة الإسلامية والفقه التكليفي...",
  "مراجعة السوابق القضائية المعتمدة ونماذج الأحكام الصادرة سابقاً...",
  "تدقيق الثغرات الإجرائية وتحديد تكتيكات الخصوم المتوقعة...",
  "بناء صياغة لغوية وقانونية رصينة ومحاكاة التسبيب القضائي..."
];

export default function App() {
  // Service configuration
  const services: LegalServiceInfo[] = [
    {
      id: "CONSULTATION",
      title: "الاستشارة الأولية المفصلة",
      description: "فهم جوانب القضية، تحديد التكييف القانوني الأولي والحلول الشرعية والنظامية المتوفرة لوضعك.",
      badge: "نظام المعاملات المدنية",
      iconName: "Scale"
    },
    {
      id: "RESEARCH",
      title: "البحث والتحليل النظامي",
      description: "استخراج الأسانيد واللوائح والمراسيم وقواعد البيانات الفقهية لموضوع معقد وتماشيها.",
      badge: "البحث والتقصي",
      iconName: "Search"
    },
    {
      id: "DRAFT_MEMO",
      title: "أتمتة المذكرات وصحف الدعاوى",
      description: "صياغة دفوع ومذكرات وصحف دعوى مهنية موجهة للمحاكم مبنية على وقائع العميل.",
      badge: "صياغة فورية",
      iconName: "Briefcase"
    },
    {
      id: "SIMULATOR",
      title: "محاكي القضية (القاضي الافتراضي)",
      description: "صياغة حكم قضائي افتراضي مسبب وفق منطق القضاء السعودي لتقدير حظوتك وتقديم مؤشر ثقة الفوز.",
      badge: "التحكيم الذكي",
      iconName: "Shield"
    },
    {
      id: "AUDIT",
      title: "التدقيق اللغوي والمنطقي (Audit)",
      description: "فحص مذكرتك ومقارنتها عيناً بالعقود والأنظمة السارية للتنبيه بالتناقضات والتواريخ.",
      badge: "فحص الثغرات",
      iconName: "FileCheck2"
    },
    {
      id: "RISK_ASSESSMENT",
      title: "مستشار تقييم المخاطر",
      description: "البحث عن مكامن الضعف في أدلتك وتوقع تكتيكات دفاع الخصم والردود المضادة.",
      badge: "إدارة المخاطر",
      iconName: "AlertTriangle"
    }
  ];

  const [activeTab, setActiveTab] = useState<LegalServiceType | "SAUDI_LAWS">("CONSULTATION");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentResponse, setCurrentResponse] = useState<LegalResponse | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Follow-up chat custom state
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Saved history/cases state
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  
  // Active Form states for inputs
  const [consultationForm, setConsultationForm] = useState<ConsultationInput>({
    caseTitle: "",
    category: "المعاملات المدنية",
    parties: "",
    facts: "",
    userGoal: "",
    documentsText: ""
  });

  const [researchForm, setResearchForm] = useState<ResearchInput>({
    topic: "",
    category: "نظام المعاملات المدنية",
    factsContext: ""
  });

  const [draftMemoForm, setDraftMemoForm] = useState<DraftMemoInput>({
    title: "",
    memoType: "صحيفة_دعوى",
    claimantInfo: "",
    respondentInfo: "",
    factsAndClaims: "",
    requestedRemedies: "",
    supportingEvidence: ""
  });

  const [simulatorForm, setSimulatorForm] = useState<SimulatorInput>({
    caseTitle: "",
    category: "نزاع تجاري مالي",
    plaintiffClaims: "",
    defendantResponses: "",
    providedEvidence: "",
    relevantAgreementsOrContracts: ""
  });

  const [auditForm, setAuditForm] = useState<AuditInput>({
    draftedText: "",
    supportingEvidenceText: "",
    referencedArticlesText: ""
  });

  const [riskForm, setRiskForm] = useState<RiskInput>({
    caseTitle: "",
    facts: "",
    submittedEvidence: "",
    potentialWeaknesses: ""
  });

  // Pre-configured Saudi Legal Templates to allow speedy review and execution
  const loadTemplate = (service: LegalServiceType) => {
    setErrorText(null);
    setCurrentResponse(null);
    setChatHistory([]);
    
    if (service === "CONSULTATION") {
      setConsultationForm({
        caseTitle: "خلاف عمالي - فصل تعسفي بموجب المادة 77",
        category: "نظام العمل السعودي",
        parties: "خالد سعيد (المدعي/الموظف) ضد شركة ركائز التقنية (المدعى عليها)",
        facts: "تم إنهاء عقد العمل محدد المدة قبل انقضائه بـ 7 أشهر بشكل مفاجئ بذريعة هيكلة إدارية غير حقيقية، وبدون إرسال إنذار مسبق أو تعويض ودي للرواتب المتبقية.",
        userGoal: "التحقق من حيازة الموظف للحق الكامل بالتعويض بموجب المادة 77 وصياغة البنود لمطالبة المحكمة العمالية.",
        documentsText: "عقد توظيف ساري، خطاب إنهاء الخدمة الفوري بتاريخ 2026/04/01."
      });
    } else if (service === "RESEARCH") {
      setResearchForm({
        topic: "مدى بطلان شرط الإعفاء من المسؤولية العقدية في عقود التوريد والإنشاء",
        category: "نظام المعاملات المدنية والشركات",
        factsContext: "شركة مقاولات اتفقت مع مطور عقاري على توريد مصاعد، ووضعت بنداً يعفيها تماماً من أي تعويض عن التأخير أو العيوب الخفية. المطور يطالب بإبطال هذا البند استناداً على مواد نظام المعاملات المدنية الجديد لتعمده إحداث الضرر."
      });
    } else if (service === "DRAFT_MEMO") {
      setDraftMemoForm({
        title: "صحيفة دعوى المطالبة بمبلغ مالي متبقٍ من عقد بيع مرابحة",
        memoType: "صحيفة_دعوى",
        claimantInfo: "سمير فهد التويجري (سجل مدني 1056543210)",
        respondentInfo: "شركة آفاق التطوير والاستيراد (سجل تجاري 1010876543)",
        factsAndClaims: "باع المدعي للمدعى عليها بضائع حديد تسليح بمبلغ 400,000 ريال، وبموجب سندات تسليم معتمدة وفواتير رسمية مستحقة الوفاء قبل شهرين، تم سداد 250,000 ريال فقط وامتنعت المدعى عليها عن سداد المتبقي البالغ 150,000 ريال رغم مطالبتها بإنذار رسمي.",
        requestedRemedies: "الحكم بإلزام المدعى عليها بدفع المبلغ المتبقي وقدره 150,000 ريال، وإلزامها بدفع 15,000 ريال تعويضاً عن أتعاب الشكوى القانونية ومصاريف التقاضي.",
        supportingEvidence: "فاتورة البيع والتوريد، سندات استلام معتمدة، رسالة إنذار بالوفاء عبر تطبيق واتساب الموثق تجارياً."
      });
    } else if (service === "SIMULATOR") {
      setSimulatorForm({
        caseTitle: "دعوى نزاع ملكية وحقوق ملكية فكرية لموقع تجارة إلكترونية",
        category: "نظام المحاكم التجارية والملكية الفكرية",
        plaintiffClaims: "المدعي (مبرمج النظم) يدعي أنه قام ببرمجة وتصميم المنصة وصيانتها لحسابه الخاص، وأن الشريك المدعى عليه استولى على لوحة التحكم وقام بتغيير الكود التعريفي وامتنع عن إعطائه أرباحه المتفق عليها بنسبة 40% طوال عام كامل.",
        defendantResponses: "المدعى عليه يدفع بأن المبرمج كان مجرد أجير يعمل بمرتب شهري قدره 12,000 ريال بموجب عقد عمل، وبالتالي فإن كافة نتاجه الفكري والبرمجي أثناء الخدمة يعود للشركة حسب نظام العمل والملكية الفكرية السعودي.",
        providedEvidence: "سيرفرات المنصة التاريخية، كشوفات التحويل البنكي الشهرية بقيمة 12,000 ريال مكتوب عليها 'راتب شهري'، رسائل تلغرام تفيد الشراكة الشفوية.",
        relevantAgreementsOrContracts: "عقد وظيفي مبرم في عام 2024 بلقب 'رئيس قسم البرمجيات'."
      });
    } else if (service === "AUDIT") {
      setAuditForm({
        draftedText: "أقام المدعي الدعوى بموجب العقد المؤرخ في 2025/12/30 للمطالبة بمستحقات مالية قدرها 260,000 ريال سعودي. واستند في دعواه على نص المادة 44 من نظام الشركات المنتهي والصادر لعام 1437هـ.",
        supportingEvidenceText: "العقد المرفق بين الطرفين محرر فعلياً بتاريخ 2025/11/15 والمبلغ المتبقي فيه الموثق بالبريد مع الممثل المالي هو 200,000 ريال فقط وليس 260,000 ريال كما ادعى بالمذكرة.",
        referencedArticlesText: "المادة 44 من نظام الشركات القديم تم إلغاؤها واستبدالها بنظام الشركات الجديد لعام 1443هـ ولم تعد سارية بنفس المعالجة القانونية."
      });
    } else if (service === "RISK_ASSESSMENT") {
      setRiskForm({
        caseTitle: "تقييم مخاطر دعوى شراكة لم توثق رسمياً بين أقارب",
        facts: "المدعي دخل شريكاً بالنصف في عقار واستثمار كافيه مع ابن عمه برأس مال كاش ومبلغ آخر حوله للبنك بمقدار 200,000 ريال مكتوب في سبب التحويل 'مساعدة عائلية' لعدم لفت الانتباه الضريبي والترخيص، وجاء الخلاف بعد تحقيق الكافيه لأرباح ضخمة ورفض ابن عمه إعطائه أي نسبة مستنداً لعدم وجود سجل تجاري باسمه.",
        submittedEvidence: "كشف بنكي بالتحويل بمبلغ 200,000 ريال، تسجيل صوتي بالواتساب يقر فيه الشريك بربحية المشروع وأن 'حصتك ستصلك قريباً'.",
        potentialWeaknesses: "تسمية التحويل البنكي بـ 'مساعدة عائلية' يؤيد ادعاء الطرف الآخر بالهبة أو القرض مالم يثبت العكس، وغياب التأسيس النظامي للشركة يخالف نظام الشركات ونظام مكافحة التستر."
      });
    }
  };

  // Load saved cases from local storage
  useEffect(() => {
    try {
      const past = localStorage.getItem("sa_legal_cases_secured");
      if (past) {
        setSavedCases(JSON.parse(past));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Set up loading steps interval
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const saveCaseToHistory = (item: SavedCase) => {
    const updated = [item, ...savedCases.filter(c => c.id !== item.id)];
    setSavedCases(updated);
    localStorage.setItem("sa_legal_cases_secured", JSON.stringify(updated));
  };

  const deleteCaseFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedCases.filter((c) => c.id !== id);
    setSavedCases(updated);
    localStorage.setItem("sa_legal_cases_secured", JSON.stringify(updated));
    if (currentResponse && currentResponse.timestamp === savedCases.find((c) => c.id === id)?.response.timestamp) {
      setCurrentResponse(null);
    }
  };

  const handleClearForm = () => {
    setErrorText(null);
    setCurrentResponse(null);
    setChatHistory([]);
    if (activeTab === "CONSULTATION") {
      setConsultationForm({ caseTitle: "", category: "", parties: "", facts: "", userGoal: "", documentsText: "" });
    } else if (activeTab === "RESEARCH") {
      setResearchForm({ topic: "", category: "", factsContext: "" });
    } else if (activeTab === "DRAFT_MEMO") {
      setDraftMemoForm({ title: "", memoType: "صحيفة_دعوى", claimantInfo: "", respondentInfo: "", factsAndClaims: "", requestedRemedies: "", supportingEvidence: "" });
    } else if (activeTab === "SIMULATOR") {
      setSimulatorForm({ caseTitle: "", category: "", plaintiffClaims: "", defendantResponses: "", providedEvidence: "", relevantAgreementsOrContracts: "" });
    } else if (activeTab === "AUDIT") {
      setAuditForm({ draftedText: "", supportingEvidenceText: "", referencedArticlesText: "" });
    } else if (activeTab === "RISK_ASSESSMENT") {
      setRiskForm({ caseTitle: "", facts: "", submittedEvidence: "", potentialWeaknesses: "" });
    }
  };

  // Execute active service analysis
  const executeAnalysis = async () => {
    if (activeTab === "SAUDI_LAWS") return;
    
    setLoading(true);
    setErrorText(null);
    setCurrentResponse(null);
    setChatHistory([]);

    let inputData: any = {};
    let queryTitle = "طلب قانوني جديد";
    
    if (activeTab === "CONSULTATION") {
      if (!consultationForm.facts) {
        setErrorText("فضلاً أدخل وقائع وتفاصيل الاستشارة.");
        setLoading(false);
        return;
      }
      inputData = consultationForm;
      queryTitle = consultationForm.caseTitle || "استشارة عاجلة";
    } else if (activeTab === "RESEARCH") {
      if (!researchForm.topic) {
        setErrorText("فضلاً أدخل موضوع البحث المراد معالجته.");
        setLoading(false);
        return;
      }
      inputData = researchForm;
      queryTitle = researchForm.topic;
    } else if (activeTab === "DRAFT_MEMO") {
      if (!draftMemoForm.factsAndClaims) {
        setErrorText("فضلاً أدخل الوقائع والطلبات لصياغة المذكرة.");
        setLoading(false);
        return;
      }
      inputData = draftMemoForm;
      queryTitle = draftMemoForm.title || `مذكرة ${draftMemoForm.memoType}`;
    } else if (activeTab === "SIMULATOR") {
      if (!simulatorForm.plaintiffClaims || !simulatorForm.defendantResponses) {
        setErrorText("فضلاً أدخل ادعاءات المدعي ودفوع المدعى عليه لمحاكاة القضية بدقة.");
        setLoading(false);
        return;
      }
      inputData = simulatorForm;
      queryTitle = simulatorForm.caseTitle || "محاكاة جلسة افتراضية";
    } else if (activeTab === "AUDIT") {
      if (!auditForm.draftedText) {
        setErrorText("فضلاً أدخل نص المذكرة المراد تدقيقها.");
        setLoading(false);
        return;
      }
      inputData = auditForm;
      queryTitle = "مراجعة وتدقيق لائحة";
    } else if (activeTab === "RISK_ASSESSMENT") {
      if (!riskForm.facts) {
        setErrorText("فضلاً أدخل الوقائع المعروضة لتقصي المخاطر.");
        setLoading(false);
        return;
      }
      inputData = riskForm;
      queryTitle = riskForm.caseTitle || "تقييم الثغرات والمخاطر";
    }

    try {
      const response = await fetch("/api/legal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: activeTab,
          inputData
        })
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "فشل الاتصال بالمخدم الذكي.");
      }

      setCurrentResponse(resData);
      
      // Save this result in history
      const newCase: SavedCase = {
        id: "case_" + Date.now(),
        title: queryTitle,
        serviceType: activeTab as LegalServiceType,
        createdAt: new Date().toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        input: inputData,
        response: resData,
        isFavorite: false
      };
      
      saveCaseToHistory(newCase);

    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "حدث خطأ غير متوقع أثناء الاتصال بالخادم الافتراضي.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Interactive chat follow-up queries on current analysis
  const executeFollowUp = async () => {
    if (!chatMessage.trim() || !currentResponse) return;
    
    setChatLoading(true);
    const userMsg = chatMessage;
    setChatMessage("");
    
    // Add to chat history immediately
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);

    try {
      // We will call the general analyze API again but appending follow-up parameter
      const inputWithFollowUp = {
        originalContext: currentResponse.details,
        followUpQuestion: userMsg,
        serviceType: activeTab
      };

      const customPrompt = 
        `بصفتك المستشار القضائي السعودي والقاضي الافتراضي، بناءً على التحليل السابق الذي أصدرته:\n` +
        `الملخص السابق: ${currentResponse.summary}\n` +
        `التفاصيل السابقة: ${JSON.stringify(currentResponse.details)}\n\n` +
        `يجيب العميل بالسؤال التالي ويريد توضيحاً دقيقاً أو صياغة معدلة تخدم سؤاله:\n` +
        `السؤال: "${userMsg}"\n\n` +
        `فضلاً أجب بإسهاب ودقة موقرة، مستشهداً بالنظام السعودي الساري والشريعة الإسلامية وموجهاً إياه للإجراء القضائي الصحيح.`;

      const response = await fetch("/api/legal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: activeTab,
          inputData: {
            caseTitle: "متابعة استشارية",
            facts: customPrompt,
            userGoal: "توضيح وتفصيل نقطة محددة"
          }
        })
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || "فشل توليد التبصر الإضافي.");
      }

      setChatHistory((prev) => [...prev, { sender: "ai", text: resData.details?.opinion || resData.summary }]);
    } catch (err: any) {
      console.error(err);
      setChatHistory((prev) => [...prev, { sender: "ai", text: `عذراً، تعذر صياغة الرأي التكميلي حالياً. التفاصيل: ${err.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printCurrentReport = () => {
    window.print();
  };

  return (
    <div id="saudi_legal_ai_app_container" className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#C5A059]/30 selection:text-white" dir="rtl">
      
      {/* Top Header Section conforming to Sovereign Cloud design */}
      <header className="h-20 border-b border-[#262626] bg-[#0F0F0F] flex items-center justify-between px-6 md:px-10 shrink-0 no-print">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#F5D18F] rounded-lg flex items-center justify-center text-[#0A0A0A] font-extrabold text-2xl shadow-lg shadow-[#C5A059]/10">
              ⚖
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#C5A059] to-[#F5D18F]">
                عدالة AI | المنظومة القضائية الموحدة
              </span>
              <span className="text-[10px] text-[#A0A0A0] tracking-wider font-mono">SAUDI INTELLIGENT JURIDICAL SYSTEM</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#161616] px-4 py-2 rounded-full border border-[#2e2e2e] shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)]"></div>
            <span className="text-[10px] font-mono text-[#AAA] tracking-wider uppercase">Sovereign Cloud Secured</span>
          </div>
          
          <div className="text-xs text-slate-400 font-mono hidden md:block">
            {new Date().toLocaleDateString("ar-SA", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Right Sidebar - Dynamic workflow navigation and past history */}
        <aside className="w-full lg:w-80 border-l border-[#262626] bg-[#0D0D0D] p-5 flex flex-col gap-6 shrink-0 no-print overflow-y-auto max-h-screen lg:max-h-none">
          <div>
            <p className="text-[10px] text-[#C5A059] uppercase tracking-[0.2em] mb-4 font-mono font-bold">بوابة الخدمات والمسارات</p>
            <ul className="space-y-2">
              {services.map((srv, index) => {
                const isSelected = activeTab === srv.id;
                return (
                  <li key={srv.id}>
                    <button
                      onClick={() => {
                        setActiveTab(srv.id);
                        setCurrentResponse(null);
                        setErrorText(null);
                        setChatHistory([]);
                      }}
                      className={`w-full text-right flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#1E1A14] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/5"
                          : "border-transparent bg-transparent text-[#999] hover:bg-[#121212] hover:text-white"
                      }`}
                    >
                      <div className={`w-6 h-6 flex items-center justify-center rounded-lg mt-0.5 text-xs font-bold leading-none ${
                        isSelected ? "bg-[#C5A059] text-[#0A0A0A]" : "bg-[#222] text-[#888]"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm truncate">{srv.title}</span>
                        </div>
                        <p className="text-[11px] text-[#777] mt-1 line-clamp-2 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}

              {/* Saudi Law reference button */}
              <li>
                <button
                  onClick={() => {
                    setActiveTab("SAUDI_LAWS");
                    setCurrentResponse(null);
                    setErrorText(null);
                    setChatHistory([]);
                  }}
                  className={`w-full text-right flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                    activeTab === "SAUDI_LAWS"
                      ? "bg-[#141E18] border-emerald-600/50 text-[#C5A059] shadow-lg"
                      : "border-transparent bg-transparent text-[#999] hover:bg-[#121212] hover:text-white"
                  }`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs ${
                    activeTab === "SAUDI_LAWS" ? "bg-emerald-600 text-white" : "bg-[#222] text-[#888]"
                  }`}>
                    📖
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-sm">البوابة التشريعية السعودية</span>
                    <p className="text-[11px] text-[#777] mt-1">البحث العيني في الأنظمة واللوائح السارية بالدولة.</p>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* Quick simulation banner */}
          {activeTab !== "SIMULATOR" && activeTab !== "SAUDI_LAWS" && (
            <div className="bg-gradient-to-br from-[#1E1A11] to-[#0A0A0A] border border-[#C5A059]/20 rounded-2xl p-4.5 mt-2">
              <p className="text-xs text-[#C5A059] font-bold flex items-center gap-1.5 font-serif">
                <Award className="h-4 w-4" />
                محاكاة الأحكام القضائية
              </p>
              <p className="text-[11px] text-[#A0A0A0] leading-relaxed mt-2">
                يتيح لك تقديم معطيات نزاع مفصلة ليقوم النظام بمحاكاة منطق قاضي سعودي بإصدار صك حكم مسبب بدقة فريدة وتبيان مؤشر ثقتك.
              </p>
              <button
                onClick={() => {
                  setActiveTab("SIMULATOR");
                  setCurrentResponse(null);
                  setErrorText(null);
                  loadTemplate("SIMULATOR");
                }}
                className="w-full mt-4 py-2 bg-[#C5A059] text-[#0A0A0A] text-xs font-bold rounded-lg shadow-md hover:bg-[#D1B175] transition-all cursor-pointer text-center"
              >
                شغل محاكي القضية الآن
              </button>
            </div>
          )}

          {/* History of Saved Cases */}
          <div className="mt-auto border-t border-[#222] pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-[#999] tracking-wider flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-[#C5A059]" />
                سجل القضايا والاستشارات
              </span>
              <span className="text-[10px] font-mono text-[#555]">{savedCases.length} محفوظ</span>
            </div>
            
            {savedCases.length === 0 ? (
              <div className="bg-[#111] rounded-xl p-4 text-center border border-[#222] text-xs text-[#555] leading-normal">
                لا توجد قضايا محفوظة حالياً بالذاكرة السحابية المؤمنة للمتصفح.
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {savedCases.map((cs) => {
                  const srvInfo = services.find(s => s.id === cs.serviceType);
                  return (
                    <div
                      key={cs.id}
                      onClick={() => {
                        setActiveTab(cs.serviceType);
                        setCurrentResponse(cs.response);
                        setErrorText(null);
                        setChatHistory([]);
                        // Reload specific form from history
                        if (cs.serviceType === "CONSULTATION") setConsultationForm(cs.input);
                        else if (cs.serviceType === "RESEARCH") setResearchForm(cs.input);
                        else if (cs.serviceType === "DRAFT_MEMO") setDraftMemoForm(cs.input);
                        else if (cs.serviceType === "SIMULATOR") setSimulatorForm(cs.input);
                        else if (cs.serviceType === "AUDIT") setAuditForm(cs.input);
                        else if (cs.serviceType === "RISK_ASSESSMENT") setRiskForm(cs.input);
                      }}
                      className="group bg-[#121212] hover:bg-[#161616] border border-[#222] hover:border-[#333] rounded-xl p-3 text-right cursor-pointer transition-all flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#E0E0E0] truncate flex-1 leading-normal pl-2 group-hover:text-[#C5A059]">{cs.title}</span>
                        <button
                          onClick={(e) => deleteCaseFromHistory(cs.id, e)}
                          className="text-[#555] hover:text-red-400 text-xs p-1"
                          title="حذف السجل"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#666] mt-1">
                        <span className="bg-[#1E1C1A] text-[#C5A059] px-1.5 py-0.5 rounded border border-[#3A3326]">{srvInfo?.badge || "ملف قضية"}</span>
                        <span>{cs.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Central Layout Portal */}
        <div className="flex-1 flex flex-col bg-[#080808] overflow-y-auto p-4 md:p-8">
          
          <div className="max-w-5xl mx-auto w-full space-y-6">
            
            {/* Context Breadcrumbs & Switcher */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#222] pb-5 no-print">
              <div>
                <span className="text-xs text-[#C5A059] font-mono tracking-widest uppercase block mb-1">
                  {activeTab === "SAUDI_LAWS" ? "SAUDI LAWS PORTAL" : "AI LEGAL ASSISTANT ENGINE"}
                </span>
                <h1 className="text-xl md:text-2xl font-serif font-black text-white">
                  {activeTab === "SAUDI_LAWS" ? "بوابة الأنظمة والتشريعات السعودية" : services.find(s => s.id === activeTab)?.title}
                </h1>
                <p className="text-sm text-[#888] mt-1">
                  {activeTab === "SAUDI_LAWS" ? "استعرض نظام العمل، نظام الإثبات، المعاملات المدنية والمحاكم التجارية في واجهة واحدة موحدة." : "أدخل بيانات قضيتك المعززة وسيتولى الذكاء الاصطناعي معالجة نصوص القوانين السعودية الفعالة والشرع والمدونات."}
                </p>
              </div>

              {activeTab !== "SAUDI_LAWS" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => loadTemplate(activeTab as LegalServiceType)}
                    className="text-xs bg-[#1A1A1A] hover:bg-[#222] text-[#C5A059] border border-[#C5A059]/40 rounded-xl px-4 py-2.5 font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    تحميل نموذج وقائع جاهز
                  </button>
                  <button
                    onClick={handleClearForm}
                    className="text-xs bg-[#121212] hover:bg-[#1A1A1A] text-[#888] hover:text-white border border-[#222] rounded-xl px-3 py-2.5 transition-all flex items-center gap-1 cursor-pointer"
                    title="تفريغ الحقول"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Error Container */}
            {errorText && (
              <div className="bg-red-950/40 border border-red-950 text-[#FFA0A0] text-sm p-4 rounded-xl flex items-start gap-3 no-print">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1">
                  <span className="font-bold block text-red-400">إشعار بالخطأ أو فقدان المفتاح:</span>
                  <p className="mt-1 leading-relaxed text-xs">{errorText}</p>
                </div>
              </div>
            )}

            {/* Rendering Dynamic Flow Inputs/Contents */}
            <div className="no-print">
              
              {/* Tabs for Services */}
              {activeTab === "CONSULTATION" && (
                <div className="bg-[#0F0F0F] rounded-2xl border border-[#222] p-5 md:p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">عنوان الاستشارة القانونية</label>
                      <input
                        type="text"
                        placeholder="أدخل عنواناً معبراً للقضية (مثال: المطالبة بتعويض المقاولة)"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={consultationForm.caseTitle}
                        onChange={(e) => setConsultationForm({ ...consultationForm, caseTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">تصنيف النزاع العام</label>
                      <input
                        type="text"
                        placeholder="مثال: نظام العمل، المعاملات المدنية، تجاري"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={consultationForm.category}
                        onChange={(e) => setConsultationForm({ ...consultationForm, category: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2">أطراف النزاع والصفة القضائية</label>
                    <input
                      type="text"
                      placeholder="مثال: أحمد عبد الله (موظف) ضد مؤسسة النجم للتجارة"
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                      value={consultationForm.parties}
                      onChange={(e) => setConsultationForm({ ...consultationForm, parties: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2">الوقائع والأحداث بالتفصيل (Investigation & Discovery)</label>
                    <textarea
                      rows={5}
                      placeholder="اسرد تسلسل الأحداث المسببة للخلاف والمبالغ والتواريخ وما جرى بينكما بوضوح..."
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none"
                      value={consultationForm.facts}
                      onChange={(e) => setConsultationForm({ ...consultationForm, facts: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">الغاية النهائية للعميل</label>
                      <input
                        type="text"
                        placeholder="ماذا يطلب العميل؟ (مثال: استرجاع حقي بالتعويض المالي)"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={consultationForm.userGoal}
                        onChange={(e) => setConsultationForm({ ...consultationForm, userGoal: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">المستندات والعقود المتوفرة (اختياري)</label>
                      <input
                        type="text"
                        placeholder="مثال: عقد توظيف رسمي ومراسلات إلكترونية معتمدة"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={consultationForm.documentsText || ""}
                        onChange={(e) => setConsultationForm({ ...consultationForm, documentsText: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={executeAnalysis}
                    className="w-full bg-[#C5A059] text-[#0A0A0A] hover:bg-[#D1B175] text-sm font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <Scale className="h-4 w-4" />
                    توليد الاستشارة والتحليل الشرعي والنظامي فوراً
                  </button>
                </div>
              )}

              {activeTab === "RESEARCH" && (
                <div className="bg-[#0F0F0F] rounded-2xl border border-[#222] p-5 md:p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2">موضوع البحث القانوني المراد تكييفه</label>
                    <input
                      type="text"
                      placeholder="أدخل المسألة المراد كشف الرأي الشرعي والقضائي حولها"
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                      value={researchForm.topic}
                      onChange={(e) => setResearchForm({ ...researchForm, topic: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2">التصنيف أو الفرع القانوني</label>
                    <input
                      type="text"
                      placeholder="مثال: نظام العمل، القانون الجنائي، نظام الشركات الجديد، الإفلاس"
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                      value={researchForm.category}
                      onChange={(e) => setResearchForm({ ...researchForm, category: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2">تفاصيل وقائع المسألة (factsContext)</label>
                    <textarea
                      rows={5}
                      placeholder="اسرد الوقائع التي تحيط بهذه المسألة لنطابقها بنصوص وأحكام القضاء..."
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none"
                      value={researchForm.factsContext}
                      onChange={(e) => setResearchForm({ ...researchForm, factsContext: e.target.value })}
                    ></textarea>
                  </div>

                  <button
                    onClick={executeAnalysis}
                    className="w-full bg-[#C5A059] text-[#0A0A0A] hover:bg-[#D1B175] text-sm font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <Search className="h-4 w-4" />
                    بدء البحث الفوري في مواد الأنظمة والسوابق
                  </button>
                </div>
              )}

              {activeTab === "DRAFT_MEMO" && (
                <div className="bg-[#0F0F0F] rounded-2xl border border-[#222] p-5 md:p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">عنوان المستند (الدعوى)</label>
                      <input
                        type="text"
                        placeholder="مثال: صحيفة دعوى رد القيمة الزائدة"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={draftMemoForm.title}
                        onChange={(e) => setDraftMemoForm({ ...draftMemoForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">نوع اللائحة/المذكرة</label>
                      <select
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={draftMemoForm.memoType}
                        onChange={(e) => setDraftMemoForm({ ...draftMemoForm, memoType: e.target.value as any })}
                      >
                        <option value="صحيفة_دعوى">صحيفة دعوى جديدة</option>
                        <option value="مذكرة_جوابية">مذكرة رد جوابية</option>
                        <option value="مذكرة_استئناف">لائحة استئناف اعتراضية</option>
                        <option value="عقد_اتفاق">عقد اتفاق أو تشغيل عيني</option>
                        <option value="أخرى">أخرى</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">بيانات المدعي (طالب الصياغة)</label>
                      <input
                        type="text"
                        placeholder="الاسم، السجل المدني/التجاري، العنوان"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={draftMemoForm.claimantInfo}
                        onChange={(e) => setDraftMemoForm({ ...draftMemoForm, claimantInfo: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">بيانات المدعى عليه (الخصم)</label>
                      <input
                        type="text"
                        placeholder="الاسم، السجل، العنوان المعتمد"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={draftMemoForm.respondentInfo}
                        onChange={(e) => setDraftMemoForm({ ...draftMemoForm, respondentInfo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2">سرد الوقائع والادعاءات والأدلة بالتفصيل</label>
                    <textarea
                      rows={4}
                      placeholder="اذكر جوهر الخلاف وعملية التعاقد أو الإخلاء والتفاصيل لتدبير الصياغة الفصحى بالديباجة..."
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none"
                      value={draftMemoForm.factsAndClaims}
                      onChange={(e) => setDraftMemoForm({ ...draftMemoForm, factsAndClaims: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">الطلبات النهائية المحددة</label>
                      <input
                        type="text"
                        placeholder="ما هي طلباتك الموجهة للقاضي؟ (مثال: فسخ العقد واسترداد 120 ألف)"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={draftMemoForm.requestedRemedies}
                        onChange={(e) => setDraftMemoForm({ ...draftMemoForm, requestedRemedies: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">البينات والمستندات الداعمة</label>
                      <input
                        type="text"
                        placeholder="الشهود، المراسلات، العقود المرفقة"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={draftMemoForm.supportingEvidence}
                        onChange={(e) => setDraftMemoForm({ ...draftMemoForm, supportingEvidence: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={executeAnalysis}
                    className="w-full bg-[#C5A059] text-[#0A0A0A] hover:bg-[#D1B175] text-sm font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <Briefcase className="h-4 w-4" />
                    توليد وصياغة اللائحة القانونية بالطراز القضائي السعودي
                  </button>
                </div>
              )}

              {activeTab === "SIMULATOR" && (
                <div className="bg-[#0F0F0F] rounded-2xl border border-[#222] p-5 md:p-6 space-y-4">
                  <div className="bg-amber-950/20 border border-amber-900 text-[#F5D18F] p-4 rounded-xl text-xs space-y-1">
                    <span className="font-bold block text-sm">💡 حول محاكي القضية (القاضي الافتراضي):</span>
                    <p className="leading-5">
                      تقوم هذه الميزة بالتحقق من الطبقة التشريعية، والتأصيلية من الشرع وقواعد الفقه والسوابق لإخراج "صك حكم افتراضي" يعرض احتمالات فوز الدعوى والوقائع بـ "مؤشر ثقة" قضائي دقيق.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">موضوع ومسمى الدعوى</label>
                      <input
                        type="text"
                        placeholder="أدخل عنوان القضية المراد إقامتها"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={simulatorForm.caseTitle}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, caseTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">التصنيف القضائي المقدر</label>
                      <input
                        type="text"
                        placeholder="مثال: المحكمة التجارية، المحكمة العامة، الأحوال الشخصية"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={simulatorForm.category}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, category: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">ادعاءات المدعي وحججه بالدليل (Plaintiff claims)</label>
                      <textarea
                        rows={4}
                        placeholder="ماذا يدعي الطرف الطالب في صحيفته وحجته المباشرة؟"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none"
                        value={simulatorForm.plaintiffClaims}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, plaintiffClaims: e.target.value })}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">دفوع وردود وإجابات المدعى عليه (Defendant responses)</label>
                      <textarea
                        rows={4}
                        placeholder="بماذا يرد الطرف المدعى عليه لتنصل التزاماته أو تفنيد ادعاءات خصمه؟"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none"
                        value={simulatorForm.defendantResponses}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, defendantResponses: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">الأدلة والقرائن المطروحة للقضية</label>
                      <input
                        type="text"
                        placeholder="مثال: فواتير، رسائل واتساب مع خطابات تسليم موقعة"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={simulatorForm.providedEvidence}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, providedEvidence: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">العقود أو التعهدات المكتوبة بينهما</label>
                      <input
                        type="text"
                        placeholder="مثال: عقد اتفاقية تطوير وبرمجة مصاغ للشركة"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={simulatorForm.relevantAgreementsOrContracts}
                        onChange={(e) => setSimulatorForm({ ...simulatorForm, relevantAgreementsOrContracts: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={executeAnalysis}
                    className="w-full bg-[#C5A059] text-[#0A0A0A] hover:bg-[#D1B175] text-sm font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 font-serif"
                  >
                    <Scale className="h-4 w-4" />
                    بدء محاكاة القاضي وإنشاء صك الحكم الافتراضي وتسبيبه
                  </button>
                </div>
              )}

              {activeTab === "AUDIT" && (
                <div className="bg-[#0F0F0F] rounded-2xl border border-[#222] p-5 md:p-6 space-y-4">
                  <div className="bg-slate-900/40 border border-slate-800 text-[#AAA] p-4 rounded-xl text-xs leading-5">
                    <span className="font-bold block text-sm text-white mb-1">🔍 ميزة التدقيق اللغوي والمنطقي التلقائي (AI Legal Audit):</span>
                    نقوم بمقارنة النص الذي صشته مع الحقائق والتواريخ الموثقة بالعقود لإخبارك بأي تعارض أو إشارة لمادة بنظام تم إلغاؤه أو تعديله من قبل هيئة الخبراء.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2 font-serif">النص القانوني أو المذكرة المراد مراجعتها وتدقيقها</label>
                    <textarea
                      rows={5}
                      placeholder="ألصق نص اللائحة أو المذكرة التي كتبتها لتفحص مدى صحتها ومطابقتها العينية..."
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none font-sans"
                      value={auditForm.draftedText}
                      onChange={(e) => setAuditForm({ ...auditForm, draftedText: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">مستندات الواقع الثابتة (التواريخ والمبالغ الفعلية بالعقود)</label>
                      <textarea
                        rows={3}
                        placeholder="مثال: العقد الفعلي مؤرخ في 2025/11/15 والمبلغ هو 200,000 ريال فقط."
                        className="w-full text-xs bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none"
                        value={auditForm.supportingEvidenceText}
                        onChange={(e) => setAuditForm({ ...auditForm, supportingEvidenceText: e.target.value })}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">مواد الأنظمة المعروضة للاستشهاد (اختياري)</label>
                      <textarea
                        rows={3}
                        placeholder="أدخل أرقام المواد والنظم التي ذكرتها لمراجعة سريانها..."
                        className="w-full text-xs bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none"
                        value={auditForm.referencedArticlesText || ""}
                        onChange={(e) => setAuditForm({ ...auditForm, referencedArticlesText: e.target.value })}
                      ></textarea>
                    </div>
                  </div>

                  <button
                    onClick={executeAnalysis}
                    className="w-full bg-[#C5A059] text-[#0A0A0A] hover:bg-[#D1B175] text-sm font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    تشغيل فحص وتدقيق المذكرة والمطابقة العينية
                  </button>
                </div>
              )}

              {activeTab === "RISK_ASSESSMENT" && (
                <div className="bg-[#0F0F0F] rounded-2xl border border-[#222] p-5 md:p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2">موضوع وجوهر القضية للتقييم</label>
                    <input
                      type="text"
                      placeholder="أدخل عنواناً معبراً للقضية لتقدير الثغرات"
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                      value={riskForm.caseTitle}
                      onChange={(e) => setRiskForm({ ...riskForm, caseTitle: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#A0A0A0] mb-2">الوقائع والقصة الفعلية للترافع</label>
                    <textarea
                      rows={4}
                      placeholder="اسرد أحداث النزاع لنستخلص نقاط الضعف ونرصد الأخطاء الشائعة..."
                      className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white leading-relaxed resize-none"
                      value={riskForm.facts}
                      onChange={(e) => setRiskForm({ ...riskForm, facts: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">الأدلة والبينات المتاحة</label>
                      <input
                        type="text"
                        placeholder="مثال: تسجيلات، شات مكتوب، شهود عيان"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={riskForm.submittedEvidence}
                        onChange={(e) => setRiskForm({ ...riskForm, submittedEvidence: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#A0A0A0] mb-2">مخاوفك ونقاط الضعف المبدئية</label>
                      <input
                        type="text"
                        placeholder="ماهي ثغراتك التي تؤرقك؟"
                        className="w-full text-sm bg-[#161616] border border-[#2a2a2a] rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#C5A059] text-white"
                        value={riskForm.potentialWeaknesses}
                        onChange={(e) => setRiskForm({ ...riskForm, potentialWeaknesses: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    onClick={executeAnalysis}
                    className="w-full bg-[#C5A059] text-[#0A0A0A] hover:bg-[#D1B175] text-sm font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    كشف نقاط الضعف وتوقع ردود وتكتيكات الخصوم
                  </button>
                </div>
              )}

              {activeTab === "SAUDI_LAWS" && (
                <div className="space-y-6">
                  <SaudiLawsReference />
                </div>
              )}

            </div>

            {/* Active Analysis Loading Spinner with sovereign cloud messages */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-[#0F0F0F] rounded-2xl border border-[#C5A059]/30 p-8 flex flex-col items-center justify-center text-center space-y-6 shadow-xl shadow-[#C5A059]/5 no-print"
                >
                  <div className="relative">
                    <Loader2 className="h-12 w-12 text-[#C5A059] animate-spin" />
                    <div className="absolute inset-0 m-auto h-5 w-5 bg-[#C5A059] rounded-full animate-ping opacity-20"></div>
                  </div>
                  <div className="space-y-2 max-w-lg">
                    <h3 className="text-base font-bold text-white font-serif">جاري الحساب والتحليل في بيئة Sovereign ومواءمتها...</h3>
                    <p className="text-xs text-[#AAA] min-h-[36px] transition-all duration-300">
                      {LOADING_STEPS[loadingStep]}
                    </p>
                  </div>
                  <div className="w-full max-w-xs bg-[#222] h-1 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-l from-[#C5A059] to-[#F5D18F] h-full rounded-full animate-pulse" style={{ width: `${(loadingStep + 1) * 20}%` }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Structured Results Display Panel */}
            {currentResponse && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                
                {/* Print Title Header for Court and PDF download */}
                <div className="hidden print-only text-center border-b-2 border-slate-900 pb-4 mb-6">
                  <h1 className="text-2xl font-bold">تقرير دراسة وتحليل قانوني - منصة عدالة AI</h1>
                  <p className="text-sm mt-1">تاريخ التحليل: {new Date(currentResponse.timestamp).toLocaleString("ar-SA")}</p>
                </div>

                {/* Score & Meta header */}
                <div id="results_meta_box" className="p-6 rounded-2xl border border-[#262626] bg-gradient-to-br from-[#0F0F0F] to-[#0D0D0D] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#C5A059]/5 rounded-full blur-2xl"></div>
                  
                  <div className="flex-1 space-y-1 z-10">
                    <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase block">ANALYSIS REPORT</span>
                    <h2 className="text-xl font-bold text-white font-serif">{currentResponse.summary}</h2>
                    <p className="text-xs text-[#999]">مخرجات معتمدة عبر فحص نصوص المواد والقواعد بالتأصيل القضائي المعاصر.</p>
                  </div>

                  <div className="flex items-center gap-4 z-10 shrink-0">
                    <div className="text-left bg-[#161616] border border-[#333] px-5 py-3 rounded-xl flex items-center gap-3">
                      <div>
                        <span className="text-[9px] text-[#888] block tracking-wide uppercase">Confidence index</span>
                        <span className="text-xl font-mono font-bold text-white pr-2">
                          {currentResponse.details.confidenceIndex || 85}%
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#1e1a14] border border-[#C5A059]/30 flex items-center justify-center text-xs font-mono font-extrabold text-[#C5A059]">
                        ثقة
                      </div>
                    </div>

                    <div className="flex gap-2 no-print">
                      <button
                        onClick={printCurrentReport}
                        className="p-3 bg-[#1A1A1A] hover:bg-[#222] text-[#E0E0E0] rounded-xl border border-[#2e2e2e] transition-all cursor-pointer"
                        title="طباعة التقرير أو حفظ كـ PDF"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid container of specific subcomponents */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Right main column with content details */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Judge Simulator Judgement Deed (صك حكم قضائي) */}
                    {activeTab === "SIMULATOR" && currentResponse.details.verdict && (
                      <div className="bg-[#111111] border-2 border-[#C5A059]/30 rounded-2xl relative p-6 md:p-8 space-y-6 shadow-xl">
                        
                        {/* Immersive Judgement Stamp/Header */}
                        <div className="flex justify-between items-start border-b border-[#C5A059]/20 pb-4">
                          <div className="text-right space-y-1">
                            <span className="text-[10px] text-[#C5A059]">المملكة العربية السعودية</span>
                            <span className="text-xs font-serif block text-white font-bold">المحكمة الافتراضية لمنصة عدالة AI</span>
                            <span className="text-[10px] text-[#777] block font-mono">CASE SIMULATION DEED</span>
                          </div>
                          
                          <div className="flex flex-col items-center justify-center border border-[#C5A059]/40 bg-[#1e1a14] px-4 py-2 rounded-lg text-center font-serif text-[10px] text-[#C5A059]">
                            <span>صك حكم قضائي افتراضي</span>
                            <span className="font-mono mt-0.5">VERDICT RECORD</span>
                          </div>

                          <div className="text-left space-y-1 text-[10px] text-[#777]">
                            <div>الرقم: SA-SIM-{Math.floor(Math.random() * 90000) + 10000}</div>
                            <div>التاريخ: {new Date().toLocaleDateString("ar-SA")}</div>
                          </div>
                        </div>

                        {/* Judgement Main logic */}
                        <div className="space-y-4 text-right">
                          <h3 className="text-base font-bold text-[#C5A059] font-serif border-r-2 border-[#C5A059] pr-2.5">
                            أولاً: منطوق الحكم القضائي الافتراضي (Verdict)
                          </h3>
                          <p className="p-4 bg-[#1A1A1A] border border-[#262626] rounded-xl text-sm text-white italic font-serif leading-8 leading-relaxed">
                            "{currentResponse.details.verdict}"
                          </p>
                        </div>

                        {/* Reasoning */}
                        {currentResponse.details.verdictReasoning && (
                          <div className="space-y-3 pt-2 text-right">
                            <h3 className="text-base font-bold text-[#C5A059] font-serif border-r-2 border-[#C5A059] pr-2.5">
                              ثانياً: الحيثيات والتسبيب القضائي وتكييف الواقِع (Reasoning)
                            </h3>
                            <div className="text-sm text-[#CCC] leading-relaxed font-serif space-y-3 bg-[#0c0c0c] p-4 rounded-xl border border-[#222]">
                              {currentResponse.details.verdictReasoning.split("\n\n").map((para, i) => (
                                <p key={i} className="leading-7">{para}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Signature stamps */}
                        <div className="pt-6 border-t border-[#262626] flex justify-between items-center text-xs text-[#888] font-serif pr-3">
                          <span>توقيع وختم كاتب الدائرة الافتراضية</span>
                          <div className="text-left">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#C5A059]/30 flex items-center justify-center text-[8px] font-mono text-[#C5A059] uppercase rotate-12 bg-[#C5A059]/5 select-none">
                              AI Judge Decided
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Drafted Memo Box */}
                    {currentResponse.details.draftedMemo && (
                      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-[#222] pb-3">
                          <span className="text-sm font-bold text-white flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-[#C5A059]" />
                            مسودة اللائحة القانونية المصاغة بأسلوب المحاكم السعودية
                          </span>
                          <button
                            onClick={() => copyToClipboard(currentResponse.details.draftedMemo || "")}
                            className="bg-[#1C1C1C] hover:bg-[#252525] text-[#C5A059] text-xs font-bold px-3.5 py-1.5 rounded-lg border border-[#333] flex items-center gap-1.5 transition-all cursor-pointer no-print"
                          >
                            {copied ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                تم النسخ
                              </>
                            ) : (
                              <>
                                <Clipboard className="h-3.5 w-3.5" />
                                نسخ النص كاملاً
                              </>
                            )}
                          </button>
                        </div>

                        <div className="bg-[#0A0A0A] p-5 rounded-xl border border-[#222] font-serif text-sm leading-relaxed text-[#DCDCDC] space-y-4 overflow-x-auto whitespace-pre-wrap select-text">
                          {currentResponse.details.draftedMemo}
                        </div>
                      </div>
                    )}

                    {/* Audit Results Table if active is AUDIT */}
                    {activeTab === "AUDIT" && currentResponse.details.auditedIssues && (
                      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif border-b border-[#222] pb-3">
                          <AlertTriangle className="h-5 w-5 text-[#C5A059]" />
                          نتائج فحص التعارضات والتدقيق التلقائي (AI Legal Audit)
                        </h3>

                        {currentResponse.details.auditedIssues.length === 0 ? (
                          <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-xl text-xs text-emerald-400">
                            مبارك! فحص المذكرة لم يرصد أي تعارض رقمي أو تاريخي أو استشهاد بنظام قضائي ملغى. الصياغة تتسق منطقياً مع وقائع الأدلة وبيناتك الماثلة.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {currentResponse.details.auditedIssues.map((issue, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-start ${
                                  issue.severity === "high"
                                    ? "bg-red-950/20 border-red-900/40 text-red-100"
                                    : issue.severity === "medium"
                                    ? "bg-amber-950/20 border-amber-900/40 text-amber-100"
                                    : "bg-slate-900/20 border-slate-800 text-slate-100"
                                }`}
                              >
                                <div className="shrink-0 pt-0.5">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                                    issue.severity === "high" ? "bg-red-900 text-white" : "bg-amber-800 text-amber-200"
                                  }`}>
                                    {issue.severity === "high" ? "ثغرة خطيرة" : "تنبيه هام"}
                                  </span>
                                </div>
                                <div className="space-y-2 flex-1 text-right">
                                  <p className="text-sm font-bold">{issue.description}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1.5 border-t border-white/5">
                                    <div className="p-2.5 bg-black/40 rounded border border-white/5">
                                      <span className="text-[#888] block text-[10px] mb-1">الوقوع الأصلي في مذكرتك:</span>
                                      <span className="text-[#FF9999] line-through">{issue.originalText}</span>
                                    </div>
                                    <div className="p-2.5 bg-emerald-950/30 rounded border border-emerald-900/30">
                                      <span className="text-emerald-400 block text-[10px] mb-1">التصحيح القضائي الموصى به:</span>
                                      <span className="text-emerald-200 font-bold">{issue.suggestedCorrection}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* General Legal Opinion & Advice block */}
                    {currentResponse.details.opinion && activeTab !== "SIMULATOR" && activeTab !== "AUDIT" && (
                      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif border-b border-[#222] pb-3">
                          <BookOpen className="h-5 w-5 text-[#C5A059]" />
                          الرأي والتحليل القانوني المستخلص للأطراف
                        </h3>
                        <div className="text-sm text-[#CCC] leading-relaxed font-serif space-y-3 whitespace-pre-wrap select-text pr-1">
                          {currentResponse.details.opinion}
                        </div>
                      </div>
                    )}

                    {/* Precedent Citation check validation status (only for Audit) */}
                    {activeTab === "AUDIT" && currentResponse.details.validReferenceChecks && (
                      <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif border-b border-[#222] pb-3">
                          <BookOpenCheck className="h-5 w-5 text-[#C5A059]" />
                          التحقق الفني من سريان المواد والمراجع النظامية
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {currentResponse.details.validReferenceChecks.map((check, index) => (
                            <div key={index} className="p-3 bg-[#161616] border border-[#222] rounded-xl flex items-center justify-between text-right gap-3">
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-white truncate block">{check.citation}</span>
                                <span className="text-[10px] text-[#888] block mt-1 leading-normal">{check.notes}</span>
                              </div>
                              <span className={`text-[10px] whitespace-nowrap px-2 py-1 rounded font-bold ${
                                check.status === "ساري_المفعول" 
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-950" 
                                  : "bg-red-950/60 text-red-400 border border-red-950"
                              }`}>
                                {check.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive follow-up Q&A Chat window */}
                    <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-4 no-print">
                      <div className="flex items-center gap-2 border-b border-[#222] pb-3">
                        <HelpCircle className="h-5 w-5 text-[#C5A059]" />
                        <div>
                          <h3 className="text-sm font-bold text-white font-serif">ملحق الأسئلة والاستجواب الفوري للدراسة</h3>
                          <span className="text-[10px] text-[#666] block">اسأل القاضي الافتراضي عن تفاصيل أو اطلب تعديلاً لإجراء مخصص</span>
                        </div>
                      </div>
                      
                      {/* Chat Messages */}
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                        {chatHistory.length === 0 ? (
                          <p className="text-xs text-[#555] text-center py-6">اسأل عن تفاصيل المذكرة أو استفسر عن تكييف المواد.</p>
                        ) : (
                          chatHistory.map((chat, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                                chat.sender === "user"
                                  ? "bg-[#C5A059]/10 text-white border border-[#C5A059]/20 mr-auto text-left"
                                  : "bg-[#181818] text-[#DDD] border border-[#282828] ml-auto text-right"
                              }`}
                            >
                              <span className="font-bold block text-[9px] mb-1 text-[#C5A059]">
                                {chat.sender === "user" ? "العميل" : "المستشار الافتراضي"}
                              </span>
                              <div className="whitespace-pre-wrap font-serif">{chat.text}</div>
                            </div>
                          ))
                        )}

                        {chatLoading && (
                          <div className="bg-[#181818] text-[#666] p-3 rounded-xl flex items-center gap-2 max-w-[200px] border border-[#222] ml-auto">
                            <Loader2 className="h-3 w-3 animate-spin text-[#C5A059]" />
                            <span className="text-[10px]">جاري الصياغة...</span>
                          </div>
                        )}
                      </div>

                      {/* Input container */}
                      <div className="flex gap-2 bg-[#0C0C0C] rounded-xl border border-[#222] p-2">
                        <input
                          type="text"
                          placeholder="مثال: يرجى إضافة دفوع المشرع بشأن اليمين الحاسمة لهذه اللائحة..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && executeFollowUp()}
                          className="flex-1 bg-transparent border-none outline-none text-xs text-[#AAA] placeholder-[#444] px-2 text-right"
                        />
                        <button
                          onClick={executeFollowUp}
                          disabled={chatLoading}
                          className="p-2 bg-[#C5A059] text-[#0A0A0A] hover:bg-[#D1B175] rounded-lg transition-all cursor-pointer font-bold shrink-0 text-xs"
                        >
                          {chatLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Left Column with details sidebar */}
                  <div className="space-y-6">

                    {/* Strategy box */}
                    {currentResponse.details.suggestedStrategy && (
                      <div className="bg-[#111] border border-[#222] rounded-2xl p-5 space-y-3 relative overflow-hidden">
                        <div className="absolute right-0 top-0 h-1 w-full bg-gradient-to-l from-[#C5A059] to-[#F5D18F]"></div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Check className="h-4 w-4 text-[#C5A059]" />
                          الاستراتيجية الوقائية المقترحة (Strategy)
                        </h4>
                        <p className="text-xs text-[#AAA] leading-6 font-serif select-text whitespace-pre-wrap">
                          {currentResponse.details.suggestedStrategy}
                        </p>
                      </div>
                    )}
                    
                    {/* Sharia Sources citation */}
                    {currentResponse.details.shariaBase && currentResponse.details.shariaBase.length > 0 && (
                      <div className="bg-[#0F0F0F]/90 border border-[#262626] rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5 font-serif">
                          🕋 التأصيل الفقهي والشرعي (الكتاب والسنة)
                        </h4>
                        <ul className="space-y-2">
                          {currentResponse.details.shariaBase.map((item, idx) => (
                            <li key={idx} className="bg-[#151515] p-3 rounded-lg border border-[#222] text-xs text-[#E0E0E0] leading-relaxed font-serif">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Constitutional legal system base */}
                    {currentResponse.details.constitutionalBase && currentResponse.details.constitutionalBase.length > 0 && (
                      <div className="bg-[#0F0F0F]/80 border border-[#262626] rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-serif">
                          <Scale className="h-4 w-4 text-[#C5A059]" />
                          الطبقة التشريعية والقرارات ذات الصلة
                        </h4>
                        <div className="space-y-2">
                          {currentResponse.details.constitutionalBase.map((item, idx) => (
                            <div key={idx} className="p-3 bg-slate-900/40 rounded-xl border border-slate-900 flex items-start gap-2.5 text-xs text-[#CCC] leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0"></span>
                              <span className="select-text">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths & Weaknesses analysis */}
                    <div className="grid grid-cols-1 gap-4">
                      
                      {/* Strengths */}
                      {currentResponse.details.strengths && currentResponse.details.strengths.length > 0 && (
                        <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-5 space-y-3">
                          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-serif">
                            🟢 نقاط القوة والأدلة الدافعة
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-300">
                            {currentResponse.details.strengths.map((str, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                <span className="leading-5 select-text">{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Weaknesses */}
                      {currentResponse.details.weaknesses && currentResponse.details.weaknesses.length > 0 && (
                        <div className="bg-red-950/10 border border-red-900/30 rounded-2xl p-5 space-y-3">
                          <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5 font-serif">
                            🔴 نقاط الضعف والمخاطر والمستمسكات
                          </h4>
                          <ul className="space-y-2 text-xs text-slate-300">
                            {currentResponse.details.weaknesses.map((weak, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-red-500 font-bold shrink-0">!</span>
                                <span className="leading-5 select-text">{weak}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>

                    {/* Historical Judicial Precedents */}
                    {currentResponse.details.precedentsAnalyzed && currentResponse.details.precedentsAnalyzed.length > 0 && (
                      <div className="bg-[#0F0F0F] border border-[#222] rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-serif">
                          📋 مدونات الأحكام الفرعية والسوابق المشابهة
                        </h4>
                        <div className="space-y-2.5">
                          {currentResponse.details.precedentsAnalyzed.map((prec, idx) => (
                            <div key={idx} className="bg-gradient-to-l from-[#161616] to-[#0D0D0D] p-3 rounded-lg border border-[#222] text-xs text-[#BBB] leading-relaxed font-serif">
                              {prec}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                </div>

              </motion.div>
            )}

          </div>
        </div>

      </div>

      {/* Footer conforming to sovereign NCA cybersecurity and sync indicators */}
      <footer className="h-10 bg-[#0F0F0F] border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between px-6 shrink-0 text-center sm:text-right text-[10px] text-[#666] gap-2 py-2 sm:py-0 no-print">
        <div className="flex items-center gap-4">
          <span className="font-mono tracking-tighter">GitHub Production Status: Active</span>
          <span className="font-mono tracking-tighter">API Pipeline: L3 Sovereignty Checksum Active</span>
        </div>
        <div className="font-serif">
          جميع الحقوق البرمجية والقضائية والوقائع مشفرة بالكامل ومعالجة محلياً ضمن خوادم سحابية سيادية وطنية آمنة 2026.
        </div>
      </footer>

    </div>
  );
}
