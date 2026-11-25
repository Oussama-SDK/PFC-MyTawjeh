import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const content = {
  fr: {
    dir: 'ltr',
    back: "Retour à l'accueil",
    badge: 'Document légal',
    title: 'Mentions légales',
    updated: 'Dernière mise à jour : juin 2026',
    sections: [
      {
        num: '1', title: "Présentation de l'éditeur",
        type: 'grid',
        rows: [
          { label: 'Nom de la plateforme', value: 'My-Tawjihe' },
          { label: 'Nature', value: "Plateforme d'orientation académique & professionnelle" },
          { label: 'Pays', value: 'Maroc 🇲🇦' },
          { label: 'Statut', value: 'Projet étudiant / Startup éditoriale' },
        ],
      },
      {
        num: '2', title: 'Coordonnées de contact',
        type: 'contact',
        items: ['contact@my-tawjihe.ma', 'www.my-tawjihe.ma', 'Maroc'],
      },
      {
        num: '3', title: 'Hébergeur du site',
        type: 'text',
        text: "Le site My-Tawjihe est hébergé par des services cloud reconnus (Vercel / Railway / VPS) conformes aux standards de sécurité internationaux. Les données sont stockées sur des serveurs situés en Europe ou au Maroc selon la nature du service.",
      },
      {
        num: '4', title: 'Propriété intellectuelle',
        type: 'paras',
        paras: [
          "L'ensemble des contenus présents sur la plateforme My-Tawjihe — textes, images, logos, interfaces, code source, données — est protégé par le droit de la propriété intellectuelle et est la propriété exclusive de ses créateurs.",
          "Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, par quelque moyen que ce soit, est interdite sans l'autorisation expresse et préalable de l'équipe My-Tawjihe.",
          "Les marques et logos présents sur le site sont déposés. Toute utilisation non autorisée constitue une contrefaçon passible de sanctions.",
        ],
      },
      {
        num: '5', title: "Responsabilité de l'éditeur",
        type: 'paras',
        paras: [
          "My-Tawjihe s'efforce de fournir des informations exactes et à jour. Cependant, l'éditeur ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur le site.",
          "L'éditeur décline toute responsabilité pour les dommages directs ou indirects résultant de l'utilisation des informations disponibles sur la plateforme.",
          "Les liens hypertextes vers des sites tiers sont fournis à titre informatif. My-Tawjihe ne saurait être tenu responsable du contenu de ces sites externes.",
        ],
      },
    ],
    footerLinks: [
      { label: 'Politique de confidentialité', to: '/politique-de-confidentialite' },
      { label: "Conditions d'utilisation", to: '/conditions-utilisation' },
      { label: 'Politique de cookies', to: '/cookies' },
    ],
  },
  en: {
    dir: 'ltr',
    back: 'Back to home',
    badge: 'Legal document',
    title: 'Legal Notice',
    updated: 'Last updated: June 2026',
    sections: [
      {
        num: '1', title: 'About the Publisher',
        type: 'grid',
        rows: [
          { label: 'Platform name', value: 'My-Tawjihe' },
          { label: 'Nature', value: 'Academic & professional guidance platform' },
          { label: 'Country', value: 'Morocco 🇲🇦' },
          { label: 'Status', value: 'Student project / Editorial startup' },
        ],
      },
      {
        num: '2', title: 'Contact Information',
        type: 'contact',
        items: ['contact@my-tawjihe.ma', 'www.my-tawjihe.ma', 'Morocco'],
      },
      {
        num: '3', title: 'Hosting',
        type: 'text',
        text: "My-Tawjihe is hosted on recognized cloud services (Vercel / Railway / VPS) that comply with international security standards. Data is stored on servers located in Europe or Morocco depending on the service.",
      },
      {
        num: '4', title: 'Intellectual Property',
        type: 'paras',
        paras: [
          "All content on the My-Tawjihe platform — texts, images, logos, interfaces, source code, data — is protected by intellectual property law and is the exclusive property of its creators.",
          "Any reproduction, representation, modification, publication or adaptation of any element of the site, by any means, is prohibited without the express prior authorization of the My-Tawjihe team.",
          "Brands and logos on the site are registered. Any unauthorized use constitutes infringement subject to legal penalties.",
        ],
      },
      {
        num: '5', title: "Publisher's Liability",
        type: 'paras',
        paras: [
          "My-Tawjihe strives to provide accurate and up-to-date information. However, the publisher cannot guarantee the accuracy, completeness or timeliness of the information published on the site.",
          "The publisher disclaims any liability for direct or indirect damages resulting from the use of information available on the platform.",
          "Hyperlinks to third-party sites are provided for informational purposes. My-Tawjihe cannot be held responsible for the content of these external sites.",
        ],
      },
    ],
    footerLinks: [
      { label: 'Privacy Policy', to: '/politique-de-confidentialite' },
      { label: 'Terms of Use', to: '/conditions-utilisation' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  },
  ar: {
    dir: 'rtl',
    back: 'العودة إلى الرئيسية',
    badge: 'وثيقة قانونية',
    title: 'البيانات القانونية',
    updated: 'آخر تحديث: يونيو 2026',
    sections: [
      {
        num: '١', title: 'تقديم الناشر',
        type: 'grid',
        rows: [
          { label: 'اسم المنصة', value: 'My-Tawjihe' },
          { label: 'الطبيعة', value: 'منصة إرشاد أكاديمي ومهني' },
          { label: 'البلد', value: 'المغرب 🇲🇦' },
          { label: 'الوضع', value: 'مشروع طلابي / ناشئة تحريرية' },
        ],
      },
      {
        num: '٢', title: 'معلومات الاتصال',
        type: 'contact',
        items: ['contact@my-tawjihe.ma', 'www.my-tawjihe.ma', 'المغرب'],
      },
      {
        num: '٣', title: 'استضافة الموقع',
        type: 'text',
        text: "يُستضاف موقع My-Tawjihe على خدمات سحابية معتمدة (Vercel / Railway / VPS) مطابقة لمعايير الأمان الدولية. يتم تخزين البيانات على خوادم في أوروبا أو المغرب حسب طبيعة الخدمة.",
      },
      {
        num: '٤', title: 'الملكية الفكرية',
        type: 'paras',
        paras: [
          "جميع المحتويات الموجودة على منصة My-Tawjihe — النصوص والصور والشعارات والواجهات والكود المصدري والبيانات — محمية بموجب قانون الملكية الفكرية وهي ملك حصري لمنشئيها.",
          "يُحظر أي نسخ أو تمثيل أو تعديل أو نشر أو تكييف لأي عنصر من عناصر الموقع بأي وسيلة كانت دون إذن صريح ومسبق من فريق My-Tawjihe.",
          "العلامات التجارية والشعارات الموجودة على الموقع مسجلة. يُعدّ أي استخدام غير مصرح به تقليداً احتيالياً يخضع للعقوبات القانونية.",
        ],
      },
      {
        num: '٥', title: 'مسؤولية الناشر',
        type: 'paras',
        paras: [
          "تسعى My-Tawjihe إلى تقديم معلومات دقيقة ومحدّثة. غير أن الناشر لا يستطيع ضمان دقة المعلومات المنشورة أو اكتمالها أو حداثتها.",
          "يتبرأ الناشر من أي مسؤولية عن الأضرار المباشرة أو غير المباشرة الناجمة عن استخدام المعلومات المتاحة على المنصة.",
          "تُقدَّم الروابط التشعبية لمواقع الطرف الثالث لأغراض إعلامية فقط. لا يمكن تحميل My-Tawjihe المسؤولية عن محتوى هذه المواقع الخارجية.",
        ],
      },
    ],
    footerLinks: [
      { label: 'سياسة الخصوصية', to: '/politique-de-confidentialite' },
      { label: 'شروط الاستخدام', to: '/conditions-utilisation' },
      { label: 'سياسة ملفات تعريف الارتباط', to: '/cookies' },
    ],
  },
};

export default function MentionsLegales() {
  const { language } = useAuth();
  const lang = (language === 'ar' || language === 'en') ? language : 'fr';
  const c = content[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = c.title + ' — My-Tawjihe';
  }, [lang, c.title]);

  return (
    <div className="min-h-screen bg-[#050d1a] text-white" dir={c.dir}>
      <div className="border-b border-white/10 bg-[#0a1628]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={lang === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
            <span className="text-sm font-medium">{c.back}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {c.badge}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{c.title}</h1>
          <p className="text-gray-400 text-lg">{c.updated}</p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          {c.sections.map((s) => (
            <section key={s.num}>
              <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm font-bold">{s.num}</span>
                {s.title}
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                {s.type === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(s as any).rows.map((r: any) => (
                      <div key={r.label}>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{r.label}</p>
                        <p className="text-white font-medium">{r.value}</p>
                      </div>
                    ))}
                  </div>
                )}
                {s.type === 'contact' && (
                  <div className="space-y-3">
                    {(s as any).items.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-blue-400">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                {s.type === 'text' && <p>{(s as any).text}</p>}
                {s.type === 'paras' && (
                  <div className="space-y-4">
                    {(s as any).paras.map((p: string, i: number) => <p key={i}>{p}</p>)}
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-sm text-gray-500">
          {c.footerLinks.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-blue-400 transition-colors">{l.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
