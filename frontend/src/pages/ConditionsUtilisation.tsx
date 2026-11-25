import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const content = {
  fr: {
    dir: 'ltr',
    back: "Retour à l'accueil",
    badge: 'CGU',
    title: "Conditions générales d'utilisation",
    updated: 'Dernière mise à jour : juin 2026',
    intro: "En accédant à la plateforme My-Tawjihe, vous acceptez pleinement et sans réserve les présentes conditions générales d'utilisation.",
    sections: [
      {
        num: '1', title: "Objet du site",
        text: "My-Tawjihe est une plateforme numérique d'orientation académique et professionnelle destinée aux élèves, étudiants et parents marocains.",
        list: [
          "Des recommandations d'orientation personnalisées basées sur l'intelligence artificielle",
          "Des informations sur les filières, établissements et concours au Maroc et à l'étranger",
          "Un accès à des ressources pédagogiques et des annales de concours",
          "Un suivi des résultats et des notifications académiques",
        ],
      },
      {
        num: '2', title: "Conditions d'accès",
        text: "L'accès à certaines fonctionnalités nécessite la création d'un compte. L'inscription est gratuite. Pour créer un compte, vous devez :",
        list: [
          "Fournir des informations exactes, complètes et à jour",
          "Être âgé(e) d'au moins 13 ans (avec accord parental si mineur)",
          "Disposer d'une adresse email valide et active",
          "Accepter les présentes CGU et la politique de confidentialité",
        ],
      },
      {
        num: '3', title: "Obligations des utilisateurs",
        doLabel: '✅ Ce que vous devez faire',
        doList: [
          "Utiliser la plateforme à des fins légales et personnelles",
          "Respecter les droits des autres utilisateurs",
          "Maintenir la confidentialité de vos identifiants de connexion",
          "Signaler tout contenu inapproprié",
        ],
        dontLabel: '❌ Ce qui est interdit',
        dontList: [
          "Publier des informations fausses ou trompeuses",
          "Tenter d'accéder à des données d'autres utilisateurs",
          "Utiliser des robots, scripts ou outils automatisés",
          "Reproduire ou revendre les contenus de la plateforme",
        ],
      },
      {
        num: '4', title: "Responsabilités",
        text: "My-Tawjihe ne saurait être tenu responsable :",
        list: [
          "Des interruptions temporaires dues à des opérations de maintenance",
          "Des erreurs ou inexactitudes dans les contenus fournis par des tiers",
          "Des décisions prises par les utilisateurs sur la base des informations disponibles",
        ],
      },
      {
        num: '5', title: "Propriété intellectuelle",
        text: "Tous les contenus publiés sur My-Tawjihe (textes, visuels, base de données, algorithmes d'IA) sont protégés par les lois relatives à la propriété intellectuelle. Toute exploitation non autorisée est strictement interdite.",
      },
      {
        num: '6', title: "Suspension des comptes",
        text: "My-Tawjihe se réserve le droit de suspendre ou supprimer tout compte sans préavis en cas de :",
        list: [
          "Violation des présentes conditions générales d'utilisation",
          "Activité frauduleuse ou comportement abusif",
          "Fourniture d'informations fausses lors de l'inscription",
        ],
      },
      {
        num: '7', title: "Droit applicable",
        text: "Les présentes conditions sont régies par le droit marocain. En cas de litige, les tribunaux compétents de Casablanca seront seuls compétents.",
      },
    ],
    footerLinks: [
      { label: 'Mentions légales', to: '/mentions-legales' },
      { label: 'Politique de confidentialité', to: '/politique-de-confidentialite' },
      { label: 'Politique de cookies', to: '/cookies' },
    ],
  },
  en: {
    dir: 'ltr',
    back: 'Back to home',
    badge: 'Terms of Use',
    title: 'Terms of Use',
    updated: 'Last updated: June 2026',
    intro: 'By accessing the My-Tawjihe platform, you fully and unconditionally accept these terms of use.',
    sections: [
      {
        num: '1', title: 'Purpose of the Site',
        text: 'My-Tawjihe is a digital academic and professional guidance platform for Moroccan students and parents.',
        list: [
          'AI-based personalized orientation recommendations',
          'Information on courses, institutions and competitions in Morocco and abroad',
          'Access to educational resources and past exam papers',
          'Academic results tracking and notifications',
        ],
      },
      {
        num: '2', title: 'Access Conditions',
        text: 'Access to certain features requires creating an account. Registration is free. To create an account, you must:',
        list: [
          'Provide accurate, complete and up-to-date information',
          'Be at least 13 years old (parental consent required if minor)',
          'Have a valid and active email address',
          'Accept these Terms of Use and the Privacy Policy',
        ],
      },
      {
        num: '3', title: 'User Obligations',
        doLabel: '✅ What you should do',
        doList: [
          'Use the platform for legal and personal purposes',
          'Respect the rights of other users',
          'Keep your login credentials confidential',
          'Report any inappropriate content',
        ],
        dontLabel: '❌ What is prohibited',
        dontList: [
          'Publishing false or misleading information',
          'Attempting to access other users\' data',
          'Using bots, scripts or automated tools',
          'Reproducing or reselling platform content',
        ],
      },
      {
        num: '4', title: 'Liabilities',
        text: 'My-Tawjihe cannot be held responsible for:',
        list: [
          'Temporary interruptions due to maintenance operations',
          'Errors or inaccuracies in third-party content',
          'Decisions made by users based on available information',
        ],
      },
      {
        num: '5', title: 'Intellectual Property',
        text: 'All content published on My-Tawjihe (texts, visuals, databases, AI algorithms) is protected by intellectual property laws. Any unauthorized use is strictly prohibited.',
      },
      {
        num: '6', title: 'Account Suspension',
        text: 'My-Tawjihe reserves the right to suspend or delete any account without notice in the event of:',
        list: [
          'Violation of these terms of use',
          'Fraudulent activity or abusive behavior',
          'Providing false information during registration',
        ],
      },
      {
        num: '7', title: 'Applicable Law',
        text: 'These terms are governed by Moroccan law. In the event of a dispute, the competent courts of Casablanca shall have exclusive jurisdiction.',
      },
    ],
    footerLinks: [
      { label: 'Legal Notice', to: '/mentions-legales' },
      { label: 'Privacy Policy', to: '/politique-de-confidentialite' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  },
  ar: {
    dir: 'rtl',
    back: 'العودة إلى الرئيسية',
    badge: 'الشروط العامة',
    title: 'شروط الاستخدام',
    updated: 'آخر تحديث: يونيو 2026',
    intro: 'بالوصول إلى منصة My-Tawjihe، فإنك توافق بشكل كامل وغير مشروط على شروط الاستخدام هذه.',
    sections: [
      {
        num: '١', title: 'موضوع الموقع',
        text: 'My-Tawjihe منصة رقمية للإرشاد الأكاديمي والمهني موجهة للطلاب وأولياء الأمور المغاربة.',
        list: [
          'توصيات توجيه مخصصة تعتمد على الذكاء الاصطناعي',
          'معلومات حول الشعب والمؤسسات والمسابقات في المغرب وخارجه',
          'الوصول إلى موارد تربوية وأسئلة المسابقات السابقة',
          'متابعة النتائج والإشعارات الأكاديمية',
        ],
      },
      {
        num: '٢', title: 'شروط الوصول',
        text: 'يتطلب الوصول إلى بعض الميزات إنشاء حساب. التسجيل مجاني. لإنشاء حساب يجب عليك:',
        list: [
          'تقديم معلومات دقيقة وكاملة ومحدّثة',
          'أن يكون عمرك 13 سنة على الأقل (موافقة الوالدين مطلوبة للقاصرين)',
          'امتلاك بريد إلكتروني صالح ونشط',
          'قبول هذه الشروط وسياسة الخصوصية',
        ],
      },
      {
        num: '٣', title: 'التزامات المستخدمين',
        doLabel: '✅ ما يجب عليك فعله',
        doList: [
          'استخدام المنصة لأغراض قانونية وشخصية',
          'احترام حقوق المستخدمين الآخرين',
          'الحفاظ على سرية بيانات تسجيل الدخول',
          'الإبلاغ عن أي محتوى غير لائق',
        ],
        dontLabel: '❌ ما هو محظور',
        dontList: [
          'نشر معلومات كاذبة أو مضللة',
          'محاولة الوصول إلى بيانات المستخدمين الآخرين',
          'استخدام الروبوتات أو البرامج النصية أو الأدوات الآلية',
          'إعادة إنتاج أو إعادة بيع محتويات المنصة',
        ],
      },
      {
        num: '٤', title: 'المسؤوليات',
        text: 'لا يمكن تحميل My-Tawjihe المسؤولية عن:',
        list: [
          'الانقطاعات المؤقتة الناجمة عن عمليات الصيانة',
          'الأخطاء أو عدم الدقة في المحتوى المقدم من أطراف ثالثة',
          'القرارات التي يتخذها المستخدمون بناءً على المعلومات المتاحة',
        ],
      },
      {
        num: '٥', title: 'الملكية الفكرية',
        text: 'جميع المحتويات المنشورة على My-Tawjihe (النصوص، المرئيات، قواعد البيانات، خوارزميات الذكاء الاصطناعي) محمية بموجب قوانين الملكية الفكرية. يُحظر أي استخدام غير مصرح به.',
      },
      {
        num: '٦', title: 'تعليق الحسابات',
        text: 'تحتفظ My-Tawjihe بالحق في تعليق أو حذف أي حساب دون إشعار مسبق في حالة:',
        list: [
          'انتهاك هذه الشروط العامة للاستخدام',
          'نشاط احتيالي أو سلوك مسيء',
          'تقديم معلومات كاذبة عند التسجيل',
        ],
      },
      {
        num: '٧', title: 'القانون المطبق',
        text: 'تخضع هذه الشروط للقانون المغربي. في حالة نزاع، تختص محاكم الدار البيضاء حصرياً بالنظر فيه.',
      },
    ],
    footerLinks: [
      { label: 'البيانات القانونية', to: '/mentions-legales' },
      { label: 'سياسة الخصوصية', to: '/politique-de-confidentialite' },
      { label: 'سياسة ملفات تعريف الارتباط', to: '/cookies' },
    ],
  },
};

export default function ConditionsUtilisation() {
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
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-purple-400 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {c.badge}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{c.title}</h1>
          <p className="text-gray-400 text-lg mb-2">{c.updated}</p>
          <p className="text-gray-400">{c.intro}</p>
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          {c.sections.map((s) => (
            <section key={s.num}>
              <h2 className="text-2xl font-semibold text-white mb-5 flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm font-bold">{s.num}</span>
                {s.title}
              </h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                {s.text && <p>{s.text}</p>}
                {'doList' in s ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <p className="text-green-400 font-medium text-sm mb-2">{(s as any).doLabel}</p>
                      <ul className="space-y-1 text-sm">
                        {(s as any).doList.map((item: string, i: number) => (
                          <li key={i}>— {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <p className="text-red-400 font-medium text-sm mb-2">{(s as any).dontLabel}</p>
                      <ul className="space-y-1 text-sm">
                        {(s as any).dontList.map((item: string, i: number) => (
                          <li key={i}>— {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : ('list' in s && (s as any).list) ? (
                  <ul className="space-y-2">
                    {(s as any).list.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
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
