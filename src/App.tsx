import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  Calendar, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Search, 
  Clock, 
  Info, 
  Building2, 
  User, 
  Gift, 
  Download, 
  Printer, 
  Award, 
  ChevronDown, 
  Check, 
  ArrowLeft,
  X,
  FileCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Interfaces
interface DocumentItem {
  id: string;
  title: string;
  description: string;
  tip?: string;
}

interface DocumentCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  items: DocumentItem[];
}

export default function App() {
  // Navigation & UI States
  const [activeSection, setActiveSection] = useState<'home' | 'docs' | 'calculator' | 'booking'>('home');
  const [docCategory, setDocCategory] = useState<string>('sale');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Calculator states
  const [calcType, setCalcType] = useState<'sale' | 'gift' | 'company' | 'power'>('sale');
  const [calcValue, setCalcValue] = useState<string>('5000000'); // Default 5 million DA (500 million centimes)
  const [useCentimes, setUseCentimes] = useState<boolean>(true); // Algerian Centimes toggle

  // Booking state
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingPhone, setBookingPhone] = useState<string>('');
  const [bookingService, setBookingService] = useState<string>('عقد بيع عقاري');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Data Definitions
  const documentCategories: DocumentCategory[] = [
    {
      id: 'sale',
      title: 'عقود البيع',
      icon: <Building2 className="w-5 h-5" />,
      description: 'الوثائق المطلوبة لتوثيق عقود البيع والشراء العقاري أو المنقولات.',
      items: [
        { id: 'sale-1', title: 'بطاقة التعريف الوطنية', description: 'لكل من البائع والمشتري، سارية المفعول وبحالة جيدة.', tip: 'يُفضل إحضار نسخة ورقية إضافية ملونة.' },
        { id: 'sale-2', title: 'سند الملكية الأصلي', description: 'العقد الأصلي المشهر أو الشهادة الموثقة لملكية العقار أو المنقول.', tip: 'يجب أن يكون العقد حاملاً لختم المحافظة العقارية (الشهر العقاري).' },
        { id: 'sale-3', title: 'شهادة الحالة المدنية حديثة', description: 'شهادة ميلاد رقم 12 ورقم 13 (لإثبات الحالة العائلية للطرفين).', tip: 'يجب ألا يتجاوز تاريخ استخراجها 3 أشهر.' },
        { id: 'sale-4', title: 'شهادة السلبية العقارية (عدم الرهن)', description: 'تثبت خلو العقار من أي رهن، نزاع قانوني، أو حجز مالي.', tip: 'يتم استخراجها من المحافظة العقارية التابع لها العقار.' },
        { id: 'sale-5', title: 'دفتر عقاري أو مخطط مساحي للمطابقة', description: 'المخطط الطبوغرافي المعتمد من مهندس مساحي مرخص في حال عدم وجود دفتر عقاري.', tip: 'ضروري لتأكيد المساحة والحدود الدقيقة للعقار.' }
      ]
    },
    {
      id: 'gift',
      title: 'عقود الهبة',
      icon: <Gift className="w-5 h-5" />,
      description: 'الوثائق اللازمة لنقل الملكية عن طريق الهبة الشرعية بين الأقارب أو الأغيار.',
      items: [
        { id: 'gift-1', title: 'بطاقات التعريف للواهب والموهوب له', description: 'وثائق الهوية الرسمية سارية المفعول للطرفين.', tip: 'في حال وجود قاصر، يجب إحضار بطاقة الولي الشرعي والحكم القضائي للولاية إن وجد.' },
        { id: 'gift-2', title: 'سند ملكية المال الموهوب', description: 'عقد الملكية الأصلي المسجل والمشهر للمال العقاري أو المنقول.', tip: 'المحافظة على الدفتر العقاري الأصلي لتقديمه للموثق.' },
        { id: 'gift-3', title: 'شهادة عائلية لإثبات صلة القرابة', description: 'تحدد درجة القرابة بين الواهب والموهوب له لتحديد نسبة الإعفاءات الضريبية.', tip: 'القرابة المباشرة (الآباء، الأبناء، الأزواج) تستفيد من تخفيضات ضريبية هامة في القانون الجزائري.' },
        { id: 'gift-4', title: 'شهادة الحالة المدنية حديثة للطرفين', description: 'شهادة ميلاد حديثة لكل طرف لتأكيد الأهلية القانونية التامة.' }
      ]
    },
    {
      id: 'power',
      title: 'الوكالات الشرعية',
      icon: <User className="w-5 h-5" />,
      description: 'المستندات المطلوبة لتحرير الوكالات العامة، الخاصة، أو وكالات التسيير والبيع.',
      items: [
        { id: 'power-1', title: 'بطاقة التعريف الوطنية للموكل', description: 'صاحب الشأن الرئيسي الذي يفوض غيره.', tip: 'حضور الموكل شخصياً أمام الموثق إلزامي ولا تجوز الإنابة فيه.' },
        { id: 'power-2', title: 'البيانات الشخصية الكاملة للوكيل', description: 'الاسم الكامل، تاريخ ومكان الميلاد، العنوان، والمهنة ورقم هويته.', tip: 'لا يشترط حضور الوكيل أثناء توقيع الوكالة، ولكن يجب توفر معلوماته بدقة تامة.' },
        { id: 'power-3', title: 'الوثائق المبررة للوكالة (إذا لزم)', description: 'مثل عقد الملكية في حال توكيل للبيع، أو السجل التجاري في حال وكالة لتسيير شركة.' }
      ]
    },
    {
      id: 'company',
      title: 'عقود الشركات',
      icon: <Building2 className="w-5 h-5" />,
      description: 'الملف المطلوب لتأسيس الشركات (SARL, EURL, SPA) أو تعديل قوانينها الأساسية.',
      items: [
        { id: 'company-1', title: 'بطاقات تعريف الشركاء والمسير', description: 'هويات جميع الشركاء والمساهمين والمدير المعين.', tip: 'يجب إحضار نسخ واضحة وصالحة.' },
        { id: 'company-2', title: 'شهادة سلبية الاسم التجاري (Dénomination)', description: 'مستخرجة من المركز الوطني للسجل التجاري (CNRC) تثبت حجز الاسم للشركة.', tip: 'صالحة لمدة محددة ويجب الإسراع بالتوثيق قبل انقضائها.' },
        { id: 'company-3', title: 'سند المقر الاجتماعي للشركة', description: 'عقد إيجار تجاري مشهر باسم الشركة تحت التأسيس أو سند ملكية للمقر.', tip: 'يجب أن يكون النشاط مسموحاً به في المقر المختار.' },
        { id: 'company-4', title: 'شهادة إيداع الحصة النقدية في البنك', description: 'وصل إيداع رأس مال الشركة في حساب بنكي مجمد مؤقتاً باسم الموثق أو الشركة.', tip: 'مطلوبة للشركات ذات المسؤولية المحدودة والشركات المساهمة.' }
      ]
    },
    {
      id: 'realestate',
      title: 'العقود العقارية الأخرى',
      icon: <Scale className="w-5 h-5" />,
      description: 'ملف عقود القسمة العقارية، الرهن، التبادل، وإشهار الملكية.',
      items: [
        { id: 'real-1', title: 'شهادة الملكية أو الدفتر العقاري للقطع', description: 'الوثائق الرسمية التي توضح أرقام القطع والحدود.', tip: 'يفضل استخراج شهادة سلبية عقارية حديثة العهد.' },
        { id: 'real-2', title: 'مخطط القسمة والفرز الطبوغرافي', description: 'معد وموقع من قبل خبير مساحي معتمد ومصادق عليه من مصلحة مسح الأراضي.', tip: 'إلزامي لعقود القسمة بين الورثة أو الشركاء على الشياع.' },
        { id: 'real-3', title: 'الفريضة الشرعية في حال الإرث', description: 'الفريضة المحررة من طرف موثق لتحديد حصة ومنابات كل وارث.', tip: 'يجب إرفاق شهادات الوفاة لجميع المتوفين المذكورين بالفريضة.' }
      ]
    },
    {
      id: 'declare',
      title: 'التصريحات والتوثيقات الإدارية',
      icon: <FileText className="w-5 h-5" />,
      description: 'لتوثيق التصريحات الشرفية، الكفالات، التعهدات، وتوثيق توقيعات الأطراف.',
      items: [
        { id: 'dec-1', title: 'بطاقة التعريف الوطنية لصاحب التصريح', description: 'الهوية الشخصية للبدء الفوري في الإجراء.', tip: 'حضور المصرح شخصياً إلزامي.' },
        { id: 'dec-2', title: 'الوثائق الثبوتية الداعمة لمضمون التصريح', description: 'مثل كشوف المداخيل في حال التعهد بالكفالة المالية، أو الوثائق العائلية.', tip: 'تختلف بحسب نوع التصريح (مثال: شهادة عدم العمل تحتاج تصريح شرفي مدعوم ببطاقة بطالة أو شهادة عدم الانتساب).' }
      ]
    }
  ];

  const faqData = [
    {
      q: 'كيف يتم احتساب أتعاب الموثق في القانون الجزائري؟',
      a: 'تحدد أتعاب الموثق بموجب مرسوم تنفيذي رسمي صادر عن وزارة العدل والمالية. يتم احتسابها بنسب مئوية تنازلية مقسمة إلى شرائح حسب القيمة الإجمالية للعقار أو الصفقة، مضافاً إليها ضريبة القيمة المضافة (TVA) المقدرة بـ 19%، فضلاً عن الرسوم الحكومية الأخرى مثل حقوق التسجيل (5%) وحقوق المحافظة العقارية (1%) التي يتولى الموثق تحصيلها ودفعها نيابة عن الأطراف للمصالح المختصة.'
    },
    {
      q: 'ما هي المدة المستغرقة لإعداد وتوثيق عقد بيع عقاري؟',
      a: 'تتراوح المدة عادة بين أسبوع إلى 3 أسابيع. يعتمد ذلك على سرعة توفر الوثائق الإدارية المسبقة مثل "شهادة السلبية من المحافظة العقارية" و"شهادة مطابقة المخططات المساحية". بمجرد اكتمال الملف، يتم تحرير مسودة العقد واستدعاء الأطراف للتوقيع، ثم يرسل العقد للتسجيل والشهر العقاري لاستلام الدفتر العقاري الجديد.'
    },
    {
      q: 'هل يمكن للموثق تقديم استشارات قانونية قبل إمضاء العقود؟',
      a: 'نعم، تقديم الاستشارة القانونية وتوضيح التزامات وحقوق الأطراف هو واجب أساسي ومسؤولية قانونية للموثق. نوصي دائماً بحجز موعد استشارة بمكتبنا قبل الإقدام على أي معاملة مالية أو عقارية لتجنب الثغرات وضمان حماية كاملة لحقوقكم.'
    },
    {
      q: 'من يتحمل دفع مصاريف وتكاليف التوثيق؟',
      a: 'حسب العرف والقانون المدني الجزائري، يتحمل المشتري (أو المستفيد من الخدمة) مصاريف التسجيل والتوثيق والضرائب المتعلقة بنقل الملكية، ما لم يتفق الطرفان (البائع والمشتري) في العقد على خلاف ذلك بشكل صريح.'
    },
    {
      q: 'هل يمكن عمل وكالة لشخص خارج أرض الوطن؟',
      a: 'نعم، يمكن للمغتربين تحرير وكالات لدى القنصليات والسفارات الجزائرية بالخارج وتوجيهها للوكيل بالجزائر، كما يمكن تحرير وكالة بمكتبنا من طرف المقيم بالجزائر لصالح شخص بالخارج أو العكس مع احترام القوانين الخاصة بالتحويلات والبيوع.'
    }
  ];

  // Search Filter logic for documents
  const filteredDocCategories = useMemo(() => {
    if (!searchQuery.trim()) return documentCategories;
    
    return documentCategories.map(cat => {
      const filteredItems = cat.items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...cat,
        items: filteredItems
      };
    }).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  // Checklist Completion Rate
  const totalItemsCount = useMemo(() => {
    const selectedCategory = documentCategories.find(c => c.id === docCategory);
    return selectedCategory ? selectedCategory.items.length : 0;
  }, [docCategory]);

  const checkedItemsCount = useMemo(() => {
    const selectedCategory = documentCategories.find(c => c.id === docCategory);
    if (!selectedCategory) return 0;
    return selectedCategory.items.filter(item => checkedItems[item.id]).length;
  }, [docCategory, checkedItems]);

  const progressPercent = useMemo(() => {
    if (totalItemsCount === 0) return 0;
    return Math.round((checkedItemsCount / totalItemsCount) * 100);
  }, [checkedItemsCount, totalItemsCount]);

  const handleToggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClearChecklist = () => {
    const selectedCategory = documentCategories.find(c => c.id === docCategory);
    if (!selectedCategory) return;
    
    const updated = { ...checkedItems };
    selectedCategory.items.forEach(item => {
      updated[item.id] = false;
    });
    setCheckedItems(updated);
  };

  // Cost Calculator Logic (Algerian Legal Brackets)
  const calculateFees = useMemo(() => {
    // Parse value
    let valueInDA = parseFloat(calcValue);
    if (isNaN(valueInDA) || valueInDA <= 0) return null;

    if (useCentimes) {
      // Convert Centimes to Dinars (1 Million Centimes = 10,000 Dinars)
      valueInDA = valueInDA * 10000;
    }

    let notaryFees = 0;
    let registrationTax = 0;
    let landRegistryTax = 0;
    const fixedExpenses = 6000; // Fixed paper and file administrative expenses in DA

    if (calcType === 'sale' || calcType === 'gift') {
      // Scale brackets for Sale in Algeria (approximate official decree):
      // - 0 to 500,000 DA: 3%
      // - 500,001 to 1,000,000 DA: 2%
      // - 1,000,001 to 5,000,000 DA: 1%
      // - Above 5,000,001 DA: 0.5%
      
      let remaining = valueInDA;
      
      // Bracket 1: 0 - 500,000 DA
      const b1 = Math.min(remaining, 500000);
      notaryFees += b1 * 0.03;
      remaining -= b1;

      // Bracket 2: 500,001 - 1,000,000 DA
      if (remaining > 0) {
        const b2 = Math.min(remaining, 500000);
        notaryFees += b2 * 0.02;
        remaining -= b2;
      }

      // Bracket 3: 1,000,001 - 5,000,000 DA
      if (remaining > 0) {
        const b3 = Math.min(remaining, 4000000);
        notaryFees += b3 * 0.01;
        remaining -= b3;
      }

      // Bracket 4: > 5,000,000 DA
      if (remaining > 0) {
        notaryFees += remaining * 0.005;
      }

      // Registration tax (حقوق التسجيل الضرائب)
      // Standard real estate transfer tax in Algeria is 5%
      registrationTax = valueInDA * 0.05;

      // Land registry conservation fee (حقوق المحافظة العقارية للشهر)
      // Standard is 1%
      landRegistryTax = valueInDA * 0.01;

      // If it's a gift (هبة) between parents/children, registration tax is reduced to 1% in Algeria, and land registry is 1%
      if (calcType === 'gift') {
        registrationTax = valueInDA * 0.01;
      }
    } else if (calcType === 'company') {
      // Company setup fees: usually 1% of the registered capital, minimum 15,000 DA
      notaryFees = Math.max(valueInDA * 0.01, 15000);
      registrationTax = 10000; // Flat registration fee for corporate statutes
      landRegistryTax = 0; // No land registry unless real estate contributed
    } else if (calcType === 'power') {
      // Power of attorney is a fixed flat fee
      notaryFees = 3000;
      registrationTax = 1000;
      landRegistryTax = 0;
    }

    const tva = notaryFees * 0.19; // 19% VAT in Algeria
    const totalNotaryCost = notaryFees + tva + fixedExpenses;
    const totalGovernmentTaxes = registrationTax + landRegistryTax;
    const totalOverall = totalNotaryCost + totalGovernmentTaxes;

    return {
      valueInDA,
      notaryFees,
      tva,
      fixedExpenses,
      registrationTax,
      landRegistryTax,
      totalNotaryCost,
      totalGovernmentTaxes,
      totalOverall
    };
  }, [calcType, calcValue, useCentimes]);

  // Format Number Helper
  const formatNumber = (num: number, toCentimes: boolean = false) => {
    if (toCentimes) {
      // DA to Centimes (num / 10000) -> Wait, 1 Million Centimes = 10,000 DA
      const centimes = num / 10000;
      return centimes.toLocaleString('ar-DZ', { maximumFractionDigits: 0 }) + ' مليون سنتيم';
    }
    return num.toLocaleString('ar-DZ', { maximumFractionDigits: 0 }) + ' دج';
  };

  // Form Booking handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate || !bookingTime) {
      alert('الرجاء ملء جميع الحقول المطلوبة.');
      return;
    }

    const receiptNumber = 'NOT-' + Math.floor(100000 + Math.random() * 900000);
    const voucher = {
      receiptNumber,
      name: bookingName,
      phone: bookingPhone,
      service: bookingService,
      date: bookingDate,
      time: bookingTime,
      notes: bookingNotes,
      timestamp: new Date().toLocaleDateString('ar-DZ')
    };

    setBookingSuccess(voucher);
  };

  const handleResetBooking = () => {
    setBookingName('');
    setBookingPhone('');
    setBookingService('عقد بيع عقاري');
    setBookingDate('');
    setBookingTime('');
    setBookingNotes('');
    setBookingSuccess(null);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#e2e8f0] font-sans selection:bg-[#d4af37] selection:text-[#07080c] relative overflow-x-hidden">
      
      {/* Absolute Decorative Blurred Background Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-[#c5a85c]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <header id="site-header" className="sticky top-0 z-50 backdrop-blur-md bg-[#07080c]/85 border-b border-[#1f2937]/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Brand */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveSection('home')}>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-white tracking-wide font-serif leading-none">مكتب الموثق بن علي علي</h1>
                <span className="text-[11px] text-[#aa841f] font-semibold tracking-widest mt-1">موثق معتمد لدى المحكمة والمجلس القضائي بالجزائر</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <button 
                id="nav-home"
                onClick={() => setActiveSection('home')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeSection === 'home' ? 'text-[#d4af37] bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                الرئيسية
              </button>
              <button 
                id="nav-docs"
                onClick={() => setActiveSection('docs')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeSection === 'docs' ? 'text-[#d4af37] bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                دليل الوثائق المطلوبة
              </button>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <a 
                id="header-call"
                href="tel:0796337384" 
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 text-gray-300 border border-gray-700 hover:bg-white/10 hover:text-white transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span dir="ltr">0796 33 73 84</span>
              </a>
              <a 
                id="header-whatsapp"
                href="https://wa.me/213672480527" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md shadow-emerald-950/20 transition-all transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==================== HOME SECTION ==================== */}
        {activeSection === 'home' && (
          <div className="space-y-16 animate-fade-in">
            {/* Hero Brand Section */}
            <section className="text-center py-12 md:py-20 relative">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold mb-4">
                  <Award className="w-4 h-4" />
                  <span>مكتب توثيق معتمد من وزارة العدل</span>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    id="hero-get-docs"
                    onClick={() => setActiveSection('docs')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-[#d4af37] text-[#07080c] hover:bg-[#ebd074] transition-all duration-300 shadow-xl shadow-[#d4af37]/15 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>تحضير ملفك (الوثائق المطلوبة)</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Services Showcase */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">خدماتنا التوثيقية الشاملة</h2>
                <div className="w-16 h-1 bg-[#d4af37] mx-auto rounded-full" />
                <p className="text-sm text-gray-400 max-w-lg mx-auto">نصوغ عقودكم بدقة تامة لضمان مطابقتها لأحدث القوانين في الجزائر ومجلس النواب والعدالة.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sale and Real Estate */}
                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800/80 hover:border-[#d4af37]/30 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">العقود والمعاملات العقارية</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">بيع وشراء الشقق والأراضي، هبة العقارات، القسمة الودية بين الورثة، وإجراءات الشهر العقاري بالمحافظة.</p>
                  <button onClick={() => { setDocCategory('sale'); setActiveSection('docs'); }} className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 hover:underline">
                    <span>عرض الوثائق المطلوبة</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>

                {/* Corporate */}
                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800/80 hover:border-[#d4af37]/30 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">تأسيس وتعديل الشركات</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">كتابة القوانين الأساسية للشركات، زيادة رأس المال، التنازل عن الحصص وتعديل هياكل التسيير الإداري.</p>
                  <button onClick={() => { setDocCategory('company'); setActiveSection('docs'); }} className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 hover:underline">
                    <span>عرض الوثائق المطلوبة</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>

                {/* Power of Attorney */}
                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800/80 hover:border-[#d4af37]/30 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">الوكالات الشرعية والقانونية</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">تحرير الوكالات الخاصة والعامة لبيع العقارات والمركبات وتسيير الشركات والمؤسسات الإدارية.</p>
                  <button onClick={() => { setDocCategory('power'); setActiveSection('docs'); }} className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 hover:underline">
                    <span>عرض الوثائق المطلوبة</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>

                {/* Gifts */}
                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800/80 hover:border-[#d4af37]/30 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">عقود الهبة والوصية</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">توثيق ونقل الهبة للأصول والمنقولات للأقارب من الفروع أو الأصول وتعديل صلات القرابة والتركات.</p>
                  <button onClick={() => { setDocCategory('gift'); setActiveSection('docs'); }} className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 hover:underline">
                    <span>عرض الوثائق المطلوبة</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>

                {/* Declarations */}
                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800/80 hover:border-[#d4af37]/30 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">التصريحات الشرفية والكفالة</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">تحرير التصريحات والالتزامات الشخصية والتعهدات المالية والكفالات العائلية الرسمية لإيداعها لدى المصالح الحكومية.</p>
                  <button onClick={() => { setDocCategory('declare'); setActiveSection('docs'); }} className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 hover:underline">
                    <span>عرض الوثائق المطلوبة</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>

                {/* Consultations */}
                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800/80 hover:border-[#d4af37]/30 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">الاستشارات والتدقيق القانوني</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">استشارات مهنية مسبقة في مجال العقارات والشركات والتركات وقوانين الاستثمار لحمايتك قبل توقيع أي إقرار مالي.</p>
                  <button onClick={() => setActiveSection('booking')} className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 hover:underline">
                    <span>حجز موعد استشارة</span>
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Access Grid Banner */}
            <section className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-[#141620] to-[#0c0d13] p-8 md:p-12 rounded-2xl border border-gray-800">
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#d4af37] tracking-widest uppercase">ميزات تفاعلية حديثة</span>
                <h3 className="text-2xl font-bold text-white font-serif">هل تحضر لملف عقدك القادم؟</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  وفرنا لك أدوات تفاعلية كاملة تمكنك من مراجعة وتجهيز وثائقك بالكامل خطوة بخطوة، وحساب التكاليف الإجمالية والضرائب المستحقة للخزينة العمومية مباشرة من منزلك وبأعلى دقة قانونية متطابقة مع المراسيم الرسمية الجزائرية.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>مجهِّز ملفات تفاعلي</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>حاسبة ضرائب وشرائح رسوم دقيقة</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-sm rounded-xl bg-slate-900/50 border border-gray-800 p-6 space-y-4 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">تنويه هام للموكلين:</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    يُنصح دائماً بإحضار نسخ رقمية أو مستندات أصلية واضحة لتفادي أي تأخير إداري لدى الهيئات المشهرة للملف.
                  </p>
                  <div className="pt-2">
                    <button 
                      id="home-book-btn"
                      onClick={() => setActiveSection('booking')}
                      className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#d4af37] hover:bg-[#ebd074] text-[#07080c] transition-colors"
                    >
                      احجز موعداً إلكترونياً الآن
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Office Values & Info */}
            <section className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-[#0e1017] border border-gray-800 space-y-3">
                <div className="text-3xl text-[#d4af37] font-serif">٠١</div>
                <h4 className="text-base font-bold text-white">السرية والأمان المطلق</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  نحن نضمن الحفاظ التام على أسرار العقود والمعطيات الشخصية للمتعاملين والشركات مع التزام أخلاقي وقانوني صارم.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#0e1017] border border-gray-800 space-y-3">
                <div className="text-3xl text-[#d4af37] font-serif">٠٢</div>
                <h4 className="text-base font-bold text-white">المتابعة والتواصل الفوري</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  فريقنا يسهر على متابعة كل مراحل ملفك مع مصالح الضرائب، السجل التجاري، والشهر العقاري بشكل دوري ومستمر.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#0e1017] border border-gray-800 space-y-3">
                <div className="text-3xl text-[#d4af37] font-serif">٠٣</div>
                <h4 className="text-base font-bold text-white">النزاهة والعدالة التعاقدية</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  صياغة العقود المتوازنة التي تضمن حقوق جميع الأطراف دون تحيز، بهدف إرساء عقود سليمة خالية من الثغرات والنزاعات المستقبلية.
                </p>
              </div>
            </section>

            {/* Testimonials */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-semibold text-[#d4af37] tracking-widest uppercase">ثقة متبادلة</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">آراء الموكلين وشركائنا</h2>
                <div className="w-16 h-1 bg-[#d4af37] mx-auto rounded-full" />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-yellow-500 flex gap-0.5">★★★★★</div>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      "تعاملت مع مكتب الأستاذ بن علي علي لتوثيق عقد بيع شقة في الجزائر العاصمة، الخدمة كانت سريعة جداً وشرحوا لنا كل التفاصيل بخصوص الضرائب وكيفية حسابها بكل نزاهة."
                    </p>
                  </div>
                  <div className="mt-4 border-t border-gray-800 pt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">سميرة ب.</span>
                    <span className="text-[10px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full">عقد بيع عقاري</span>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-yellow-500 flex gap-0.5">★★★★★</div>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      "قمنا بتأسيس شركتنا ذات المسؤولية المحدودة بمرافقة رائعة من طرف الموثق، صياغة القانون الأساسي كانت مرنة وتراعي مصالح الشركاء والمسيرين بدقة فائقة."
                    </p>
                  </div>
                  <div className="mt-4 border-t border-gray-800 pt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">مؤسسة النور للبناء والترقية</span>
                    <span className="text-[10px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full">عقود شركات</span>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="text-yellow-500 flex gap-0.5">★★★★★</div>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      "فريق عمل متعاون ومحترف جداً. توجهت إليهم لإجراء وكالة تسيير خاصة لصالح والدي، شرحوا لي كافة الجوانب وأتممنا الإجراءات والتوقيع في غضون نصف ساعة فقط."
                    </p>
                  </div>
                  <div className="mt-4 border-t border-gray-800 pt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">كريم ل.</span>
                    <span className="text-[10px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full">وكالة خاصة</span>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Previews */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white font-serif">الأسئلة الشائعة والاستفسارات</h2>
                <div className="w-12 h-1 bg-[#d4af37] mx-auto rounded-full" />
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqData.map((faq, index) => (
                  <div 
                    key={index} 
                    className="rounded-xl border border-gray-800 bg-[#141620] overflow-hidden"
                  >
                    <button
                      id={`faq-toggle-${index}`}
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-right font-semibold text-white hover:bg-white/5 transition-all"
                    >
                      <span className="text-sm">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-[#d4af37] transition-transform duration-300 ${openFaq === index ? 'transform rotate-180' : ''}`} />
                    </button>
                    {openFaq === index && (
                      <div className="p-5 border-t border-gray-800 text-xs text-gray-400 leading-relaxed bg-[#0c0d13]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================== DOCUMENTS GUIDE SECTION ==================== */}
        {activeSection === 'docs' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Intro */}
            <div className="bg-gradient-to-r from-[#141620] to-[#0c0d13] p-8 rounded-2xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">تحضير الملف المسبق</span>
                <h2 className="text-3xl font-bold text-white font-serif">الدليل التفاعلي للوثائق المطلوبة</h2>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
                  اختر نوع الخدمة أو عقد المعاملة أدناه للحصول على قائمة دقيقة للملف الواجب تجهيزه قبل زيارة مكتبنا. يمكنك التحقق من الوثائق الجاهزة ومتابعة تقدم ملفك.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-72 relative">
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  id="doc-search"
                  type="text"
                  placeholder="ابحث عن وثيقة أو عقد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pr-10 pl-4 text-xs bg-slate-900 border border-gray-700 rounded-xl focus:outline-none focus:border-[#d4af37] text-white placeholder-gray-500 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Document Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-4">
              {documentCategories.map((cat) => (
                <button
                  key={cat.id}
                  id={`tab-doc-${cat.id}`}
                  onClick={() => { setDocCategory(cat.id); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    docCategory === cat.id 
                      ? 'bg-[#d4af37] text-[#07080c] shadow-lg shadow-[#d4af37]/15' 
                      : 'bg-[#141620] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.title}</span>
                </button>
              ))}
            </div>

            {/* Search results banner if searching */}
            {searchQuery && (
              <div className="bg-[#141620] p-4 rounded-xl border border-gray-800 text-xs flex items-center justify-between text-gray-300">
                <span>نتائج البحث عن: <strong className="text-[#d4af37]">"{searchQuery}"</strong></span>
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white underline">عرض الكل</button>
              </div>
            )}

            {/* Main Interactive Checklist and Details */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left List Pane (Checks) */}
              <div className="lg:col-span-2 space-y-6">
                {filteredDocCategories
                  .filter(cat => searchQuery ? true : cat.id === docCategory)
                  .map((cat) => (
                    <div key={cat.id} className="space-y-4">
                      {searchQuery && (
                        <h3 className="text-base font-bold text-[#d4af37] border-b border-gray-800 pb-1 flex items-center gap-2 font-serif">
                          {cat.icon}
                          <span>{cat.title}</span>
                        </h3>
                      )}
                      
                      <div className="space-y-3">
                        {cat.items.length === 0 ? (
                          <p className="text-xs text-gray-500 py-4">لا توجد وثائق مطابقة للبحث في هذا القسم.</p>
                        ) : (
                          cat.items.map((item) => {
                            const isChecked = !!checkedItems[item.id];
                            return (
                              <div 
                                key={item.id}
                                id={`doc-item-${item.id}`}
                                onClick={() => handleToggleCheck(item.id)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-4 ${
                                  isChecked 
                                    ? 'bg-[#d4af37]/5 border-[#d4af37]/40 shadow-inner' 
                                    : 'bg-[#141620] border-gray-800/80 hover:border-gray-700'
                                }`}
                              >
                                {/* Custom check box */}
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 transition-all shrink-0 ${
                                  isChecked 
                                    ? 'bg-[#d4af37] border-[#d4af37] text-[#07080c]' 
                                    : 'border-gray-600 hover:border-[#d4af37]'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                                </div>

                                <div className="space-y-1 flex-1">
                                  <h4 className={`text-sm font-bold transition-all ${isChecked ? 'text-[#d4af37] line-through decoration-gray-500/50' : 'text-white'}`}>
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                                  {item.tip && (
                                    <div className="mt-2 text-[11px] text-gray-400 bg-white/5 px-2.5 py-1.5 rounded border border-white/5 flex items-start gap-1.5">
                                      <Info className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                                      <span>{item.tip}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                ))}
              </div>

              {/* Right Side Card (Interactive status, actions, scheduler) */}
              <div className="space-y-6">
                
                {/* Progress Card */}
                <div className="p-6 rounded-xl bg-gradient-to-b from-[#11131c] to-[#0c0d13] border border-gray-800 space-y-4">
                  <div className="flex items-center gap-2 text-[#d4af37]">
                    <FileCheck className="w-5 h-5" />
                    <h3 className="font-bold text-sm">مستكشف جاهزية ملفك</h3>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-400">
                      <span>نسبة الإنجاز المحققة:</span>
                      <span className="text-[#d4af37] font-bold font-serif">{progressPercent}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#ebd074] to-[#d4af37] h-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 leading-normal">
                    {progressPercent === 100 ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        رائع! ملفك جاهز بالكامل للتوثيق لدى مكتبنا.
                      </span>
                    ) : progressPercent > 0 ? (
                      <span>لقد جهزت {checkedItemsCount} من أصل {totalItemsCount} وثائق مطلوبة لـ {documentCategories.find(c => c.id === docCategory)?.title}.</span>
                    ) : (
                      <span>قم بتحديد الوثائق التي قمت بتحضيرها مسبقاً لتفادي النقص.</span>
                    )}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      id="clear-checklist"
                      onClick={handleClearChecklist}
                      disabled={checkedItemsCount === 0}
                      className="flex-1 py-2 text-[11px] font-bold rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      إعادة تعيين
                    </button>
                    <button
                      id="print-checklist"
                      onClick={() => window.print()}
                      className="flex-1 py-2 text-[11px] font-bold rounded-lg bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20 border border-[#d4af37]/20 flex items-center justify-center gap-1 transition-all"
                    >
                      <Printer className="w-3 h-3" />
                      <span>طباعة الدليل</span>
                    </button>
                  </div>
                </div>

                {/* Direct Contact Notice */}
                <div className="p-6 rounded-xl bg-[#141620] border border-gray-800 space-y-4">
                  <h4 className="font-bold text-white text-sm">حالة خاصة أو ملف غير مدرج؟</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    بعض الحالات الخاصة تتطلب مراجعة قضائية أو وثائق تكميلية دقيقة. لا تتردد في الاتصال بمكتبنا مباشرة عبر الهاتف أو حجز استشارة.
                  </p>
                  <div className="space-y-2 pt-1">
                    <a href="tel:0796337384" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-[#141620] hover:bg-slate-800 text-white border border-gray-700 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>اتصل بالمكتب: 0796337384</span>
                    </a>
                    <button
                      id="doc-go-booking"
                      onClick={() => setActiveSection('booking')}
                      className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#d4af37] text-[#07080c] hover:bg-[#ebd074] transition-all"
                    >
                      احجز موعد مقابلة
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ==================== CALCULATOR SECTION ==================== */}
        {activeSection === 'calculator' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Description */}
            <div className="bg-gradient-to-r from-[#141620] to-[#0c0d13] p-8 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">الشفافية أولاً</span>
              <h2 className="text-3xl font-bold text-white font-serif mt-1">حاسبة رسوم ومصاريف التوثيق</h2>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 max-w-2xl">
                أداة محاكاة تفاعلية لحساب الرسوم الرسمية ومصاريف تسجيل العقود بالخزينة العمومية وأتعاب الموثق المعتمدة في الجزائر. التقديرات تحسب بناءً على الشرائح الرسمية المحددة بالمرسوم التنفيذي المنظم لمهنة الموثقين.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form Input Card */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-[#141620] border border-gray-800 space-y-6">
                <h3 className="text-base font-bold text-white border-b border-gray-800 pb-3 font-serif">معطيات العقد</h3>
                
                <div className="space-y-4">
                  {/* Transaction Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-300">نوع المعاملة أو العقد:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="calc-type-sale"
                        onClick={() => { setCalcType('sale'); if (calcValue === '3000') setCalcValue('5000000'); }}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                          calcType === 'sale' 
                            ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]' 
                            : 'bg-slate-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        بيع عقاري / تجاري
                      </button>
                      <button
                        id="calc-type-gift"
                        onClick={() => { setCalcType('gift'); if (calcValue === '3000') setCalcValue('5000000'); }}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                          calcType === 'gift' 
                            ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]' 
                            : 'bg-slate-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        عقد هبة شرعية
                      </button>
                      <button
                        id="calc-type-company"
                        onClick={() => { setCalcType('company'); setCalcValue('1000000'); }}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                          calcType === 'company' 
                            ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]' 
                            : 'bg-slate-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        تأسيس شركة / مؤسسة
                      </button>
                      <button
                        id="calc-type-power"
                        onClick={() => { setCalcType('power'); setCalcValue('3000'); }}
                        className={`py-3 px-3 rounded-xl text-xs font-bold border transition-all ${
                          calcType === 'power' 
                            ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37]' 
                            : 'bg-slate-900 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        وكالة شرعية / عامة
                      </button>
                    </div>
                  </div>

                  {/* Transaction Value Input */}
                  {(calcType === 'sale' || calcType === 'gift' || calcType === 'company') && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-300">
                          {calcType === 'company' ? 'رأس مال الشركة المقترح:' : 'القيمة الإجمالية للعقار / المال الموهوب:'}
                        </label>
                        
                        {/* Currency unit switcher */}
                        <button 
                          id="unit-switcher"
                          onClick={() => {
                            if (useCentimes) {
                              // Change to DA
                              const valDA = parseFloat(calcValue) * 10000;
                              setCalcValue(isNaN(valDA) ? '' : valDA.toString());
                            } else {
                              // Change to Centimes
                              const valCent = parseFloat(calcValue) / 10000;
                              setCalcValue(isNaN(valCent) ? '' : valCent.toString());
                            }
                            setUseCentimes(!useCentimes);
                          }}
                          className="text-[10px] text-[#d4af37] hover:underline flex items-center gap-1 bg-[#d4af37]/5 px-2 py-0.5 rounded-md border border-[#d4af37]/10 font-bold"
                        >
                          {useCentimes ? 'التحويل إلى الدينار (دج)' : 'التحويل إلى سنتيم (الملايين)'}
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          id="calc-value-input"
                          type="number"
                          value={calcValue}
                          onChange={(e) => setCalcValue(e.target.value)}
                          placeholder="أدخل القيمة..."
                          className="w-full py-3.5 pr-4 pl-20 text-sm bg-slate-900 border border-gray-800 focus:border-[#d4af37] focus:outline-none rounded-xl text-white font-semibold font-serif"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                          {useCentimes ? 'مليون سنتيم' : 'دينار جزائري (دج)'}
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-gray-400">
                        {useCentimes ? (
                          <span>القيمة المقابلة: <strong className="text-gray-300">{(parseFloat(calcValue) * 10000 || 0).toLocaleString('ar-DZ')} دج</strong></span>
                        ) : (
                          <span>القيمة المقابلة بالعامية: <strong className="text-gray-300">{(parseFloat(calcValue) / 10000 || 0).toLocaleString('ar-DZ')} مليون سنتيم</strong></span>
                        )}
                      </div>
                    </div>
                  )}

                  {calcType === 'power' && (
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-gray-800/80 text-xs text-gray-400 leading-normal space-y-1">
                      <p className="text-white font-bold">الوكالات والشهادات الإدارية البسيطة:</p>
                      <p>تخضع الوكالات لرسوم ثابتة وأتعاب مقننة محددة سلفاً ولا ترتبط بقيم مالية متغيرة.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Output Result Card */}
              <div className="lg:col-span-3 p-8 rounded-2xl bg-gradient-to-b from-[#11131c] to-[#0c0d14] border border-gray-800 space-y-6">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                    <Scale className="w-5 h-5 text-[#d4af37]" />
                    <span>تفصيل تكاليف ومصاريف التوثيق</span>
                  </h3>
                  <span className="text-[11px] text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">تقديري رسمي</span>
                </div>

                {calculateFees ? (
                  <div className="space-y-6">
                    {/* Primary Big Result */}
                    <div className="text-center bg-white/5 p-6 rounded-2xl border border-white/5">
                      <span className="text-xs text-gray-400 block mb-1">المبلغ الإجمالي التقريبي للتسجيل والتوثيق:</span>
                      <span className="text-3xl font-extrabold text-[#d4af37] font-serif block">
                        {formatNumber(calculateFees.totalOverall)}
                      </span>
                      <span className="text-xs text-gray-400 block mt-1">
                        يعادل حوالي: <strong className="text-gray-300">{formatNumber(calculateFees.totalOverall, true)}</strong>
                      </span>
                    </div>

                    {/* Breakdown details */}
                    <div className="space-y-3.5">
                      {/* Section A: Notary Part */}
                      <div>
                        <span className="text-xs font-bold text-[#d4af37] block mb-2">أولاً: أتعاب الموثق والمكتب (بما فيها الضريبة والملف)</span>
                        <div className="bg-slate-900/40 border border-gray-800 rounded-xl p-4 space-y-2.5 text-xs">
                          <div className="flex justify-between text-gray-400">
                            <span>الأتعاب الصافية (حسب الشرائح):</span>
                            <span className="text-white font-serif">{formatNumber(calculateFees.notaryFees)}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>الضريبة على القيمة المضافة (TVA 19%):</span>
                            <span className="text-white font-serif">{formatNumber(calculateFees.tva)}</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>مصاريف إدارية وملف العقد (ثابتة):</span>
                            <span className="text-white font-serif">{formatNumber(calculateFees.fixedExpenses)}</span>
                          </div>
                          <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-gray-300">
                            <span>مجموع مستحقات الموثق والمكتب:</span>
                            <span className="text-[#d4af37] font-serif">{formatNumber(calculateFees.totalNotaryCost)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section B: Government Part */}
                      <div>
                        <span className="text-xs font-bold text-blue-400 block mb-2">ثانياً: حقوق التسجيل والمحافظة (تدفع للخزينة العمومية)</span>
                        <div className="bg-slate-900/40 border border-gray-800 rounded-xl p-4 space-y-2.5 text-xs">
                          <div className="flex justify-between text-gray-400">
                            <span>حقوق التسجيل لمديرية الضرائب {calcType === 'gift' ? '(1%)' : '(5%)'}:</span>
                            <span className="text-white font-serif">{formatNumber(calculateFees.registrationTax)}</span>
                          </div>
                          {calculateFees.landRegistryTax > 0 && (
                            <div className="flex justify-between text-gray-400">
                              <span>حقوق الشهر والمحافظة العقارية (1%):</span>
                              <span className="text-white font-serif">{formatNumber(calculateFees.landRegistryTax)}</span>
                            </div>
                          )}
                          <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-gray-300">
                            <span>مجموع الضرائب المحصلة لصالح الخزينة:</span>
                            <span className="text-blue-400 font-serif">{formatNumber(calculateFees.totalGovernmentTaxes)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-[11px] text-gray-400 leading-relaxed flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>
                        <strong>ملاحظة قانونية:</strong> الموثق يقوم بتحصيل حقوق التسجيل والرهن والشهر ودفعها بالكامل لمفتشية التسجيل والضرائب والمحافظة العقارية في غضون الآجال القانونية. هذه الحاسبة تعطي أرقاماً تقديرية تقريبية قد تتغير بشكل بسيط حسب فحص طبيعة وموقع العقار ومطابقة المخططات.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-500 space-y-2">
                    <AlertCircle className="w-8 h-8 text-gray-600" />
                    <span>الرجاء إدخال قيمة مالية صالحة لإجراء الحساب التقديري.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== BOOKING SECTION ==================== */}
        {activeSection === 'booking' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Intro */}
            <div className="bg-gradient-to-r from-[#141620] to-[#0c0d13] p-8 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">تسهيل الإجراءات</span>
              <h2 className="text-3xl font-bold text-white font-serif mt-1">حجز موعد إلكتروني وتنسيق الاستشارات</h2>
              <p className="text-xs text-gray-400 leading-relaxed mt-2 max-w-2xl">
                وفر وقتك واحجز موعداً مسبقاً لمقابلة الموثق لمراجعة ملفك أو توقيع عقودك. بعد إرسال طلبك، سيقوم المكتب بتأكيد الموعد مباشرة، وسوف تستلم تذكرة حجز إلكترونية صالحة للمطابقة بالمكتب.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form card */}
              <div className="lg:col-span-3 p-8 rounded-2xl bg-[#141620] border border-gray-800">
                {!bookingSuccess ? (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <h3 className="text-base font-bold text-white border-b border-gray-800 pb-3 font-serif">تعبئة بيانات الموكل</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-300">الاسم واللقب بالكامل: <span className="text-red-500">*</span></label>
                        <input
                          id="booking-name"
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="مثال: محمد بلقاسم"
                          className="w-full py-2.5 px-4 text-xs bg-slate-900 border border-gray-800 focus:border-[#d4af37] focus:outline-none rounded-xl text-white font-medium"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-300">رقم الهاتف النشط: <span className="text-red-500">*</span></label>
                        <input
                          id="booking-phone"
                          type="tel"
                          required
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="مثال: 0672480527"
                          className="w-full py-2.5 px-4 text-xs bg-slate-900 border border-gray-800 focus:border-[#d4af37] focus:outline-none rounded-xl text-white font-medium text-right"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Service Select */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-300">نوع الخدمة / العقد المطلوبة:</label>
                        <select
                          id="booking-service"
                          value={bookingService}
                          onChange={(e) => setBookingService(e.target.value)}
                          className="w-full py-2.5 px-4 text-xs bg-slate-900 border border-gray-800 focus:border-[#d4af37] focus:outline-none rounded-xl text-white font-medium"
                        >
                          <option value="عقد بيع عقاري">عقد بيع عقاري</option>
                          <option value="عقد هبة">عقد هبة شرعية</option>
                          <option value="وكالة خاصة / عامة">وكالة خاصة / عامة</option>
                          <option value="تأسيس شركة">تأسيس شركة</option>
                          <option value="قسمة عقارية / فرائض">قسمة عقارية / فرائض</option>
                          <option value="تصريحات وإثباتات إدارية">تصريحات وإثباتات إدارية</option>
                          <option value="استشارة قانونية وتوثيقية">استشارة قانونية وتوثيقية</option>
                        </select>
                      </div>

                      {/* Date picker */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-300">تاريخ المقابلة المفضل: <span className="text-red-500">*</span></label>
                        <input
                          id="booking-date"
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full py-2.5 px-4 text-xs bg-slate-900 border border-gray-800 focus:border-[#d4af37] focus:outline-none rounded-xl text-white font-medium text-right"
                        />
                      </div>

                      {/* Time Slot Select */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-300">الفترة الزمنية المفضلة: <span className="text-red-500">*</span></label>
                        <select
                          id="booking-time"
                          required
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full py-2.5 px-4 text-xs bg-slate-900 border border-gray-800 focus:border-[#d4af37] focus:outline-none rounded-xl text-white font-medium"
                        >
                          <option value="">اختر التوقيت...</option>
                          <option value="صباحاً: 09:00 — 10:30">صباحاً: 09:00 — 10:30</option>
                          <option value="صباحاً: 10:30 — 12:00">صباحاً: 10:30 — 12:00</option>
                          <option value="مساءً: 13:00 — 14:30">مساءً: 13:00 — 14:30</option>
                          <option value="مساءً: 14:30 — 16:00">مساءً: 14:30 — 16:00</option>
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-300">تفاصيل إضافية أو شرح لحالتك (اختياري):</label>
                      <textarea
                        id="booking-notes"
                        rows={3}
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="مثال: العقار عبارة عن شقة سكنية F3 ورثناها عن الوالد ونريد قسمتها بالتراضي..."
                        className="w-full py-2.5 px-4 text-xs bg-slate-900 border border-gray-800 focus:border-[#d4af37] focus:outline-none rounded-xl text-white font-medium"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        id="booking-submit-btn"
                        type="submit"
                        className="w-full py-3.5 rounded-xl font-bold bg-[#d4af37] hover:bg-[#ebd074] text-[#07080c] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/15"
                      >
                        <Calendar className="w-5 h-5" />
                        <span>إرسال طلب الحجز وتوليد التذكرة</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Success Voucher Display */
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                        <Check className="w-6 h-6 stroke-[3px]" />
                      </div>
                      <h3 className="text-lg font-bold text-white">تم تسجيل طلب الحجز بنجاح!</h3>
                      <p className="text-xs text-gray-400">تلقينا طلبك وسيقوم المكتب بالاتصال بك لتأكيد حضورك النهائي.</p>
                    </div>

                    {/* Styled Ticket Voucher */}
                    <div id="booking-voucher" className="relative bg-slate-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
                      {/* Ticket Jagged Edges decorative */}
                      <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#141620] border border-gray-800" />
                      <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#141620] border border-gray-800" />

                      <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                            <span className="font-serif font-bold text-xs">ب</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#aa841f] font-bold block leading-none">مكتب الموثق بن علي</span>
                            <span className="text-[9px] text-gray-500 block">سند حجز موعد إلكتروني</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#d4af37]" dir="ltr">{bookingSuccess.receiptNumber}</span>
                      </div>

                      <div className="grid grid-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500 block mb-0.5">اسم الموكل:</span>
                          <span className="text-white font-bold">{bookingSuccess.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-0.5">رقم الهاتف:</span>
                          <span className="text-white font-bold" dir="ltr">{bookingSuccess.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-0.5">الخدمة المطلوبة:</span>
                          <span className="text-[#d4af37] font-bold">{bookingSuccess.service}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-0.5">تاريخ الموعد:</span>
                          <span className="text-white font-bold font-serif">{bookingSuccess.date}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500 block mb-0.5">الفترة الزمنية:</span>
                          <span className="text-white font-bold">{bookingSuccess.time}</span>
                        </div>
                        {bookingSuccess.notes && (
                          <div className="col-span-2 border-t border-gray-850 pt-2 text-[11px] text-gray-400">
                            <span className="text-gray-500 block font-bold mb-0.5">ملاحظاتك:</span>
                            <p className="italic">"{bookingSuccess.notes}"</p>
                          </div>
                        )}
                      </div>

                      {/* Fake barcode image generator using CSS lines */}
                      <div className="pt-4 border-t border-dashed border-gray-800 flex flex-col items-center gap-2">
                        <div className="h-10 w-full max-w-[200px] flex items-center justify-between bg-white/5 p-1 rounded-sm">
                          {Array.from({ length: 28 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="bg-gray-400 h-full" 
                              style={{ width: i % 3 === 0 ? '4px' : i % 5 === 0 ? '1px' : '2px', opacity: i % 7 === 0 ? '0.4' : '0.9' }} 
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-mono text-gray-500">رقم السند المرجعي للتوثيق</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="booking-print-voucher"
                        onClick={() => window.print()}
                        className="flex-1 py-3 font-bold rounded-xl bg-white/5 border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center gap-2 transition-all text-xs"
                      >
                        <Printer className="w-4 h-4 text-[#d4af37]" />
                        <span>طباعة التذكرة</span>
                      </button>
                      <button
                        id="booking-new"
                        onClick={handleResetBooking}
                        className="flex-1 py-3 font-bold rounded-xl bg-[#d4af37] hover:bg-[#ebd074] text-[#07080c] transition-all text-xs"
                      >
                        حجز موعد جديد
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Informative Side Card */}
              <div className="lg:col-span-2 space-y-6">
                {/* Working hours card */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-[#11131c] to-[#0c0d13] border border-gray-800 space-y-4">
                  <h3 className="font-bold text-sm text-[#d4af37] border-b border-gray-800 pb-2 flex items-center gap-2 font-serif">
                    <Clock className="w-4 h-4" />
                    <span>أوقات العمل والاستقبال بمكتبنا</span>
                  </h3>
                  
                  <ul className="space-y-3 text-xs">
                    <li className="flex justify-between items-center text-gray-400">
                      <span>السبت — الأربعاء:</span>
                      <span className="text-white font-semibold">08:30 صباحاً — 16:30 مساءً</span>
                    </li>
                    <li className="flex justify-between items-center text-gray-400">
                      <span>الخميس:</span>
                      <span className="text-white font-semibold">08:30 صباحاً — 13:00 زوالاً</span>
                    </li>
                    <li className="flex justify-between items-center text-gray-400 border-t border-gray-800/50 pt-2">
                      <span>الجمعة:</span>
                      <span className="text-red-400 font-bold">عطلة أسبوعية</span>
                    </li>
                  </ul>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-gray-400 leading-normal flex items-start gap-1.5">
                    <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>لتفادي الانتظار الطويل، يرجى دائماً الالتزام بالموعد المحدد في التذكرة الإلكترونية والحضور قبلها بـ 10 دقائق.</span>
                  </div>
                </div>

                {/* Location / Direct Coordinates Card */}
                <div className="p-6 rounded-2xl bg-[#141620] border border-gray-800 space-y-4">
                  <h3 className="font-bold text-sm text-white border-b border-gray-800 pb-2 flex items-center gap-2 font-serif">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <span>موقع مكتب الموثق</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <p className="text-gray-300 leading-relaxed font-medium">
                      شارع ديدوش مراد (بالقرب من محطة المترو)، الجزائر الوسطى، الجزائر العاصمة.
                    </p>
                    <div className="pt-2 space-y-2">
                      <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-[#141620] hover:bg-slate-800 text-white border border-gray-700 transition-colors">
                        <MapPin className="w-4 h-4 text-[#d4af37]" />
                        <span>فتح موقع Google Maps</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0b0c10] border-t border-gray-800/80 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* About Branch */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa841f] flex items-center justify-center border border-yellow-500/10">
                  <span className="font-serif text-sm font-bold text-[#07080c]">ب</span>
                </div>
                <h4 className="text-sm font-bold text-white font-serif">مكتب الموثق بن علي علي</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                مكتب عمومي معتمد يتمتع بخبرة مهنية واسعة وسجل حافل من التميز والدقة القانونية، يقدم الخدمات لشركائه من الأفراد والمؤسسات الاقتصادية في الجزائر.
              </p>
            </div>

            {/* Quick sections */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-serif border-b border-gray-800 pb-1.5 inline-block">روابط سريعة</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><button onClick={() => setActiveSection('home')} className="hover:text-[#d4af37] transition-colors">الصفحة الرئيسية</button></li>
                <li><button onClick={() => setActiveSection('docs')} className="hover:text-[#d4af37] transition-colors">الدليل التفاعلي للوثائق</button></li>
                <li><button onClick={() => setActiveSection('calculator')} className="hover:text-[#d4af37] transition-colors">حاسبة رسوم العقود</button></li>
                <li><button onClick={() => setActiveSection('booking')} className="hover:text-[#d4af37] transition-colors">حجز مقابلة / موعد</button></li>
              </ul>
            </div>

            {/* Hours */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-serif border-b border-gray-800 pb-1.5 inline-block">أوقات العمل</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>السبت — الأربعاء: 08:30 — 16:30</li>
                <li>الخميس: 08:30 — 13:00</li>
                <li className="text-red-400">الجمعة: عطلة قانونية</li>
              </ul>
            </div>

            {/* Contact coordinates */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-serif border-b border-gray-800 pb-1.5 inline-block">التواصل المباشر</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                  <span dir="ltr">0796 33 73 84</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>عبر واتساب: +213 672 48 05 27</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>ديدوش مراد، الجزائر الوسطى، الجزائر العاصمة.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800/80 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500">
            <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} — مكتب الموثق المعتمد بن علي علي</p>
            <p className="mt-2 md:mt-0">تم التصميم باحترافية وأمان قانوني مطلق</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
