import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const content = {
  fr: {
    dir: 'ltr',
    back: "Retour à l'accueil",
    badge: 'Cookies',
    title: 'Politique de cookies',
    updated: 'Dernière mise à jour : juin 2026',
    intro: "My-Tawjihe utilise des cookies pour améliorer votre expérience de navigation. Cette page vous explique quels cookies nous utilisons et comment les gérer.",
    s1title: "Qu'est-ce qu'un cookie ?",
    s1text: "Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite sur un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée et d'autres paramètres. Les cookies ne contiennent pas de virus et ne peuvent pas endommager votre appareil.",
    s2title: 'Types de cookies utilisés',
    cookieTypes: [
      { type: 'Cookies essentiels', badge: 'Toujours actifs', color: 'green', desc: "Indispensables au fonctionnement du site. Ils permettent la navigation, l'authentification et la sécurité de la session.", examples: ['Session utilisateur', "Jeton d'authentification (JWT)", 'Préférences de langue'] },
      { type: 'Cookies de performance', badge: 'Analytique', color: 'blue', desc: "Collectent des informations anonymes sur la façon dont les visiteurs utilisent le site.", examples: ['Pages les plus visitées', 'Temps passé sur le site', 'Erreurs rencontrées'] },
      { type: 'Cookies de préférence', badge: 'Personnalisation', color: 'purple', desc: "Mémorisent vos choix et personnalisent votre expérience sur la plateforme.", examples: ['Langue préférée (FR/AR/EN)', "Thème d'affichage", 'Filtres de recherche'] },
      { type: 'Cookies tiers', badge: 'Optionnel', color: 'orange', desc: "Déposés par des services externes intégrés à la plateforme.", examples: ['Google Maps / OpenStreetMap', 'Boutons de partage réseaux sociaux'] },
    ],
    s3title: 'Finalités des cookies',
    s3items: [
      'Assurer le bon fonctionnement et la sécurité de la plateforme',
      'Maintenir votre session active lors de votre navigation',
      'Mémoriser vos préférences (langue, thème, filtres)',
      'Analyser les comportements de navigation pour améliorer nos services',
      'Personnaliser le contenu et les recommandations affichées',
    ],
    s4title: 'Gestion et désactivation',
    s4intro: 'Vous pouvez à tout moment gérer vos préférences de cookies selon votre navigateur :',
    browsers: [
      { browser: 'Google Chrome', path: 'Paramètres → Confidentialité → Cookies' },
      { browser: 'Mozilla Firefox', path: 'Paramètres → Vie privée → Cookies' },
      { browser: 'Safari', path: 'Préférences → Confidentialité → Cookies' },
      { browser: 'Microsoft Edge', path: 'Paramètres → Confidentialité → Cookies' },
    ],
    s4warning: '⚠️ Attention',
    s4warningText: "La désactivation des cookies essentiels peut altérer le fonctionnement de la plateforme, notamment la connexion à votre compte.",
    s5title: "Consentement de l'utilisateur",
    s5paras: [
      "Lors de votre première visite sur My-Tawjihe, une bannière de consentement vous invite à accepter ou refuser les différentes catégories de cookies.",
      "Les cookies essentiels sont déposés sans consentement préalable car ils sont nécessaires au fonctionnement du site.",
      "Votre choix est conservé pendant 12 mois. Passé ce délai, votre consentement sera à nouveau demandé.",
    ],
    dpoLabel: 'Contacter le DPO : privacy@my-tawjihe.ma',
    footerLinks: [
      { label: 'Mentions légales', to: '/mentions-legales' },
      { label: 'Politique de confidentialité', to: '/politique-de-confidentialite' },
      { label: "Conditions d'utilisation", to: '/conditions-utilisation' },
    ],
  },
  en: {
    dir: 'ltr',
    back: 'Back to home',
    badge: 'Cookies',
    title: 'Cookie Policy',
    updated: 'Last updated: June 2026',
    intro: 'My-Tawjihe uses cookies to improve your browsing experience. This page explains which cookies we use and how to manage them.',
    s1title: 'What is a cookie?',
    s1text: "A cookie is a small text file placed on your device when you visit a website. It allows the site to remember information about your visit, such as your preferred language and other settings. Cookies do not contain viruses and cannot harm your device.",
    s2title: 'Types of cookies used',
    cookieTypes: [
      { type: 'Essential cookies', badge: 'Always active', color: 'green', desc: 'Indispensable for the site to function. They enable navigation, authentication and session security.', examples: ['User session', 'Authentication token (JWT)', 'Language preferences'] },
      { type: 'Performance cookies', badge: 'Analytics', color: 'blue', desc: 'Collect anonymous information about how visitors use the site.', examples: ['Most visited pages', 'Time spent on the site', 'Errors encountered'] },
      { type: 'Preference cookies', badge: 'Personalization', color: 'purple', desc: 'Remember your choices and personalize your experience on the platform.', examples: ['Preferred language (FR/AR/EN)', 'Display theme', 'Search filters'] },
      { type: 'Third-party cookies', badge: 'Optional', color: 'orange', desc: 'Placed by external services integrated into the platform.', examples: ['Google Maps / OpenStreetMap', 'Social sharing buttons'] },
    ],
    s3title: 'Cookie purposes',
    s3items: [
      'Ensure the proper functioning and security of the platform',
      'Keep your session active while browsing',
      'Remember your preferences (language, theme, filters)',
      'Analyze browsing behavior to improve our services',
      'Personalize displayed content and recommendations',
    ],
    s4title: 'Managing & disabling cookies',
    s4intro: 'You can manage your cookie preferences at any time through your browser:',
    browsers: [
      { browser: 'Google Chrome', path: 'Settings → Privacy → Cookies' },
      { browser: 'Mozilla Firefox', path: 'Settings → Privacy → Cookies' },
      { browser: 'Safari', path: 'Preferences → Privacy → Cookies' },
      { browser: 'Microsoft Edge', path: 'Settings → Privacy → Cookies' },
    ],
    s4warning: '⚠️ Warning',
    s4warningText: 'Disabling essential cookies may affect the functioning of the platform, in particular logging into your account.',
    s5title: 'User consent',
    s5paras: [
      'On your first visit to My-Tawjihe, a consent banner invites you to accept or decline the various cookie categories.',
      'Essential cookies are placed without prior consent as they are necessary for the site to function.',
      'Your choice is kept for 12 months. After this period, your consent will be requested again.',
    ],
    dpoLabel: 'Contact DPO: privacy@my-tawjihe.ma',
    footerLinks: [
      { label: 'Legal Notice', to: '/mentions-legales' },
      { label: 'Privacy Policy', to: '/politique-de-confidentialite' },
      { label: 'Terms of Use', to: '/conditions-utilisation' },
    ],
  },
  ar: {
    dir: 'rtl',
    back: 'العودة إلى الرئيسية',
    badge: 'ملفات تعريف الارتباط',
    title: 'سياسة ملفات تعريف الارتباط',
    updated: 'آخر تحديث: يونيو 2026',
    intro: 'تستخدم My-Tawjihe ملفات تعريف الارتباط لتحسين تجربة التصفح. تشرح هذه الصفحة الملفات التي نستخدمها وكيفية إدارتها.',
    s1title: 'ما هو ملف تعريف الارتباط؟',
    s1text: "ملف تعريف الارتباط هو ملف نصي صغير يُودَع على جهازك عند زيارة موقع ويب. يسمح للموقع بتذكر معلومات حول زيارتك مثل لغتك المفضلة والإعدادات الأخرى. لا تحتوي هذه الملفات على فيروسات ولا يمكنها إلحاق الضرر بجهازك.",
    s2title: 'أنواع ملفات تعريف الارتباط المستخدمة',
    cookieTypes: [
      { type: 'ملفات الارتباط الأساسية', badge: 'نشطة دائماً', color: 'green', desc: 'ضرورية لعمل الموقع. تتيح التنقل والمصادقة وأمان الجلسة.', examples: ['جلسة المستخدم', 'رمز المصادقة (JWT)', 'تفضيلات اللغة'] },
      { type: 'ملفات الارتباط التحليلية', badge: 'تحليلية', color: 'blue', desc: 'تجمع معلومات مجهولة عن طريقة استخدام الزوار للموقع.', examples: ['الصفحات الأكثر زيارة', 'الوقت المستغرق في الموقع', 'الأخطاء المواجهة'] },
      { type: 'ملفات الارتباط التفضيلية', badge: 'تخصيص', color: 'purple', desc: 'تتذكر اختياراتك وتخصص تجربتك على المنصة.', examples: ['اللغة المفضلة (FR/AR/EN)', 'نمط العرض', 'عوامل التصفية'] },
      { type: 'ملفات ارتباط الطرف الثالث', badge: 'اختياري', color: 'orange', desc: 'تضعها خدمات خارجية مدمجة في المنصة.', examples: ['Google Maps / OpenStreetMap', 'أزرار المشاركة على الشبكات الاجتماعية'] },
    ],
    s3title: 'أغراض ملفات تعريف الارتباط',
    s3items: [
      'ضمان الأداء السليم والأمان للمنصة',
      'الحفاظ على جلستك نشطة أثناء التصفح',
      'تذكر تفضيلاتك (اللغة، النمط، عوامل التصفية)',
      'تحليل سلوك التصفح لتحسين خدماتنا',
      'تخصيص المحتوى والتوصيات المعروضة',
    ],
    s4title: 'إدارة ملفات تعريف الارتباط وتعطيلها',
    s4intro: 'يمكنك في أي وقت إدارة تفضيلات ملفات تعريف الارتباط من خلال متصفحك:',
    browsers: [
      { browser: 'Google Chrome', path: 'الإعدادات ← الخصوصية ← ملفات تعريف الارتباط' },
      { browser: 'Mozilla Firefox', path: 'الإعدادات ← الخصوصية ← ملفات تعريف الارتباط' },
      { browser: 'Safari', path: 'التفضيلات ← الخصوصية ← ملفات تعريف الارتباط' },
      { browser: 'Microsoft Edge', path: 'الإعدادات ← الخصوصية ← ملفات تعريف الارتباط' },
    ],
    s4warning: '⚠️ تنبيه',
    s4warningText: 'قد يؤثر تعطيل ملفات الارتباط الأساسية على أداء المنصة، لا سيما تسجيل الدخول إلى حسابك.',
    s5title: 'موافقة المستخدم',
    s5paras: [
      'عند أول زيارة لك لـ My-Tawjihe، تظهر لافتة موافقة تدعوك لقبول أو رفض فئات ملفات تعريف الارتباط المختلفة.',
      'يتم وضع ملفات الارتباط الأساسية دون موافقة مسبقة لأنها ضرورية لعمل الموقع.',
      'يتم الاحتفاظ باختيارك لمدة 12 شهراً. بعد انتهاء هذه المدة، ستُطلب موافقتك مجدداً.',
    ],
    dpoLabel: 'التواصل مع مسؤول البيانات: privacy@my-tawjihe.ma',
    footerLinks: [
      { label: 'البيانات القانونية', to: '/mentions-legales' },
      { label: 'سياسة الخصوصية', to: '/politique-de-confidentialite' },
      { label: 'شروط الاستخدام', to: '/conditions-utilisation' },
    ],
  },
};

export default function PolitiqueCookies() {
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
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-orange-400 text-sm mb-6">
            <span>🍪</span>
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
              <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 text-sm font-bold">1</span>
              {c.s1title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p>{c.s1text}</p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 text-sm font-bold">2</span>
              {c.s2title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              {c.cookieTypes.map((item) => (
                <div key={item.type} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-white font-semibold">{item.type}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/20">{item.badge}</span>
                  </div>
                  <p className="text-sm mb-3">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.examples.map((ex) => (
                      <span key={ex} className="text-xs bg-white/10 rounded-lg px-3 py-1 text-gray-300">{ex}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 text-sm font-bold">3</span>
              {c.s3title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <ul className="space-y-3">
                {c.s3items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 text-sm font-bold">4</span>
              {c.s4title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <p>{c.s4intro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {c.browsers.map((item) => (
                  <div key={item.browser} className="bg-white/5 rounded-xl p-4">
                    <p className="text-white font-medium text-sm mb-1">{item.browser}</p>
                    <p className="text-gray-400 text-xs">{item.path}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-400 text-sm font-medium mb-1">{c.s4warning}</p>
                <p className="text-sm text-gray-400">{c.s4warningText}</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 text-sm font-bold">5</span>
              {c.s5title}
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              {c.s5paras.map((p, i) => <p key={i}>{p}</p>)}
              <a href="mailto:privacy@my-tawjihe.ma" className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-xl px-5 py-3 hover:bg-orange-500/30 transition-colors font-medium text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {c.dpoLabel}
              </a>
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
