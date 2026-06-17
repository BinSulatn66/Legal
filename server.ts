import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize GoogleGenAI client lazily or safely
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API Endpoints
// Check health endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is online" });
});

// Main legal processing engine
app.post("/api/legal/analyze", async (req: Request, res: Response) => {
  try {
    const { serviceType, inputData } = req.body;

    if (!serviceType || !inputData) {
      res.status(400).json({ success: false, error: "Missing serviceType or inputData" });
      return;
    }

    let ai;
    try {
      ai = getGenAI();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: "مفتاح API الخاص بـ Gemini غير مُهيّأ. يرجى إضافته من خلال لوحة الأسرار (Secrets Panel) في إعدادات المنصة لتتمكن من استخدام خادم الذكاء الاصطناعي.",
        technical: err.message
      });
      return;
    }

    // Prepare customized system instruction and prompts for Saudi juridical structure
    const systemInstruction = 
      "أنت مستشار قانوني سعودي رفيع المستوى وقاضٍ افتراضي متمرس في الأنظمة واللوائح بالمملكة العربية السعودية ومقاصد الشريعة الإسلامية.\n" +
      "مهمتك هي تقديم استشارات وتأصيل قانوني ومحاكاة دقيقة جداً للأحكام القضائية باللغة العربية الفصحى الرصينة والأسلوب القضائي السعودي المعتمد.\n" +
      "يجب أن تكون تحليلاتك واقعية ومبنية على:\n" +
      "1. الأنظمة واللوائح السعودية السارية (مثل نظام المعاملات المدنية الصادر بمرسوم ملكي رقم م/191، نظام المرافعات الشرعية، نظام الإثبات، نظام الشركات، إلخ) وتجنب الأنظمة الملغاة.\n" +
      "2. الشريعة الإسلامية (القرآن والسنة، القواعد الفقهية الكلية، الاجتهادات المعتمدة في القضاء السعودي).\n" +
      "3. السوابق والمدونات والأحكام القضائية المنشورة (ديوان المظالم، المحكمة العليا ه، وزارة العدل).\n" +
      "عند صياغة المذكرات أو اللوائح التزم بالهيكل الدقيق: البسملة، توجيه الخطاب لفضيلة ناظر القضية، تفاصيل المدعي والمدعى عليه، الموضوع، الوقائع والأسانيد، والطلبات بصورة واضحة ومهذبة.";

    let prompt = "";

    if (serviceType === "CONSULTATION") {
      prompt = `قم بتقديم استشارة قانونية أولية مفصلة للقضية التالية:
العنوان: ${inputData.caseTitle || "قضية جديدة"}
التصنيف: ${inputData.category || "عام"}
الأطراف: ${inputData.parties || "غير محدد"}
الوقائع والتفاصيل: ${inputData.facts}
أهداف العميل وغايته: ${inputData.userGoal}
${inputData.documentsText ? `المستندات المرفقة المتوفرة: ${inputData.documentsText}` : ""}

المطلوب:
1. تقديم رأي قانوني أولي رصين يوضح الموقف القانوني العام لهذه الوقائع.
2. تحديد نقاط القوة الداعمة لموقف العميل بناءً على المعطيات.
3. تحديد نقاط الضعف والمخاطر المحتملة التي يجب الحذر منها.
4. الاستناد إلى الأنظمة واللوائح السعودية السارية مع ذكر مبررات قانونية دقيقة.
5. استدالالات شرعية (من الكتاب والسنة والقواعد الفقهية) المتعلقة بهذا التصنيف.
6. وضع استراتيجية وخطة عمل قانونية مقترحة للتعامل مع هذا النزاع وعرض الاحتمالات والتوصيات للعميل.`;
    } 
    else if (serviceType === "RESEARCH") {
      prompt = `قم بعمل بحث وتحليل قانوني معمق في الأنظمة السعودية المعاصرة والسوابق القضائية للمسألة القانونية التالية:
الموضوع البحثي: ${inputData.topic}
التصنيف الرئيسي: ${inputData.category}
الوقائع المحيطة بالمسألة: ${inputData.factsContext}

المطلوب:
1. بحث تاريخي ونظامي للمواد والأدوات التشريعية السعودية ذات الصلة (لوائح، قوانين، تعاميم).
2. استخراج المبادئ الشرعية الكلية والفرعية التي تضبط هذه المسألة بمقتضى الشريعة الإسلامية الراجحة بالمملكة.
3. سرد أمثلة لسوابق قضائية وأحكام مماثلة (مثل أحكام ديوان المظالم أو المحاكم العامة/التجارية) وكيف فصلت في هذا الخصوص.
4. تقديم شرح استشاري دقيق لكيفية تطبيق هذه النصوص ومؤشرات نجاح الحجج المبنية عليها.`;
    } 
    else if (serviceType === "DRAFT_MEMO") {
      prompt = `قم بصياغة مذكرة قانونية احترافية ومتكاملة (صحيفة دعوى / لائحة اعتراضية / مذكرة رصينة) مستخدماً المعلومات التالية:
عنوان الصحيفة: ${inputData.title}
نوع اللائحة/المذكرة: ${inputData.memoType}
بيانات المدعي/طالب الصياغة: ${inputData.claimantInfo}
بيانات المدعى عليه/الخصم: ${inputData.respondentInfo}
الوقائع والادعاءات بالتفصيل: ${inputData.factsAndClaims}
الطلبات النهائية للعميل: ${inputData.requestedRemedies}
الأدلة والمستندات الداعمة: ${inputData.supportingEvidence}

المطلوب صياغة المذكرة متضمنةً:
- البسملة والديباجة التقليدية الموقرة الموجهة إلى المحكمة المختصة.
- سرد وقائع متسلسل بأسلوب بليغ يربط الحادثة بالحق المطالب به.
- تسبيب وتأصيل نظامي (المواد من الأنظمة السعودية) وشرعي صريح.
- تفنيد دفوع متوقع إثارتها من الخصم إن وجدت.
- صياغة الطلبات الختامية بشكل جازم ومحدد يتوافق مع الأنظمة السعودية.`;
    } 
    else if (serviceType === "SIMULATOR") {
      prompt = `أنت في هذه الجلسة تلعب دور "القاضي السعودي الافتراضي" (The Judge Simulator) في محاكاة قضائية بالغة الجدية والعمق.
اقرأ كافة معطيات النزاع التالية بدقة شديدة:
اسم الدعوى/موضوعها: ${inputData.caseTitle}
التصنيف القضائي: ${inputData.category}
ادعاءات المدعي وحججه: ${inputData.plaintiffClaims}
دفوع المدعى عليه وإجاباته: ${inputData.defendantResponses}
البينات والأدلة المقدمة في هذه القضية: ${inputData.providedEvidence}
العقود أو التعهدات والاتفاقيات بين الطرفين: ${inputData.relevantAgreementsOrContracts}

دورك كقاضٍ سعودي مرن وصارم معاً:
1. دراسة القضية دراسة فاحصة عادلة ومفصلة.
2. البحث في الأنظمة السعودية الحديثة المعاصرة المتعلّقة، والشريعة الإسلامية (الكتاب والسنة ومبادئ العدالة الشرعية) وكيفية تكييف الوقائع.
3. السوابق القضائية المنشورة المشابهة وكيفية حكم القضاء فيها.
4. كتابة حكم افتراضي مفصل يشمل منطوق الحكم والتسبيب (الأسباب ووجه الاستدلال الشرعي والنظامي بالتفصيل).
5. تقييم كفة الفوز لكلا الطرفين بهيئة "مؤشر ثقة" (Confidence index) مئوي يوضح احتمالية ربح المدعي أو المدعى عليه في الواقع الحقيقي بناءً على قوة البنية والمستندات القانونية.`;
    } 
    else if (serviceType === "AUDIT") {
      prompt = `أنت تمثل محرك "التدقيق اللغوي والمنطقي التلقائي للمذكرات" (AI Legal Audit).
قم بمراجعة النص المكتوب بواسطة المحامي ومقارنته بالمستندات والوقائع المرفقة مع رصد أي خلل أو ثغرة:
النص القانوني المصاغ المراد تدقيقه:
"${inputData.draftedText}"

المستندات والحقائق الثابتة (عقود، تواريخ، أرقام، فواتير):
"${inputData.supportingEvidenceText}"

مواد الأنظمة المستند عليها (إن وجدت):
"${inputData.referencedArticlesText || ""}"

المطلوب تنفيذ المهمة بالتالي:
1. التدقيق التاريخي والرقدي والاسمى: قارن التواريخ، الأسماء، والمبالغ المالية بين المذكرة والمستندات بصرامة. ورصد أي تعارض (مثلاً تاريخ العقد بالمذكرة يختلف عن العقد الفعلي، أو مبالغ غير متطابقة).
2. مراجعة صحة الاستشهاد بالمواد القانونية وسريانها: تأكد من أن النصوص والقرارات المذكورة تنتمي للأنظمة السعودية السارية حالياً ومذكورة بمادتها الصحيحة.
3. تحديد نقاط التناقض الداخلي في الصياغة (كأن يدعي شيئاً ثم يناقضه في مكان آخر).
4. اقتراح البدائل والتصحيحات المباشرة بذكر النص الأصلي والنص المقترح للتعديل بدقة وتبرير ذلك.`;
    } 
    else if (serviceType === "RISK_ASSESSMENT") {
      prompt = `قم بعمل تقييم شامل للمخاطر وتوقع ثغرات الخصوم للقضية التالية:
موضوع القضية: ${inputData.caseTitle}
الوقائع والأحداث: ${inputData.facts}
الأدلة والبينات المتاحة حالياً: ${inputData.submittedEvidence}
نقاط الضعف المتوقعة أو المخاوف المبدئية: ${inputData.potentialWeaknesses}

المطلوب:
1. تحليل نقاط الضعف الكامنة في أدلة العميل (مثلاً: مستند غير موثق، ادعاء مرسل بلا بينة، عدم توفر شهود، فواتير غير رسمية، إلخ).
2. توقع تكتيكات الخصم والردود والدفوع التي سيثيرها أمام القضاء للالتفاف حول حجة العميل.
3. رصد الثغرات الإجرائية (مثلاً فوات مواعيد تقديم الطعون، عدم الاختصاص الولائي أو القيمي، إلخ).
4. تقديم خطة حمائية (توصيات وقائية) لسد هذه الثغرات وإتمام النقص بالأدلة القانونية المناسبة.`;
    }

    // Configure structural JSON Schema for output representation
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: "ملخص تنفيذي موجز جداً للقضية أو المسألة بلغة واضحة ومباشرة.",
        },
        opinion: {
          type: Type.STRING,
          description: "الرأي القانوني المفصل أو مخرجات اللائحة أو التحليل الكامل بحسب طبيعة الخدمة.",
        },
        strengths: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "قائمة بنقاط القوة الداعمة لموقف العميل في النزاع.",
        },
        weaknesses: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "قائمة بنقاط الضعف والثغرات والمخاطر المحددة.",
        },
        constitutionalBase: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "قائمة بمواد الأنظمة السعودية واللوائح والقرارات ذات الصلة التي تنطبق على الحالة.",
        },
        shariaBase: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "التأصيل الشرعي والمبادئ الفقهية المقتبسة من القرآن والسنة والقواعد الكلية.",
        },
        precedentsAnalyzed: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "أمثلة من سوابق قضائية أو أحكام مشابهة في القضاء السعودي مدعمة بدرجة تأثيرها.",
        },
        suggestedStrategy: {
          type: Type.STRING,
          description: "توصيات استراتيجية وإجراءات عملية فورية يوصى باتباعها للتعامل مع هذا الموقف.",
        },
        confidenceIndex: {
          type: Type.INTEGER,
          description: "مؤشر مئوي من 0 إلى 100 يعبر عن فرصة النجاح أو نسبة الاستقرار والدقة تبعا للمستندات.",
        },
        verdict: {
          type: Type.STRING,
          description: "منطوق الحكم الافتراضي الصادر بصية القاضي السعودي (خاص بـ SIMULATOR).",
        },
        verdictReasoning: {
          type: Type.STRING,
          description: "التسبيب القضائي للحكم الافتراضي الصادر بأسلوب قضائي شرعي ونظامي سعودي معاصر (خاص بـ SIMULATOR).",
        },
        draftedMemo: {
          type: Type.STRING,
          description: "النص الكامل للمذكرة أو اللائحة القضائية المصاغة وفق طراز المحاكم السعودية (خاص بـ DRAFT_MEMO).",
        },
        auditedIssues: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: {
                type: Type.STRING,
                description: "نوع الإشكال: date_mismatch, unsupported_claim, article_outdated, contradiction, other, spelling_grammar",
              },
              severity: {
                type: Type.STRING,
                description: "الخطورة: high, medium, low",
              },
              description: {
                type: Type.STRING,
                description: "وصف مفصل للثغرة أو التناقض أو الخطأ الذي تم رصده.",
              },
              originalText: {
                type: Type.STRING,
                description: "النص الأصلي من المذكرة الخاطئة.",
              },
              suggestedCorrection: {
                type: Type.STRING,
                description: "الصيغة القانونية أو التصحيح المقترح للتعديل وسد الثغرة.",
              },
            },
            required: ["type", "severity", "description", "originalText", "suggestedCorrection"],
          },
          description: "الأخطاء والتناقضات المرصودة في المذكرة ومقترحات تصحيحها (خاص بـ AUDIT).",
        },
        validReferenceChecks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              citation: {
                type: Type.STRING,
                description: "المادة أو اللائحة المذكورة كمرجع.",
              },
              status: {
                type: Type.STRING,
                description: "الحالة الحالية للمادة: ساري_المفعول, ملغي, معدل, غير_مؤكد",
              },
              notes: {
                type: Type.STRING,
                description: "ملاحظات وتوجيهات تتعلق بالتحديثات الأخيرة لهذه المادة.",
              },
            },
            required: ["citation", "status", "notes"],
          },
          description: "التحقق من سريان وصحة المواد المذكورة باللائحة والمراجع القانونية (خاص بـ AUDIT).",
        },
      },
      required: ["summary", "opinion", "strengths", "weaknesses", "constitutionalBase", "shariaBase", "suggestedStrategy", "confidenceIndex"],
    };

    // Use general task text model alias
    const modelName = "gemini-3.5-flash";

    console.log(`Calling Gemini [${modelName}] for Service: ${serviceType}...`);

    const result = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.15, // Keep it highly factual and precise
      },
    });

    const textOutput = result.text;
    if (!textOutput) {
      throw new Error("No response generated from the model.");
    }

    const parsedData = JSON.parse(textOutput.trim());

    // Generate responsive raw markdown as backup for display
    let rawMarkdown = `# ${parsedData.summary || "الملخص التنفيذي"}\n\n`;
    rawMarkdown += `### ⚖️ الرأي القانوني العام\n${parsedData.opinion}\n\n`;
    
    if (parsedData.verdict) {
      rawMarkdown += `### 🏛️ حكم القاضي الافتراضي\n**منطوق الحكم:** ${parsedData.verdict}\n\n`;
    }
    if (parsedData.verdictReasoning) {
      rawMarkdown += `### 📄 تسبيب الحكم القضائي\n${parsedData.verdictReasoning}\n\n`;
    }
    if (parsedData.draftedMemo) {
      rawMarkdown += `### ✍️ مسودة المذكرة القانونية المصاغة\n\`\`\`\n${parsedData.draftedMemo}\n\`\`\`\n\n`;
    }
    
    res.json({
      success: true,
      modelUsed: modelName,
      timestamp: new Date().toISOString(),
      summary: parsedData.summary,
      details: parsedData,
      rawMarkdown: rawMarkdown,
    });

  } catch (error: any) {
    console.error("Legal Engine Error:", error);
    res.status(500).json({
      success: false,
      error: "حدث خطأ أثناء معالجة البيانات القانونية عبر الذكاء الاصطناعي.",
      technical: error.message || error,
    });
  }
});

// 2. Client Build & Static Assets Handling
const initServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting development mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    console.log("Starting production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

initServer();
