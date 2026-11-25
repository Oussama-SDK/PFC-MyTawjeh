import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const content = {
  fr: {
    dir: 'ltr',
    back: "Retour à l'accueil",
    badge: 'Protection des données',
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : juin 2026',
    intro: "My-Tawjihe s'engage à protéger la vie privée de ses utilisateurs. Cette politique décrit comment nous collectons, utilisons et protégeons vos données personnelles.",
    s1title: 'Données collectées',
    s1intro: 'Dans le cadre de l\'utilisation de la plateforme My-Tawjihe, nous pouvons être amenés à collecter les données suivantes :',
    dataItems: [
      { icon: '👤', label: 'Identité', value: 'Nom, prénom, date de naissance' },
      { icon: '📧', label: 'Contact', value: 'Adresse email, numéro de téléphone' },
      { icon: '🎓', label: 'Parcours scolaire', value: 'Niveau d\'études, filière, résultats scolaires' },
      { icon: '📄', label: 'Documents', value: 'CV, lettres de motivation (si déposés)' },
      { icon: '🌐', label: 'Navigation', value: 'Adresse IP, cookies, pages visitées' },
      { icon: '⚙️', label: 'Préférences', value: 'Langue, paramètres de compte' },
    ],
    s2title: 'Finalités du traitement',
    s2items: [
      'Créer et gérer votre compte utilisateur sur la plateforme',
      'Vous fournir des recommandations d\'orientation personnalisées via l\'IA',
      'Vous envoyer des notifications relatives aux concours, bourses et actualités académiques',
      'Améliorer nos services grâce à l\'analyse des comportements de navigation',
      'Assurer la sécurité et prévenir les fraudes sur la plateforme',
      'Répondre à vos demandes de support et de contact',
    ],
    s3title: 'Protection et sécurité',
    s3intro: 'My-Tawjihe met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles.',
    secItems: [
      { icon: '🔐', title: 'Chiffrement', desc: 'Toutes les communications sont chiffrées via HTTPS/TLS' },
      { icon: '🛡️', title: 'Accès limité', desc: 'Seuls les membres autorisés accèdent aux données' },
      { icon: '🔄', title: 'Sauvegardes', desc: 'Sauvegardes régulières et sécurisées de vos données' },
    ],
    s4title: 'Durée de conservation',
    s4intro: 'Vos données personnelles sont conservées pendant la durée nécessaire à l\'accomplissement des finalités pour lesquelles elles ont été collectées :',
    retentionRows: [
      { type: 'Données de compte', duration: 'Durée d\'activité + 3 ans après suppression' },
      { type: 'Logs de navigation', duration: '12 mois maximum' },
      { type: 'Documents (CV, etc.)', duration: 'Jusqu\'à suppression par l\'utilisateur' },
      { type: 'Données de contact', duration: '3 ans à compter du dernier contact' },
    ],
    s5title: 'Vos droits',
    s5intro: 'Conformément à la législation applicable, vous disposez des droits suivants :',
    rights: [
      { right: 'Droit d\'accès', desc: 'Obtenir une copie de vos données personnelles' },
      { right: 'Droit de rectification', desc: 'Corriger des données inexactes ou incomplètes' },
      { right: 'Droit à l\'effacement', desc: 'Demander la suppression de vos données' },
      { right: 'Droit à la portabilité', desc: 'Recevoir vos données dans un format structuré' },
      { right: 'Droit d\'opposition', desc: 'S\'opposer au traitement de vos données' },
      { right: 'Droit à la limitation', desc: 'Limiter le traitement de vos données' },
    ],
    s6title: 'Contact DPO',
    s6text: 'Pour exercer vos droits ou pour toute question relative à vos données personnelles, contactez-nous à :',
    s6note: 'Nous nous engageons à répondre à toute demande dans un délai de 30 jours.',
    footerLinks: [
      { label: 'Mentions légales', to: '/mentions-legales' },
      { label: 'Conditions d\'utilisation', to: '/conditions-utilisation' },
      { label: 'Politique de cookies', to: '/cookies' },
    ],
  },
  en: {
    dir: 'ltr',
    back: 'Back to home',
    badge: 'Data protection',
    title: 'Privacy Policy',
    updated: 'Last updated: June 2026',
    intro: 'My-Tawjihe is committed to protecting its users\' privacy. This policy describes how we collect, use and protect your personal data.',
    s1title: 'Data Collected',
    s1intro: 'When using the My-Tawjihe platform, we may collect the following data:',
    dataItems: [
      { icon: '👤', label: 'Identity', value: 'Name, surname, date of birth' },
      { icon: '📧', label: 'Contact', value: 'Email address, phone number' },
      { icon: '🎓', label: 'Academic background', value: 'Study level, field, academic results' },
      { icon: '📄', label: 'Documents', value: 'CV, cover letters (if submitted)' },
      { icon: '🌐', label: 'Browsing', value: 'IP address, cookies, pages visited' },
      { icon: '⚙️', label: 'Preferences', value: 'Language, account settings' },
    ],
    s2title: 'Processing Purposes',
    s2items: [
      'Create and manage your user account on the platform',
      'Provide you with personalized orientation recommendations via AI',
      'Send you notifications about competitions, scholarships and academic news',
      'Improve our services through browsing behavior analysis',
      'Ensure security and prevent fraud on the platform',
      'Respond to your support and contact requests',
    ],
    s3title: 'Protection & Security',
    s3intro: 'My-Tawjihe implements appropriate technical and organizational measures to protect your personal data.',
    secItems: [
      { icon: '🔐', title: 'Encryption', desc: 'All communications are encrypted via HTTPS/TLS' },
      { icon: '🛡️', title: 'Limited access', desc: 'Only authorized team members access data' },
      { icon: '🔄', title: 'Backups', desc: 'Regular and secure backups of your data' },
    ],
    s4title: 'Retention Period',
    s4intro: 'Your personal data is kept for the time necessary to fulfill the purposes for which it was collected:',
    retentionRows: [
      { type: 'Account data', duration: 'Activity period + 3 years after deletion' },
      { type: 'Navigation logs', duration: 'Maximum 12 months' },
      { type: 'Documents (CV, etc.)', duration: 'Until deleted by user' },
      { type: 'Contact data', duration: '3 years from last contact' },
    ],
    s5title: 'Your Rights',
    s5intro: 'Under applicable law, you have the following rights:',
    rights: [
      { right: 'Right of access', desc: 'Obtain a copy of your personal data' },
      { right: 'Right of rectification', desc: 'Correct inaccurate or incomplete data' },
      { right: 'Right to erasure', desc: 'Request deletion of your data' },
      { right: 'Right to portability', desc: 'Receive your data in a structured format' },
      { right: 'Right to object', desc: 'Object to the processing of your data' },
      { right: 'Right to restriction', desc: 'Limit the processing of your data' },
    ],
    s6title: 'DPO Contact',
    s6text: 'To exercise your rights or for any question regarding your personal data, contact us at:',
    s6note: 'We are committed to responding to any request within 30 days.',
    footerLinks: [
      { label: 'Legal Notice', to: '/mentions-legales' },
      { label: 'Terms of Use', to: '/conditions-utilisation' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  },
  ar: {
    dir: 'rtl',
    back: 'العودة إلى الرئيسية',
    badge: 'حماية البيانات',
    title: 'سياسة الخصوصية',
    updated: 'آخر تحديث: يونيو 2026',
    intro: 'تلتزم My-Tawjihe بحماية خصوصية مستخدميها. تصف هذه السياسة كيفية جمع بياناتك الشخصية واستخدامها وحمايتها.',
    s1title: 'البيانات المجمعة',
    s1intro: 'عند استخدام منصة My-Tawjihe، قد نقوم بجمع البيانات التالية:',
    dataItems: [
      { icon: '👤', label: 'الهوية', value: 'الاسم، اللقب، تاريخ الميلاد' },
      { icon: '📧', label: 'التواصل', value: 'البريد الإلكتروني، رقم الهاتف' },
      { icon: '🎓', label: 'المسار الدراسي', value: 'المستوى الدراسي، الشعبة، النتائج' },
      { icon: '📄', label: 'الوثائق', value: 'السيرة الذاتية، رسائل التحفيز (عند رفعها)' },
      { icon: '🌐', label: 'التصفح', value: 'عنوان IP، الكوكيز، الصفحات المزارة' },
      { icon: '⚙️', label: 'التفضيلات', value: 'اللغة، إعدادات الحساب' },
    ],
    s2title: 'أغراض المعالجة',
    s2items: [
      'إنشاء وإدارة حسابك على المنصة',
      'تزويدك بتوصيات توجيه مخصصة عبر الذكاء الاصطناعي',
      'إرسال إشعارات بشأن المسابقات والمنح والأخبار الأكاديمية',
      'تحسين خدماتنا من خلال تحليل سلوك التصفح',
      'ضمان الأمان ومنع الاحتيال على المنصة',
      'الرد على طلبات الدعم والتواصل',
    ],
    s3title: 'الحماية والأمان',
    s3intro: 'تنفذ My-Tawjihe تدابير تقنية وتنظيمية مناسبة لحماية بياناتك الشخصية.',
    secItems: [
      { icon: '🔐', title: 'التشفير', desc: 'جميع الاتصالات مشفرة عبر HTTPS/TLS' },
      { icon: '🛡️', title: 'وصول محدود', desc: 'فقط الأعضاء المخوّلون يصلون إلى البيانات' },
      { icon: '🔄', title: 'النسخ الاحتياطي', desc: 'نسخ احتياطية منتظمة وآمنة لبياناتك' },
    ],
    s4title: 'مدة الاحتفاظ',
    s4intro: 'يتم الاحتفاظ ببياناتك الشخصية طوال المدة اللازمة لتحقيق الأغراض التي جُمعت من أجلها:',
    retentionRows: [
      { type: 'بيانات الحساب', duration: 'مدة النشاط + 3 سنوات بعد الحذف' },
      { type: 'سجلات التصفح', duration: '12 شهراً كحد أقصى' },
      { type: 'الوثائق (السيرة الذاتية...)', duration: 'حتى حذفها من قِبل المستخدم' },
      { type: 'بيانات التواصل', duration: '3 سنوات من آخر تواصل' },
    ],
    s5title: 'حقوقك',
    s5intro: 'وفقاً للتشريع المعمول به، تتمتع بالحقوق التالية:',
    rights: [
      { right: 'حق الوصول', desc: 'الحصول على نسخة من بياناتك الشخصية' },
      { right: 'حق التصحيح', desc: 'تصحيح البيانات غير الدقيقة أو غير المكتملة' },
      { right: 'حق المحو', desc: 'طلب حذف بياناتك' },
      { right: 'حق النقل', desc: 'استلام بياناتك بتنسيق منظم' },
      { right: 'حق الاعتراض', desc: 'الاعتراض على معالجة بياناتك' },
      { right: 'حق التقييد', desc: 'تقييد معالجة بياناتك' },
    ],
    s6title: 'التواصل بشأن البيانات',
    s6text: 'لممارسة حقوقك أو لأي سؤال يتعلق ببياناتك الشخصية، تواصل معنا على:',
    s6note: 'نلتزم بالرد على أي طلب خلال 30 يوماً.',
    footerLinks: [
      { label: 'البيانات القانونية', to: '/mentions-legales' },
      { label: 'شروط الاستخدام', to: '/conditions-utilisation' },
      { label: 'سياسة ملفات تعريف الارتباط', to: '/cookies' },
    ],
  },
};

export default function PolitiqueConfidentialite() {
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
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-green-400 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {c.badge}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{c.title}</h1>
          <p className="text-gray-400 text-lg mb-2">{c.updated}</p>
          <p className="text-gray-400">{c.intro}</p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">1</span>
              {c.s1title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="mb-4">{c.s1intro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {c.dataItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{item.label}</p>
                      <p className="text-gray-400 text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">2</span>
              {c.s2title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <ul className="space-y-3">
                {c.s2items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">3</span>
              {c.s3title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="mb-4">{c.s3intro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {c.secItems.map((item) => (
                  <div key={item.title} className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-white font-medium text-sm mb-1">{item.title}</p>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">4</span>
              {c.s4title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="mb-4">{c.s4intro}</p>
              <div className="space-y-2">
                {c.retentionRows.map((row) => (
                  <div key={row.type} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-white font-medium text-sm">{row.type}</span>
                    <span className="text-gray-400 text-sm">{row.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">5</span>
              {c.s5title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="mb-4">{c.s5intro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {c.rights.map((item) => (
                  <div key={item.right} className="bg-white/5 rounded-xl p-4">
                    <p className="text-green-400 font-medium text-sm mb-1">{item.right}</p>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm font-bold">6</span>
              {c.s6title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="mb-4">{c.s6text}</p>
              <a href="mailto:privacy@my-tawjihe.ma" className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-5 py-3 hover:bg-green-500/30 transition-colors font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                privacy@my-tawjihe.ma
              </a>
              <p className="text-gray-500 text-sm mt-4">{c.s6note}</p>
            </div>
          </section>
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
