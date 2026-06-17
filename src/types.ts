export type LegalServiceType = 
  | "CONSULTATION" 
  | "RESEARCH" 
  | "DRAFT_MEMO" 
  | "SIMULATOR" 
  | "AUDIT" 
  | "RISK_ASSESSMENT";

export interface LegalServiceInfo {
  id: LegalServiceType;
  title: string;
  description: string;
  badge: string;
  iconName: string;
}

export interface ConsultationInput {
  caseTitle: string;
  category: string;
  parties: string;
  facts: string;
  userGoal: string;
  documentsText?: string;
}

export interface ResearchInput {
  topic: string;
  category: string;
  factsContext: string;
}

export interface DraftMemoInput {
  title: string;
  memoType: "صحيفة_دعوى" | "مذكرة_جوابية" | "مذكرة_استئناف" | "عقد_اتفاق" | "أخرى";
  claimantInfo: string;
  respondentInfo: string;
  factsAndClaims: string;
  requestedRemedies: string;
  supportingEvidence: string;
}

export interface SimulatorInput {
  caseTitle: string;
  category: string;
  plaintiffClaims: string;
  defendantResponses: string;
  providedEvidence: string;
  relevantAgreementsOrContracts: string;
}

export interface AuditInput {
  draftedText: string;
  supportingEvidenceText: string;
  referencedArticlesText?: string;
}

export interface RiskInput {
  caseTitle: string;
  facts: string;
  submittedEvidence: string;
  potentialWeaknesses: string;
}

export interface LegalResponse {
  success: boolean;
  modelUsed: string;
  timestamp: string;
  // Results can be parsed or mapped depending on the service
  summary: string;
  details: {
    legalOpinion?: string; // الاستشارة الأولية
    strengths?: string[]; // قوة القضية
    weaknesses?: string[]; // نقاط الضعف والمخاطر
    constitutionalBase?: string[]; // الأنظمة واللوائح ذات الصلة
    shariaBase?: string[]; // التأصيل الشرعي (القرآن والسنة)
    precedentsAnalyzed?: string[]; // السوابق والأحكام المماثلة
    suggestedStrategy?: string; // الاستراتيجية المقترحة
    confidenceIndex?: number; // مؤشر ثقة المحاكي (0-100)
    verdict?: string; // الحكم الافتراضي (للمحاكي)
    verdictReasoning?: string; // التسبيب القضائي (للمحاكي)
    draftedMemo?: string; // المستند المصاغ
    auditedIssues?: {
      type: "date_mismatch" | "unsupported_claim" | "article_outdated" | "contradiction" | "other" | "spelling_grammar";
      severity: "high" | "medium" | "low";
      description: string;
      originalText: string;
      suggestedCorrection: string;
    }[]; // نتائج التدقيق
    validReferenceChecks?: {
      citation: string;
      status: "ساري_المفعول" | "ملغي" | "معدل" | "غير_مؤكد";
      notes: string;
    }[]; // التحقق من سريان المواد
  };
  rawMarkdown: string; // The complete styled legal output from Gemini
}

export interface SavedCase {
  id: string;
  title: string;
  serviceType: LegalServiceType;
  createdAt: string;
  input: any;
  response: LegalResponse;
  isFavorite: boolean;
}
