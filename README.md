# MyTawjeh — Guide de démarrage

**🇫🇷 Français** | [🇲🇦 العربية](#mytawjeh--دليل-تشغيل-المشروع)

Plateforme intelligente d'orientation académique pour les étudiants marocains, construite avec React + Node.js + MongoDB.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org) — version 18 ou plus récente
- [MongoDB](https://www.mongodb.com) — base de données (locale ou Atlas)
- Une clé API [Anthropic](https://console.anthropic.com) pour l'intelligence artificielle

---

## 1. Installation du projet

```bash
# Cloner le dépôt
git clone https://github.com/anisyntax/My-Tawjihe.git
cd My-Tawjihe

# Installer les dépendances à la racine
npm install

# Installer les dépendances du frontend
cd frontend && npm install && cd ..

# Installer les dépendances du serveur
cd backend/server && npm install && cd ../..
```

---

## 2. Configuration des variables d'environnement

```bash
cd backend/server
cp .env.example .env
```

Ouvrez le fichier `.env` et modifiez les valeurs suivantes :

```env
MONGO_URI=mongodb://localhost:27017/mytawjeh
JWT_SECRET=mettez_une_cle_secrete_ici
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
```

Pour générer une clé JWT secrète :

```bash
npm run generate-secret
```

---

## 3. Lancer MongoDB

**En local (Windows) :**

```bash
cd backend/server
npm run mongo
```

Ou lancez MongoDB manuellement s'il est installé sur votre machine.

---

## 4. Lancer le projet

Depuis le dossier racine, lancez le frontend et le serveur ensemble :

```bash
npm run dev
```

Ou séparément :

```bash
# Serveur uniquement (port 5000)
npm run dev:backend

# Frontend uniquement (port 5173)
npm run dev:frontend
```

Ouvrez le navigateur sur : **http://localhost:5173**

---

## 5. Ajouter les données de démonstration

```bash
cd backend/server

# Créer les comptes utilisateurs de démonstration
node scripts/seedUsers.js

# Ajouter toutes les données (concours + exercices + contenu arabe)
npm run seed:all
```

### Comptes de démonstration

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| Élève | eleve1@test.com | password |
| Professeur | prof@test.com | password |
| Parent | parent@test.com | password |
| Administrateur | admin@test.com | password |

---

## 6. Structure du projet

```
My-Tawjihe/
├── frontend/          ← Interface React + TypeScript + Tailwind
│   └── src/
│       ├── dashboard/ ← Tableaux de bord (élève, professeur, parent, admin)
│       └── translations/ ← Traductions (fr / en / ar)
├── backend/
│   └── server/
│       ├── models/    ← Modèles MongoDB
│       ├── routes/    ← Routes de l'API
│       └── scripts/   ← Scripts de données
└── package.json       ← Commandes principales
```

---

## 7. Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lancer le frontend et le serveur ensemble |
| `npm run dev:frontend` | Lancer le frontend uniquement |
| `npm run dev:backend` | Lancer le serveur uniquement |
| `cd backend/server && npm run seed:all` | Ajouter toutes les données de démonstration |
| `cd backend/server && node scripts/seedUsers.js` | Créer les utilisateurs de démonstration |

---

## Langues prises en charge

La plateforme prend en charge 3 langues, avec le RTL pour l'arabe :
- 🇫🇷 Français
- 🇬🇧 Anglais
- 🇲🇦 Arabe

---
---

# MyTawjeh — دليل تشغيل المشروع

[🇫🇷 Français](#mytawjeh--guide-de-démarrage) | **🇲🇦 العربية**

منصة توجيه أكاديمي ذكية للطلاب المغاربة، مبنية بـ React + Node.js + MongoDB.

---

## المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

- [Node.js](https://nodejs.org) — الإصدار 18 أو أحدث
- [MongoDB](https://www.mongodb.com) — قاعدة البيانات (محلي أو Atlas)
- مفتاح API من [Anthropic](https://console.anthropic.com) للذكاء الاصطناعي

---

## 1. تثبيت المشروع

```bash
# استنساخ المستودع
git clone https://github.com/anisyntax/My-Tawjihe.git
cd My-Tawjihe

# تثبيت الحزم في الجذر
npm install

# تثبيت حزم الواجهة الأمامية
cd frontend && npm install && cd ..

# تثبيت حزم الخادم
cd backend/server && npm install && cd ../..
```

---

## 2. إعداد متغيرات البيئة

```bash
cd backend/server
cp .env.example .env
```

افتح ملف `.env` وعدّل القيم التالية:

```env
MONGO_URI=mongodb://localhost:27017/mytawjeh
JWT_SECRET=ضع_مفتاحاً_سرياً_هنا
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
```

لتوليد مفتاح JWT سري:

```bash
npm run generate-secret
```

---

## 3. تشغيل MongoDB

**محلياً (Windows):**

```bash
cd backend/server
npm run mongo
```

أو شغّل MongoDB يدوياً إذا كان مثبتاً على جهازك.

---

## 4. تشغيل المشروع

من مجلد الجذر، شغّل الواجهة والخادم معاً:

```bash
npm run dev
```

أو بشكل منفصل:

```bash
# الخادم فقط (المنفذ 5000)
npm run dev:backend

# الواجهة فقط (المنفذ 5173)
npm run dev:frontend
```

افتح المتصفح على: **http://localhost:5173**

---

## 5. إضافة البيانات التجريبية

```bash
cd backend/server

# إنشاء حسابات المستخدمين التجريبية
node scripts/seedUsers.js

# إضافة جميع البيانات (مباريات + تمارين + محتوى عربي)
npm run seed:all
```

### حسابات تجريبية جاهزة

| الدور | الإيميل | كلمة المرور |
|-------|---------|-------------|
| طالب | eleve1@test.com | password |
| أستاذ | prof@test.com | password |
| ولي أمر | parent@test.com | password |
| مدير | admin@test.com | password |

---

## 6. هيكل المشروع

```
My-Tawjihe/
├── frontend/          ← واجهة React + TypeScript + Tailwind
│   └── src/
│       ├── dashboard/ ← لوحات التحكم (طالب، أستاذ، والد، مدير)
│       └── translations/ ← ترجمات (fr / en / ar)
├── backend/
│   └── server/
│       ├── models/    ← نماذج MongoDB
│       ├── routes/    ← مسارات API
│       └── scripts/   ← سكريبتات البيانات
└── package.json       ← أوامر التشغيل الرئيسية
```

---

## 7. الأوامر المتاحة

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل الواجهة والخادم معاً |
| `npm run dev:frontend` | تشغيل الواجهة فقط |
| `npm run dev:backend` | تشغيل الخادم فقط |
| `cd backend/server && npm run seed:all` | إضافة جميع البيانات التجريبية |
| `cd backend/server && node scripts/seedUsers.js` | إنشاء المستخدمين التجريبيين |

---

## اللغات المدعومة

المنصة تدعم 3 لغات مع RTL للعربية:
- 🇫🇷 الفرنسية
- 🇬🇧 الإنجليزية
- 🇲🇦 العربية
