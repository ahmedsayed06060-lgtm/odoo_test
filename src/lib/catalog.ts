import type { Bi, Difficulty, QuestionType, Stage, Module } from './types';
export const bi = (en: string, ar: string): Bi => ({ en, ar });
const m = (id:string,en:string,ar:string,de:string,da:string): Module => ({id,name:bi(en,ar),description:bi(de,da)});
export const modules: Module[] = [
m('navigation','Navigation & Essentials','التنقل والأساسيات','Find your way around records, views, and activities.','إتقان السجلات وطرق العرض والأنشطة.'),
m('editions','Community & Enterprise','Community وEnterprise','Understand editions, apps, and functional availability.','فهم الإصدارات والتطبيقات والتوافر الوظيفي.'),
m('hosting','Hosting & Deployment','الاستضافة والنشر','Choose Online, Odoo.sh, or On-Premise with confidence.','الاختيار بين Online وOdoo.sh والاستضافة الذاتية.'),
m('access','Users & Access Rights','المستخدمون وصلاحيات الوصول','Build appropriate access without over-permissioning.','منح الصلاحيات المناسبة دون توسيع غير ضروري.'),
m('settings','General Configuration','الإعدادات العامة','Configure a sound foundation for business operations.','إعداد أساس سليم للعمليات التجارية.'),
m('companies','Companies & Currencies','الشركات والعملات','Separate entities and manage a multi-currency business.','فصل الكيانات وإدارة الأعمال متعددة العملات.'),
m('erp','Basic ERP Concepts','مفاهيم ERP الأساسية','Connect master data, documents, and business processes.','ربط البيانات الرئيسية والمستندات والعمليات.'),
m('crm','CRM','إدارة علاقات العملاء','Turn qualified opportunities into lasting relationships.','تحويل الفرص المؤهلة إلى علاقات دائمة.'),
m('sales','Sales','المبيعات','Configure quotations, orders, pricing, and invoicing.','إعداد عروض الأسعار والأوامر والتسعير والفوترة.'),
m('purchase','Purchase','المشتريات','Manage replenishment requests, orders, and vendor bills.','إدارة التوريد وأوامر الشراء وفواتير الموردين.'),
m('inventory','Inventory & Warehousing','المخازن والمستودعات','Control stock, traceability, receipts, and deliveries.','مراقبة المخزون والتتبع والاستلام والتسليم.'),
m('accounting','Accounting & Invoicing','المحاسبة والفوترة','Connect daily transactions to reliable financial records.','ربط العمليات اليومية بسجلات مالية موثوقة.'),
m('pos','Point of Sale','نقاط البيع','Run reliable retail and restaurant operations.','تشغيل عمليات التجزئة والمطاعم بكفاءة.'),
m('mrp','Manufacturing','التصنيع','Plan production, components, and shop-floor work.','تخطيط الإنتاج والمكونات وعمليات الورشة.'),
m('project','Project Management','إدارة المشروعات','Organize tasks, milestones, and delivery.','تنظيم المهام والمراحل والتسليم.'),
m('timesheets','Timesheets','سجلات الوقت','Capture effort and connect services to billing.','تسجيل الجهد وربط الخدمات بالفوترة.'),
m('employees','Employees & HR','الموظفون والموارد البشرية','Maintain employee records and HR workflows.','إدارة سجلات الموظفين ودورات الموارد البشرية.'),
m('payroll','Payroll','الرواتب','Validate localized salary structures and pay runs.','مراجعة هياكل الرواتب المحلية ومسيّرات الدفع.'),
m('expenses','Expenses','المصروفات','Process employee spending with clear approvals.','معالجة إنفاق الموظفين بموافقات واضحة.'),
m('fleet','Fleet','الأسطول','Track vehicles, contracts, and running costs.','متابعة المركبات والعقود وتكاليف التشغيل.'),
m('subscriptions','Subscriptions','الاشتراكات','Manage recurring revenue and renewals.','إدارة الإيرادات المتكررة والتجديدات.'),
m('rental','Rental','التأجير','Schedule rental reservations and returns.','جدولة حجوزات التأجير والمرتجعات.'),
m('helpdesk','Helpdesk','مكتب المساعدة','Deliver consistent support with teams and SLAs.','تقديم دعم متسق باستخدام الفرق واتفاقيات الخدمة.'),
m('website','Website & eCommerce','الموقع والتجارة الإلكترونية','Connect the storefront to fulfillment and finance.','ربط المتجر الإلكتروني بالتنفيذ والمالية.'),
m('email','Email Marketing','التسويق بالبريد','Build responsible, measurable email campaigns.','إنشاء حملات بريدية مسؤولة وقابلة للقياس.'),
m('automation','Marketing Automation','أتمتة التسويق','Design audience-based, multi-step journeys.','تصميم رحلات تسويق متعددة الخطوات حسب الجمهور.'),
m('documents','Documents','المستندات','Organize business files and document actions.','تنظيم ملفات الأعمال وإجراءات المستندات.'),
m('quality','Quality','الجودة','Build inspection points and manage quality alerts.','إعداد نقاط الفحص وإدارة تنبيهات الجودة.'),
m('maintenance','Maintenance','الصيانة','Plan preventive work and respond to equipment failures.','تخطيط الصيانة الوقائية والاستجابة للأعطال.'),
m('fieldservice','Field Service','الخدمة الميدانية','Coordinate on-site tasks, worksheets, and billing.','تنسيق المهام الميدانية وأوراق العمل والفوترة.'),
m('advanced-accounting','Advanced Accounting','المحاسبة المتقدمة','Reconcile, close, and control financial workflows.','التسوية والإقفال والرقابة على الدورات المالية.'),
m('valuation','Stock Valuation','تقييم المخزون','Understand costing methods and inventory accounts.','فهم طرق التكلفة وحسابات المخزون.'),
m('reordering','Reordering Rules','قواعد إعادة الطلب','Balance availability against working capital.','تحقيق التوازن بين التوافر ورأس المال العامل.'),
m('routes','Routes & Putaway','المسارات وقواعد التخزين','Design stock movements and storage strategies.','تصميم حركات المخزون واستراتيجيات التخزين.'),
m('dropshipping','Dropshipping','الشحن المباشر','Coordinate customer demand and vendor fulfillment.','تنسيق طلبات العملاء وتنفيذ الموردين.'),
m('landed','Landed Costs','تكاليف الشحن الواردة','Allocate freight and duty to inventory value.','توزيع الشحن والرسوم على قيمة المخزون.'),
m('workcenters','Work Centers & Routes','مراكز العمل والمسارات','Model capacity, routing, and production time.','نمذجة الطاقة والمسارات وزمن الإنتاج.'),
m('bom','Bills of Materials','قوائم المواد','Choose components, variants, and BOM types.','اختيار المكونات والمتغيرات وأنواع قوائم المواد.'),
m('agreements','Purchase Agreements','اتفاقيات الشراء','Compare vendor offers and manage blanket orders.','مقارنة عروض الموردين وإدارة الاتفاقيات الإطارية.'),
m('analytic','Analytic Accounting','المحاسبة التحليلية','Track revenue and costs by business dimension.','تتبع الإيرادات والتكاليف حسب أبعاد الأعمال.'),
m('budget','Budgeting','الموازنات','Compare plans with financial actuals.','مقارنة الخطط بالنتائج المالية الفعلية.'),
m('warehouses','Multi-Warehouse','تعدد المستودعات','Plan fulfillment across a warehouse network.','تخطيط التنفيذ عبر شبكة مستودعات.'),
m('advanced-pos','Advanced POS','نقاط البيع المتقدمة','Control sessions, payments, and complex retail flows.','التحكم في الجلسات والمدفوعات وعمليات التجزئة المعقدة.'),
m('workflows','Automated Workflows','دورات العمل المؤتمتة','Automate business actions with appropriate safeguards.','أتمتة الإجراءات التجارية مع ضوابط مناسبة.'),
m('reporting','Reporting & Analysis','التقارير وتحليل الأعمال','Turn operational data into useful decisions.','تحويل البيانات التشغيلية إلى قرارات مفيدة.'),
m('requirements','Requirements Analysis','تحليل المتطلبات','Separate business needs from feature requests.','التمييز بين احتياجات الأعمال وطلبات الخصائص.'),
m('methodology','Implementation Methodology','منهجية التنفيذ','Deliver an ERP project in controlled iterations.','تنفيذ مشروع ERP عبر دورات منضبطة.'),
m('mapping','Business Process Mapping','رسم العمليات التجارية','Map the current and target operating model.','رسم نموذج التشغيل الحالي والمستهدف.'),
m('database','Database Configuration','إعداد قاعدة البيانات','Translate approved requirements into configuration.','تحويل المتطلبات المعتمدة إلى إعدادات.'),
m('masterdata','Master Data Preparation','إعداد البيانات الرئيسية','Define ownership, standards, and data quality.','تحديد المسؤولية والمعايير وجودة البيانات.'),
m('migration','Import & Migration','الاستيراد والترحيل','Move clean business data with reconciled totals.','نقل بيانات نظيفة مع مطابقة الإجماليات.'),
m('opening','Opening Balances','الأرصدة الافتتاحية','Establish a controlled financial and stock cutover.','تنفيذ انتقال منضبط للأرصدة المالية والمخزونية.'),
m('localization','Accounting Localization','التوطين المحاسبي','Apply country-specific accounting and fiscal rules.','تطبيق القواعد المحاسبية والضريبية المحلية.'),
m('taxes','Tax Configuration','إعداد الضرائب','Map tax scenarios and validate fiscal treatment.','تحديد الحالات الضريبية والتحقق من المعالجة.'),
m('training','User Training','تدريب المستخدمين','Build role-based confidence before launch.','بناء كفاءة المستخدمين حسب الأدوار قبل الإطلاق.'),
m('golive','Go-Live Preparation','الاستعداد للإطلاق','Confirm readiness across people, process, and data.','التأكد من جاهزية الأفراد والعمليات والبيانات.'),
m('uat','Testing & UAT','الاختبار وقبول المستخدم','Prove end-to-end outcomes with business owners.','إثبات النتائج المتكاملة بمشاركة مسؤولي الأعمال.'),
m('change','Change Management','إدارة التغيير','Support adoption and communicate change effectively.','دعم التبني والتواصل الفعال بشأن التغيير.'),
m('troubleshooting','Functional Troubleshooting','معالجة المشكلات الوظيفية','Diagnose configuration and process issues systematically.','تشخيص مشكلات الإعداد والعمليات بصورة منهجية.'),
m('support','Post-Go-Live Support','دعم ما بعد الإطلاق','Stabilize operations and prioritize improvements.','استقرار العمليات وترتيب التحسينات حسب الأولوية.'),
m('cases','Business Case Studies','دراسات حالة الأعمال','Make integrated decisions in realistic businesses.','اتخاذ قرارات متكاملة في حالات أعمال واقعية.'),
m('scenarios','Complex Functional Scenarios','الحالات الوظيفية المعقدة','Balance trade-offs across connected applications.','موازنة القرارات عبر التطبيقات المترابطة.'),
m('crossmodule','Cross-Module Workflows','دورات العمل المتكاملة','Trace a transaction from first contact to reporting.','تتبع المعاملة من التواصل الأول حتى التقارير.'),
m('versions','Version Comparisons','مقارنة الإصدارات','Compare verified changes from Odoo 14 to 20.','مقارنة التغييرات الموثقة من Odoo 14 إلى 20.')
];
export const moduleMap = Object.fromEntries(modules.map(x=>[x.id,x]));
const stage = (id:number,en:string,ar:string,se:string,sa:string,de:string,da:string,count:number,color:string,ids:string[]):Stage=>({id,name:bi(en,ar),short:bi(se,sa),description:bi(de,da),count,color,modules:ids});
export const stages: Stage[] = [
stage(1,'Odoo Fundamentals & Administration','أساسيات Odoo والإدارة','Build your foundation','ابنِ أساسك المعرفي','Navigate confidently, configure access, and understand the ERP landscape.','تنقل بثقة، واضبط الصلاحيات، وافهم منظومة ERP.',100,'violet',['navigation','editions','hosting','access','settings','companies','erp']),
stage(2,'Core Functional Modules','الوحدات الوظيفية الأساسية','Know the applications','أتقن التطبيقات','Connect the day-to-day workflows behind every major Odoo application.','اربط دورات العمل اليومية في تطبيقات Odoo الرئيسية.',350,'blue',['crm','sales','purchase','inventory','accounting','pos','mrp','project','timesheets','employees','payroll','expenses','fleet','subscriptions','rental','helpdesk','website','email','automation','documents','quality','maintenance','fieldservice']),
stage(3,'Advanced Functional Knowledge','المعرفة الوظيفية المتقدمة','Connect the details','اربط التفاصيل','Solve deeper configuration, costing, replenishment, and analysis challenges.','عالج تحديات الإعداد والتكلفة والتوريد والتحليل.',200,'teal',['advanced-accounting','valuation','reordering','routes','dropshipping','landed','workcenters','bom','agreements','analytic','budget','warehouses','advanced-pos','workflows','reporting']),
stage(4,'ERP Implementation & Business Scenarios','تنفيذ ERP وحالات الأعمال','Think like a consultant','فكّر كمستشار','Take a business from requirements through testing, go-live, and support.','انقل الأعمال من المتطلبات إلى الاختبار والإطلاق والدعم.',200,'amber',['requirements','methodology','mapping','database','masterdata','migration','opening','localization','taxes','training','golive','uat','change','troubleshooting','support','cases']),
stage(5,'Advanced Certification & Version Comparisons','التحضير المتقدم ومقارنة الإصدارات','Bring it all together','اجمع المعارف','Practice integrated decisions and verify what changed across Odoo versions.','تدرّب على القرارات المتكاملة وتغيرات إصدارات Odoo.',150,'rose',['scenarios','crossmodule','versions'])
];
export const difficulties: Difficulty[] = ['beginner','intermediate','advanced','expert'];
export const difficultyLabels: Record<Difficulty,Bi> = {beginner:bi('Beginner','مبتدئ'),intermediate:bi('Intermediate','متوسط'),advanced:bi('Advanced','متقدم'),expert:bi('Expert','خبير')};
export const questionTypes: QuestionType[] = ['single','multiple','boolean','scenario','case','configuration','troubleshooting','comparison'];
export const typeLabels: Record<QuestionType,Bi> = {single:bi('Single choice','اختيار واحد'),multiple:bi('Multiple select','اختيار متعدد'),boolean:bi('True or false','صح أو خطأ'),scenario:bi('Scenario-based','قائم على موقف'),case:bi('Business case','دراسة حالة'),configuration:bi('Configuration','إعداد'),troubleshooting:bi('Troubleshooting','معالجة مشكلة'),comparison:bi('Version comparison','مقارنة إصدارات')};
export const versions = [14,15,16,17,18,19,20];
export const versionDates: Record<number,string> = {14:'2020-10',15:'2021-10',16:'2022-10',17:'2023-11',18:'2024-10',19:'2025-09',20:'2026-09'};
