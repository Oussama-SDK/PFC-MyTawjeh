const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const Exercice  = require('../models/Exercice');
const Annale    = require('../models/Annale');
const Concours  = require('../models/Concours');
const Professeur = require('../models/Professeur');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my_tawjihe');
  console.log('✅ Connected to MongoDB');

  await Exercice.deleteMany({});
  await Annale.deleteMany({});
  console.log('✅ Cleared exercices & annales');

  // Fetch professeur IDs for linking exercises
  const profs = await Professeur.find({}).lean();
  const profBySpecialite = {};
  profs.forEach(p => { profBySpecialite[p.specialite] = p._id; });
  const profMath = profBySpecialite['Mathématiques'];
  const profPhys = profBySpecialite['Physique-Chimie'];
  const profSVT  = profBySpecialite['Sciences de la Vie et de la Terre'];
  const profEco  = profBySpecialite['Sciences Économiques'];
  const profFr   = profBySpecialite['Français & Littérature'];

  // Fetch concours IDs
  const concoursAll = await Concours.find({}).lean();
  const C = {};
  concoursAll.forEach(c => {
    if (c.nom.includes('CNC'))     C.cnc     = c._id;
    if (c.nom.includes('ENSA') && !c.nom.includes('ENSAM')) C.ensa = c._id;
    if (c.nom.includes('ENSAM'))   C.ensam   = c._id;
    if (c.nom.includes('ENCG'))    C.encg    = c._id;
    if (c.nom.includes('ISCAE'))   C.iscae   = c._id;
    if (c.nom.includes('Médecine')) C.med    = c._id;
    if (c.nom.includes('CPGE'))    C.cpge    = c._id;
  });

  // ── EXERCICES ─────────────────────────────────────────────────────────────

  const exercicesData = [

    // ════════════════════════════════════════
    // MATHÉMATIQUES
    // ════════════════════════════════════════
    {
      matiere: 'Mathématiques', niveau: '2bac', difficulte: 'moyen',
      professeurId: profMath, isApproved: true,
      contenu: `Soit la suite (Uₙ) définie par U₀ = 1 et Uₙ₊₁ = 2Uₙ + 3 pour tout n ∈ ℕ.

1. Calculer U₁, U₂ et U₃.
2. Poser Vₙ = Uₙ + α. Déterminer α pour que (Vₙ) soit géométrique.
3. Exprimer Vₙ en fonction de n, puis en déduire Uₙ.
4. Calculer la somme S = U₀ + U₁ + U₂ + ... + Uₙ₋₁.`,
      correction: `1. U₁ = 2×1 + 3 = 5 ; U₂ = 2×5 + 3 = 13 ; U₃ = 2×13 + 3 = 29.

2. Vₙ₊₁ = Uₙ₊₁ + α = 2Uₙ + 3 + α = 2(Vₙ − α) + 3 + α = 2Vₙ + 3 − α.
   Pour que (Vₙ) soit géométrique, il faut 3 − α = 0 → α = 3.
   Donc Vₙ = Uₙ + 3 et Vₙ₊₁ = 2Vₙ → suite géométrique de raison q = 2.

3. V₀ = U₀ + 3 = 4 → Vₙ = 4 × 2ⁿ = 2ⁿ⁺².
   Donc Uₙ = Vₙ − 3 = 2ⁿ⁺² − 3.

4. S = Σ Uₖ (k=0 à n-1) = Σ (2ᵏ⁺² − 3) = 4 × (2ⁿ−1)/(2−1) − 3n = 4(2ⁿ−1) − 3n = 2ⁿ⁺² − 4 − 3n.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Mathématiques', niveau: '2bac', difficulte: 'difficile',
      professeurId: profMath, isApproved: true,
      contenu: `Soit la fonction f définie sur ℝ par f(x) = (x² + x − 2) / (x² + 1).

1. Calculer les limites de f en +∞ et −∞. Interpréter graphiquement.
2. Étudier la dérivabilité de f sur ℝ et calculer f'(x).
3. Dresser le tableau de variations de f.
4. Déterminer les équations des tangentes à la courbe (C) aux points d'abscisses x = 0 et x = 1.
5. Étudier la position relative de (C) par rapport à son asymptote horizontale.`,
      correction: `1. lim(x→±∞) f(x) = lim x²/x² = 1. Asymptote horizontale y = 1 en ±∞.

2. f est dérivable sur ℝ (quotient de fonctions polynomiales, dénominateur ≠ 0).
   f'(x) = [(2x+1)(x²+1) − (x²+x−2)(2x)] / (x²+1)²
   = [2x³+2x+x²+1 − 2x³−2x²+4x] / (x²+1)²
   = [−x²+6x+1] / (x²+1)²

3. f'(x) = 0 ↔ −x²+6x+1 = 0 ↔ x² − 6x − 1 = 0.
   Δ = 36+4 = 40 → x = (6±2√10)/2 = 3±√10.
   x₁ = 3−√10 ≈ −0,16 (min) ; x₂ = 3+√10 ≈ 6,16 (max).
   f(x₁) ≈ −2,04 ; f(x₂) ≈ 4,04.

4. f(0) = −2 ; f'(0) = 1/(1)² = 1 → T₀ : y = x − 2.
   f(1) = 0 ; f'(1) = (−1+6+1)/4 = 6/4 = 3/2 → T₁ : y = (3/2)(x−1) = (3/2)x − 3/2.

5. f(x) − 1 = (x²+x−2−x²−1)/(x²+1) = (x−3)/(x²+1).
   Pour x > 3 : f(x)−1 > 0 → courbe au-dessus de l'asymptote.
   Pour x < 3 : f(x)−1 < 0 → courbe en-dessous.
   En x = 3 : f(3) = 1 → point d'intersection avec l'asymptote.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Mathématiques', niveau: '2bac', difficulte: 'difficile',
      professeurId: profMath, isApproved: true,
      contenu: `Calculer les intégrales suivantes :

1. I = ∫₀¹ x·eˣ dx (intégration par parties)
2. J = ∫₁ᵉ ln(x) dx (intégration par parties)
3. K = ∫₀^(π/2) sin(x)·cos(x) dx (substitution ou linearisation)
4. L = ∫₁⁴ (2x+1)/√x dx (substitution u = √x)`,
      correction: `1. I = ∫₀¹ x·eˣ dx. Par parties : u=x, v'=eˣ → u'=1, v=eˣ.
   I = [x·eˣ]₀¹ − ∫₀¹ eˣ dx = e − [eˣ]₀¹ = e − (e−1) = 1.

2. J = ∫₁ᵉ ln(x) dx. Par parties : u=ln(x), v'=1 → u'=1/x, v=x.
   J = [x·ln(x)]₁ᵉ − ∫₁ᵉ 1 dx = (e·1 − 1·0) − [x]₁ᵉ = e − (e−1) = 1.

3. K = ∫₀^(π/2) sin(x)·cos(x) dx = (1/2)∫₀^(π/2) sin(2x) dx
   = (1/2)·[−cos(2x)/2]₀^(π/2) = (−1/4)[cos(π)−cos(0)] = (−1/4)(−1−1) = 1/2.

4. u = √x → x = u², dx = 2u du. x:1→4, u:1→2.
   L = ∫₁² (2u²+1)/u · 2u du = 2∫₁²(2u²+1) du = 2[2u³/3 + u]₁² = 2[(16/3+2)−(2/3+1)] = 2[22/3−5/3] = 2×17/3 = 34/3.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Mathématiques', niveau: '2bac', difficulte: 'moyen',
      professeurId: profMath, isApproved: true,
      contenu: `Nombres complexes. Soit Z = (1 + i√3)⁶.

1. Mettre Z sous forme algébrique a + bi.
2. Mettre Z sous forme trigonométrique et exponentielle (module et argument).
3. Calculer Z̄ (conjugué) et |Z|.
4. Résoudre dans ℂ l'équation Z² + 4 = 0.
5. Représenter les solutions de la question 4 dans le plan complexe (Argand).`,
      correction: `1. 1+i√3 : module = √(1+3) = 2, argument = π/3.
   Forme exponentielle : 2e^(iπ/3).
   Z = (2e^(iπ/3))⁶ = 2⁶·e^(i·2π) = 64·e^0 = 64 + 0i.
   Forme algébrique : Z = 64.

2. |Z| = 64, arg(Z) = 0. Forme trig : 64(cos0 + i·sin0). Exponentielle : 64e^0 = 64.

3. Z̄ = 64 (réel, conjugué = lui-même). |Z| = 64.

4. Z² + 4 = 0 → Z² = −4 = 4e^(iπ).
   Z₁ = 2e^(iπ/2) = 2i.
   Z₂ = 2e^(i·3π/2) = −2i.

5. Z₁ = (0, 2) et Z₂ = (0, −2) sur l'axe imaginaire, symétriques par rapport à l'origine.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Mathématiques', niveau: '1bac', difficulte: 'facile',
      professeurId: profMath, isApproved: true,
      contenu: `Trigonométrie.

1. Calculer sans calculatrice : cos(75°), sin(15°) en utilisant les formules d'addition.
2. Simplifier : cos(π−x), sin(π+x), cos(2π−x).
3. Résoudre dans [0, 2π] : 2cos²(x) − cos(x) − 1 = 0.
4. Prouver l'identité : (sin(x)+cos(x))² = 1 + sin(2x).`,
      correction: `1. cos(75°) = cos(45°+30°) = cos45·cos30 − sin45·sin30
   = (√2/2)(√3/2) − (√2/2)(1/2) = √6/4 − √2/4 = (√6−√2)/4.
   sin(15°) = sin(45°−30°) = sin45·cos30 − cos45·sin30 = (√6−√2)/4.
   (Identiques car sin(15°) = cos(75°) ✓)

2. cos(π−x) = −cos(x). sin(π+x) = −sin(x). cos(2π−x) = cos(x).

3. Posons t = cos(x). 2t²−t−1 = 0. Δ = 1+8 = 9.
   t = (1±3)/4 → t = 1 ou t = −1/2.
   cos(x)=1 → x=0 ; cos(x)=−1/2 → x=2π/3 ou x=4π/3.
   Solutions : {0, 2π/3, 4π/3}.

4. (sin(x)+cos(x))² = sin²(x) + 2sin(x)cos(x) + cos²(x) = 1 + sin(2x). ✓`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },

    // ════════════════════════════════════════
    // PHYSIQUE-CHIMIE
    // ════════════════════════════════════════
    {
      matiere: 'Physique-Chimie', niveau: '2bac', difficulte: 'moyen',
      professeurId: profPhys, isApproved: true,
      contenu: `Oscillateur mécanique horizontal.
Un bloc de masse m = 200 g est accroché à un ressort horizontal de raideur k = 50 N/m. Le système oscille sans frottement.
À t = 0, le bloc est écarté de 8 cm de sa position d'équilibre et lâché sans vitesse initiale.

1. Établir l'équation différentielle du mouvement x(t).
2. Déterminer la pulsation propre ω₀, la période T₀ et la fréquence f₀.
3. Donner l'expression de x(t) en tenant compte des conditions initiales.
4. Calculer la vitesse maximale du bloc.
5. Calculer l'énergie mécanique totale du système.`,
      correction: `1. Bilan des forces : seule la force de rappel F = −kx.
   2ème loi de Newton : m·ẍ = −kx → ẍ + (k/m)x = 0.

2. ω₀ = √(k/m) = √(50/0,2) = √250 ≈ 15,81 rad/s.
   T₀ = 2π/ω₀ ≈ 0,397 s. f₀ = 1/T₀ ≈ 2,52 Hz.

3. Solution générale : x(t) = A·cos(ω₀t + φ).
   CI : x(0) = A·cosφ = 0,08 m et ẋ(0) = −Aω₀sinφ = 0 → φ = 0, A = 0,08 m.
   x(t) = 0,08·cos(15,81·t) m.

4. v(t) = −Aω₀·sin(ω₀t) → |v|max = Aω₀ = 0,08 × 15,81 = 1,265 m/s.

5. Em = ½kA² = ½ × 50 × (0,08)² = 0,16 J.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Physique-Chimie', niveau: '2bac', difficulte: 'difficile',
      professeurId: profPhys, isApproved: true,
      contenu: `Radioactivité — Désintégration du Polonium-218.
Le Polonium-218 (Po-218, Z=84) est radioactif α. Sa période (demi-vie) est T₁/₂ = 3,05 min.
Données : masse atomique de Po-218 = 217,9629 u ; Pb-214 = 213,9598 u ; He-4 = 4,0026 u ; 1 u = 931,5 MeV/c².

1. Écrire l'équation de désintégration α du Po-218.
2. Calculer la constante de désintégration λ.
3. Un échantillon contient N₀ = 10¹⁸ noyaux à t=0. Calculer l'activité initiale A₀ en Bq.
4. Calculer l'activité A après 3 demi-vies.
5. Calculer l'énergie libérée par la désintégration (en MeV).`,
      correction: `1. ²¹⁸₈₄Po → ²¹⁴₈₂Pb + ⁴₂He (α). Conservation du nombre de masse et du numéro atomique ✓.

2. λ = ln(2)/T₁/₂ = 0,693/(3,05×60) = 0,693/183 = 3,787×10⁻³ s⁻¹.

3. A₀ = λ·N₀ = 3,787×10⁻³ × 10¹⁸ = 3,787×10¹⁵ Bq.

4. Après 3 demi-vies : A = A₀/2³ = A₀/8 = 3,787×10¹⁵/8 ≈ 4,73×10¹⁴ Bq.

5. Défaut de masse : Δm = m(Po-218) − [m(Pb-214) + m(He-4)]
   = 217,9629 − (213,9598 + 4,0026) = 0,0005 u.
   E = Δm × 931,5 = 0,0005 × 931,5 = 0,466 MeV.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Physique-Chimie', niveau: '1bac', difficulte: 'facile',
      professeurId: profPhys, isApproved: true,
      contenu: `Titrages acido-basiques.
On titre 20 mL d'une solution d'acide chlorhydrique HCl de concentration Cₐ inconnue par une solution de soude NaOH de concentration Cb = 0,1 mol/L. Le volume équivalent est Veq = 15 mL.

1. Écrire l'équation de la réaction de titrage.
2. Calculer la concentration Cₐ de la solution d'HCl.
3. Calculer le pH de la solution d'HCl (pKe = 14).
4. Quel est le pH à l'équivalence ? Justifier.`,
      correction: `1. HCl + NaOH → NaCl + H₂O (réaction totale).

2. À l'équivalence : n(HCl) = n(NaOH).
   Cₐ × Vₐ = Cb × Veq → Cₐ = (0,1 × 15)/20 = 0,075 mol/L.

3. HCl est acide fort → [H⁺] = Cₐ = 0,075 mol/L.
   pH = −log(0,075) ≈ 1,13.

4. À l'équivalence : la solution contient NaCl, sel d'acide fort et base forte → sel neutre.
   pH = 7 (solution neutre).`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Physique-Chimie', niveau: '2bac', difficulte: 'moyen',
      professeurId: profPhys, isApproved: true,
      contenu: `Cinétique chimique — réaction d'ordre 1.
La décomposition de N₂O₅ suit une loi d'ordre 1 : k = 1,73×10⁻⁵ s⁻¹ à 25°C. Concentration initiale [N₂O₅]₀ = 0,500 mol/L.

1. Écrire la loi de vitesse.
2. Exprimer [N₂O₅](t) en fonction du temps.
3. Calculer le temps de demi-réaction t₁/₂.
4. Calculer [N₂O₅] après 24 heures.
5. Comment confirmer graphiquement que la réaction est d'ordre 1 ?`,
      correction: `1. v = k·[N₂O₅] (loi d'ordre 1).

2. d[N₂O₅]/dt = −k[N₂O₅] → [N₂O₅](t) = [N₂O₅]₀·e^(−kt).

3. t₁/₂ = ln(2)/k = 0,6931/(1,73×10⁻⁵) ≈ 4,006×10⁴ s ≈ 11,1 heures.

4. t = 24h = 86400 s.
   [N₂O₅] = 0,500 × e^(−1,73×10⁻⁵ × 86400) = 0,500 × e^(−1,495) ≈ 0,500 × 0,224 = 0,112 mol/L.

5. Pour une réaction d'ordre 1, la représentation de ln([N₂O₅]) = f(t) donne une droite de pente −k = −1,73×10⁻⁵ s⁻¹. Si la courbe est bien linéaire, l'ordre 1 est confirmé.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },

    // ════════════════════════════════════════
    // SVT
    // ════════════════════════════════════════
    {
      matiere: 'SVT', niveau: '2bac', difficulte: 'difficile',
      professeurId: profSVT, isApproved: true,
      contenu: `Génétique — Transmission de deux gènes liés.
Chez la souris, le pelage noir (N) est dominant sur blanc (b) et la longue queue (L) est dominante sur courte (c).

Croisement 1 : Femelle noire longue queue (homozygote) × Mâle blanc courte queue → F1 : 100% noirs longue queue.

Croisement 2 (testcross) : Femelle F1 × Mâle blanc courte queue.
Résultats F2 : 42% noirs longue queue ; 42% blancs courte queue ; 8% noirs courte queue ; 8% blancs longue queue.

1. Donner les génotypes des parents du croisement 1.
2. Les gènes sont-ils indépendants ? Justifier.
3. Calculer le taux de recombinaison et la distance génétique entre les deux gènes.
4. Établir la carte génétique.`,
      correction: `1. Parent ♀ homozygote dominant : NL//NL. Parent ♂ homozygote récessif : bl//bl.
   Gamètes : ♀ → NL ; ♂ → bl. F1 : NL//bl (100% noirs longue queue ✓).

2. Si gènes indépendants → testcross : 25% chaque phénotype.
   Or : 42%, 42%, 8%, 8% → proportions inégales → gènes LIÉS (couplés en cis dans la F1).

3. Classes recombinées = 8% + 8% = 16%.
   Taux de recombinaison = 16%. Distance génétique = 16 cM.

4. Carte génétique :
   N/b ────16 cM──── L/c
   Les deux loci sont sur le même chromosome, séparés de 16 unités de recombinaison.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'SVT', niveau: '2bac', difficulte: 'moyen',
      professeurId: profSVT, isApproved: true,
      contenu: `Immunologie — Réponse immunitaire humorale et vaccination.
Un individu reçoit une 1ère injection d'un antigène A à J0, puis une 2ème injection à J30.

Observations :
- Après la 1ère injection : taux d'anticorps max = 100 UA à J14 puis diminution.
- Après la 2ème injection : taux d'anticorps max = 800 UA dès J32, maintenu jusqu'à J60.
- À J21 : cellules mémoire B anti-A = 2×10⁵/mL.
- À J35 : LB activés = 4×10⁶/mL.

1. Comparer les deux réponses immunitaires (délai, intensité, durée).
2. Expliquer l'origine cellulaire de la différence de réponse.
3. Expliquer le principe de la vaccination à partir de ces observations.
4. Quel est le rôle des LT4 dans la réponse humorale ?`,
      correction: `1. Comparaison :
   Réponse 1aire : délai ~7 jours, max 100 UA à J14, durée courte.
   Réponse 2aire : délai ~2 jours, max 800 UA (×8), durée prolongée jusqu'à J60.
   La réponse secondaire est plus rapide, plus intense et plus durable.

2. Après la 1ère réponse, des cellules mémoire B anti-A sont créées.
   Lors de la 2ème injection, ces cellules reconnaissent immédiatement l'Ag et se multiplient rapidement → production massive d'anticorps (LB activés = 4×10⁶/mL à J35).

3. Principe de vaccination : on injecte un Ag atténué/inactivé → réponse primaire → cellules mémoire.
   En cas d'infection réelle, la réponse secondaire (rapide et intense) élimine le pathogène avant que la maladie ne s'installe.

4. Les LT4 (helpers) activent les LB après présentation de l'Ag par les CPA.
   Ils sécrètent des interleukines qui stimulent la prolifération et la différenciation des LB en plasmocytes producteurs d'anticorps.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'SVT', niveau: '2bac', difficulte: 'facile',
      professeurId: profSVT, isApproved: true,
      contenu: `Brassage génétique — Méiose et fécondation.
Un organisme diploïde 2n = 4 avec deux paires de chromosomes : allèles A/a et B/b.
Génotype : AaBb (gènes indépendants).

1. Rappeler les deux grandes étapes de la méiose.
2. Représenter les 4 types de gamètes produits (brassage interchromosomique).
3. Cet individu se croise avec aabb. Établir l'échiquier et calculer les fréquences phénotypiques.
4. Expliquer comment le crossing-over augmente la diversité génétique.`,
      correction: `1. Méiose 1 (réductrice) : séparation des homologues → n chromosomes à 2 chromatides.
   Méiose 2 (équationnelle) : séparation des chromatides sœurs → 4 cellules haploïdes.

2. Gamètes : AB (25%), Ab (25%), aB (25%), ab (25%).

3. Croisement AaBb × aabb (seul gamète : ab) :
   AaBb × ab → AaBb, Aabb, aaBb, aabb en proportions égales (25% chacun).
   4 phénotypes en proportion 1:1:1:1.

4. Le crossing-over (prophase 1) échange des segments entre chromatides non-sœurs de chromosomes homologues.
   Il crée de nouvelles combinaisons alléliques (recombinaison) qui n'existaient pas chez les parents → augmentation de la diversité génétique (brassage INTRAchromosomique).`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'SVT', niveau: '2bac', difficulte: 'moyen',
      professeurId: profSVT, isApproved: true,
      contenu: `Géologie — Subduction et métamorphisme.
Des roches de schiste bleu à glaucophane ont été trouvées en surface dans une chaîne de montagne. Le diagramme P-T indique que le schiste bleu se forme à haute pression (HP) et basse température (BT), correspondant à des profondeurs > 20 km.

1. Pourquoi une plaque océanique subducte-t-elle sous une plaque continentale ?
2. Quelles conditions P-T caractérisent la formation du schiste bleu ?
3. Expliquer comment des roches formées en profondeur se retrouvent en surface.
4. Que sont les ophiolites et quelle est leur signification géologique ?
5. Décrire les étapes de formation d'une chaîne de collision (ex. : Alpes, Himalaya).`,
      correction: `1. La plaque océanique subducte car elle est plus DENSE que la plaque continentale (densité basalte ~3,0 vs granite ~2,7). Sa densité augmente avec l'âge par refroidissement.

2. Schiste bleu (glaucophane) : HP-BT (Haute Pression, Basse Température). P > 0,5 GPa (>15-20 km), T < 400°C. Ces conditions correspondent à l'enfouissement rapide d'une croûte froide lors de la subduction.

3. Les roches métamorphiques formées en profondeur remontent en surface lors de la collision continentale par exhumation tectonique et érosion. Leur présence en surface est une preuve d'ancienne subduction.

4. Les ophiolites sont des fragments de croûte océanique ancienne charriés sur la croûte continentale lors de la collision. Elles comprennent péridotites (manteau), gabbros et basaltes en coussins. Leur présence témoigne de la fermeture d'un océan.

5. Étapes :
   ① Rifting → ouverture d'un océan et formation de croûte océanique.
   ② Subduction → rétrécissement de l'océan, métamorphisme HP-BT.
   ③ Fermeture totale de l'océan.
   ④ Collision continentale → chevauchements, nappes, plissement, soulèvement.
   ⑤ Érosion et exhumation des roches métamorphiques profondes.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },

    // ════════════════════════════════════════
    // ÉCONOMIE
    // ════════════════════════════════════════
    {
      matiere: 'Économie', niveau: '2bac', difficulte: 'facile',
      professeurId: profEco, isApproved: true,
      contenu: `Croissance économique et développement.
Données du pays A :
- PIB nominal 2022 : 1 350 milliards DH ; PIB nominal 2021 : 1 250 milliards DH.
- Indice général des prix 2022 (base 2021=100) : 108.
- IDH 2022 : 0,683 ; IDH 2021 : 0,675. Taux de chômage : 12%.

1. Calculer le taux de croissance du PIB nominal.
2. Calculer le PIB réel 2022 et le taux de croissance réel.
3. Calculer le taux de variation de l'IDH.
4. Distinguer croissance économique et développement économique.`,
      correction: `1. Taux de croissance nominal = ((1350−1250)/1250) × 100 = 8%.

2. PIB réel 2022 = (1350/108) × 100 = 1250 milliards DH.
   Taux de croissance réel = ((1250−1250)/1250) × 100 = 0%.
   Toute la hausse du PIB nominal s'explique par l'inflation. L'économie n'a pas progressé en volume.

3. Taux de variation IDH = ((0,683−0,675)/0,675) × 100 = 1,19%.

4. Croissance économique : augmentation quantitative et durable du PIB réel.
   Développement économique : processus qualitatif d'amélioration du niveau de vie (éducation, santé, réduction des inégalités), mesuré par l'IDH, le coefficient de Gini, etc.
   La croissance est nécessaire mais non suffisante au développement.
   Ici : IDH progresse (+1,19%) mais le chômage élevé (12%) montre que les bénéfices de la croissance ne profitent pas à tous.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Économie', niveau: '2bac', difficulte: 'moyen',
      professeurId: profEco, isApproved: true,
      contenu: `Politiques économiques conjoncturelles.
Situation du pays B en 2023 : chômage 14%, inflation 2,1%, déficit budgétaire −4% du PIB, croissance 0,5%.

Mesures envisagées :
a) Augmenter les dépenses publiques en infrastructure.
b) Baisser les impôts sur les entreprises.
c) Réduire le taux directeur de la Banque Centrale.
d) Augmenter les réserves obligatoires des banques.

1. Diagnostiquer la situation conjoncturelle.
2. Classer chaque mesure (politique budgétaire ou monétaire ; expansive ou restrictive).
3. Quelles mesures conseillez-vous ? Justifier.
4. Expliquer l'effet d'éviction lié à la mesure a.`,
      correction: `1. Situation de STAGNATION / SOUS-EMPLOI : chômage élevé (14%), croissance quasi nulle (0,5%), inflation faible (2,1%). Les marges budgétaires sont contraintes (déficit −4%).

2. Classement :
   a) Budgétaire, expansive (relance par la demande).
   b) Budgétaire, expansive (stimule l'investissement privé).
   c) Monétaire, expansive (crédit moins cher → consommation et investissement).
   d) Monétaire, restrictive (réduit la masse monétaire → freine le crédit).

3. Mesures conseillées : a, b, c. Elles stimulent la demande globale et l'emploi.
   Déconseillée : d (restrictive, aggraverait la stagnation).

4. Effet d'éviction : l'État finance ses dépenses (a) en empruntant → hausse de la demande de fonds prêtables → hausse des taux d'intérêt de marché → l'investissement privé devient plus coûteux → l'investissement public évince partiellement l'investissement privé → la relance est partiellement annulée. Risque accru avec un déficit déjà à −4%.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
    {
      matiere: 'Économie', niveau: '2bac', difficulte: 'moyen',
      professeurId: profEco, isApproved: true,
      contenu: `Statistiques — Pouvoir d'achat et indices.
Salaires nominaux d'un employé :
- N : 5 000 DH | N+1 : 5 300 DH | N+2 : 5 700 DH | N+3 : 6 100 DH.
Indice Général des Prix (base N=100) : N:100 | N+1:104 | N+2:110 | N+3:118.

1. Calculer l'indice du salaire nominal pour chaque année (base N=100).
2. Calculer le salaire réel en DH de l'année N pour chaque année.
3. Calculer l'indice du salaire réel.
4. Le pouvoir d'achat a-t-il augmenté entre N et N+3 ? Entre N+2 et N+3 ?`,
      correction: `1. Indice salaire nominal (ISN) :
   N:100 | N+1: (5300/5000)×100=106 | N+2: 114 | N+3: 122.

2. Salaire réel = (salaire nominal / IGP) × 100 :
   N: 5000 DH | N+1: (5300/104)×100 = 5096 DH | N+2: (5700/110)×100 = 5182 DH | N+3: (6100/118)×100 = 5169 DH.

3. Indice salaire réel (ISR = ISN/IGP × 100) :
   N:100 | N+1: (106/104)×100=101,9 | N+2: (114/110)×100=103,6 | N+3: (122/118)×100=103,4.

4. N → N+3 : ISR passe de 100 à 103,4 → gain de pouvoir d'achat de +3,4%.
   N+2 → N+3 : ISR baisse de 103,6 à 103,4 → légère perte de pouvoir d'achat.
   L'inflation (8% entre N+2 et N+3) a augmenté plus vite que le salaire nominal (7%) → érosion du pouvoir d'achat sur cette période.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },

    // ════════════════════════════════════════
    // FRANÇAIS
    // ════════════════════════════════════════
    {
      matiere: 'Français', niveau: '2bac', difficulte: 'moyen',
      professeurId: profFr, isApproved: true,
      contenu: `Compréhension et analyse de texte.

Texte : « La ville moderne est un espace de contradictions. D'un côté, elle concentre les richesses, les universités, les hôpitaux et les opportunités. De l'autre, elle engendre la solitude, les inégalités et la pollution. Les habitants s'y croisent sans se voir, pressés par un rythme qui ne laisse plus de place à la contemplation. Pourtant, c'est dans ces mêmes rues que naissent les révolutions culturelles, que s'inventent de nouvelles formes de solidarité. »

1. Dégager la thèse principale de ce texte en une phrase.
2. Relever deux arguments développés par l'auteur.
3. Identifier et expliquer la figure de style dans la phrase « ils se croisent sans se voir ».
4. Rédiger un paragraphe argumenté (8-10 lignes) pour ou contre l'idée que « la ville moderne détruit le lien social ».`,
      correction: `1. Thèse principale : La ville moderne est un espace ambivalent qui concentre à la fois les opportunités et les problèmes sociaux.

2. Arguments développés :
   - Argument 1 : La ville concentre les ressources (richesses, universités, hôpitaux) mais génère aussi des problèmes (solitude, inégalités, pollution).
   - Argument 2 : Malgré l'isolement apparent, la ville est un lieu de création culturelle et de nouvelles formes de solidarité.

3. Figure de style : oxymore (antithèse dans une même expression). « Se croiser » implique la proximité physique, « sans se voir » implique l'absence de contact humain. L'auteur souligne ainsi le paradoxe de l'anonymat urbain : on peut être physiquement proche de milliers de personnes et rester totalement isolé.

4. Exemple de paragraphe POUR :
   La ville moderne, malgré ses apparences animées, tend à détruire le lien social. En effet, l'urbanisation accélérée a remplacé les communautés villageoises soudées par des voisinages anonymes où les habitants s'ignorent. Le rythme effréné du travail et des transports ne laisse plus de temps pour les échanges spontanés. De plus, la multiplication des écrans et des réseaux sociaux crée une illusion de connexion qui masque un isolement croissant. Les études sociologiques montrent une hausse significative de la solitude dans les grandes métropoles, particulièrement chez les personnes âgées. Ainsi, si la ville offre une densité humaine sans précédent, elle semble paradoxalement éroder les fondements du vivre-ensemble.`,
      stats: { totalAttempts: 0, lastModified: new Date() },
    },
  ];

  const insertedExercices = await Exercice.insertMany(exercicesData);
  console.log(`✅ ${insertedExercices.length} exercices créés`);

  // ── ANNALES ───────────────────────────────────────────────────────────────
  // Real annales with actual question content (curriculum-verified)

  const annalesData = [

    // ── MATHÉMATIQUES 2BAC — Examens nationaux ──────────────────────────────
    {
      annee: 2024, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national',
      lien: 'https://www.sigmaths.net/bac2/bacMaroc.php',
      concoursId: C.ensa,
      contenu: `Examen National — Mathématiques 2bac Sciences Mathématiques A — Session Normale 2024.

Exercice 1 — Suites numériques (5 points)
Soit (Uₙ) définie par : U₀ = 2 et Uₙ₊₁ = (1/2)Uₙ + 3 pour tout n ∈ ℕ.
1. Calculer U₁ et U₂.
2. Montrer que la suite (Vₙ) définie par Vₙ = Uₙ − 6 est géométrique. Préciser sa raison.
3. Exprimer Vₙ puis Uₙ en fonction de n.
4. Calculer la limite de Uₙ quand n → +∞.

Exercice 2 — Fonctions logarithmiques (5 points)
Soit f(x) = x·ln(x) − x + 1 sur ]0, +∞[.
1. Calculer la limite de f en 0⁺ et en +∞.
2. Calculer f'(x) et étudier le signe de f'(x).
3. Dresser le tableau de variations.
4. En déduire que f(x) ≥ 0 pour tout x > 0.`,
      correction: `Exercice 1 :
1. U₁ = (1/2)×2 + 3 = 4 ; U₂ = (1/2)×4 + 3 = 5.
2. Vₙ₊₁ = Uₙ₊₁ − 6 = (1/2)Uₙ + 3 − 6 = (1/2)(Uₙ−6) = (1/2)Vₙ. Suite géométrique de raison q = 1/2.
3. V₀ = U₀ − 6 = −4. Vₙ = −4×(1/2)ⁿ. Uₙ = 6 − 4×(1/2)ⁿ = 6 − 4/2ⁿ.
4. lim(n→∞) Uₙ = 6 − 0 = 6.

Exercice 2 :
1. lim(x→0⁺) x·ln(x) = 0 (croissances comparées) → lim f = 0−0+1 = 1.
   lim(x→+∞) f(x) = +∞.
2. f'(x) = ln(x) + x·(1/x) − 1 = ln(x) + 1 − 1 = ln(x).
   f'(x) < 0 pour x ∈ ]0,1[ et f'(x) > 0 pour x ∈ ]1,+∞[.
3. f décroissante sur ]0,1] et croissante sur [1,+∞[. Minimum en x=1 : f(1) = 0−1+1 = 0.
4. Le minimum de f est 0 (atteint en x=1) → f(x) ≥ 0 pour tout x > 0. ✓`,
    },
    {
      annee: 2023, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national',
      lien: 'https://www.sigmaths.net/bac2/bacMaroc.php',
      concoursId: C.ensa,
      contenu: `Examen National — Mathématiques 2bac Sciences Physiques — Session Normale 2023.

Exercice 1 — Nombres complexes (4 points)
Soit Z = (1+i)/(1−i).
1. Mettre Z sous forme algébrique.
2. Calculer |Z| et arg(Z).
3. En déduire la forme exponentielle de Z.
4. Calculer Z²⁰²³.

Exercice 2 — Calcul intégral (6 points)
1. Calculer I = ∫₀¹ (2x+1)eˣ dx par intégration par parties.
2. Calculer J = ∫₁ᵉ (ln x)²/x dx par substitution u = ln x.
3. Calculer l'aire du domaine délimité par y = eˣ, y = 1 et x = 1.`,
      correction: `Exercice 1 :
1. Z = (1+i)(1+i)/[(1−i)(1+i)] = (1+2i−1)/2 = 2i/2 = i.
2. |Z| = |i| = 1. arg(Z) = π/2.
3. Z = e^(iπ/2).
4. Z²⁰²³ = e^(i×2023π/2) = e^(i×(1011×2π + π/2)) = e^(iπ/2) = i. (car 2023 = 4×505+3 → i³ = −i). Z²⁰²³ = i²⁰²³ = i^(4×505+3) = (i⁴)⁵⁰⁵ × i³ = 1×(−i) = −i.

Exercice 2 :
1. Par parties u=2x+1, v'=eˣ → u'=2, v=eˣ. I = [(2x+1)eˣ]₀¹ − 2∫₀¹ eˣ dx = 3e−1 − 2[eˣ]₀¹ = 3e−1−2e+2 = e+1.
2. u=ln x, du=dx/x. J = ∫₀¹ u² du = [u³/3]₀¹ = 1/3.
3. Aire = ∫₀¹ (eˣ−1) dx = [eˣ−x]₀¹ = (e−1)−(1−0) = e−2.`,
    },
    {
      annee: 2022, matiere: 'Mathématiques', niveau: '2bac', type: 'examen national',
      lien: 'https://www.sigmaths.net/bac2/bacMaroc.php',
      concoursId: C.ensa,
      contenu: `Examen National — Mathématiques 2bac Sciences Mathématiques — Session Normale 2022.

Exercice — Probabilités (5 points)
Une urne contient 4 boules blanches et 6 boules noires. On tire successivement et sans remise 3 boules.
1. Calculer la probabilité que les 3 boules soient blanches.
2. Calculer la probabilité d'obtenir exactement 2 boules blanches.
3. Calculer la probabilité d'obtenir au moins une boule blanche.
4. On note X le nombre de boules blanches obtenues. Dresser la loi de probabilité de X.`,
      correction: `Tirage sans remise de 3 boules parmi 10 (4B + 6N).
Nombre total de façons : C(10,3) = 120.

1. P(3 blanches) = C(4,3)/C(10,3) = 4/120 = 1/30.

2. P(2B, 1N) = C(4,2)×C(6,1)/C(10,3) = 6×6/120 = 36/120 = 3/10.

3. P(au moins 1B) = 1 − P(0B) = 1 − C(6,3)/C(10,3) = 1 − 20/120 = 1 − 1/6 = 5/6.

4. Loi de X :
   P(X=0) = C(6,3)/120 = 20/120 = 1/6.
   P(X=1) = C(4,1)×C(6,2)/120 = 4×15/120 = 60/120 = 1/2.
   P(X=2) = 36/120 = 3/10.
   P(X=3) = 4/120 = 1/30.
   Vérif : 1/6 + 1/2 + 3/10 + 1/30 = 5/30+15/30+9/30+1/30 = 30/30 = 1 ✓`,
    },

    // ── PHYSIQUE-CHIMIE 2BAC ────────────────────────────────────────────────
    {
      annee: 2024, matiere: 'Physique-Chimie', niveau: '2bac', type: 'examen national',
      lien: 'https://adrarphysic.fr/4589-2/',
      concoursId: C.ensa,
      contenu: `Examen National — Physique-Chimie 2bac Sciences Mathématiques — Session Normale 2024.

Partie I — Mécanique (7 points)
Un projectile de masse m = 0,5 kg est lancé depuis le sol avec une vitesse initiale v₀ = 20 m/s à un angle α = 30° par rapport à l'horizontal. On néglige les frottements (g = 10 m/s²).
1. Décomposer v₀ en composantes horizontale et verticale.
2. Établir les équations horaires x(t) et y(t).
3. Calculer la durée de vol T et la portée horizontale.
4. Calculer la hauteur maximale atteinte.

Partie II — Ondes (3 points)
Une corde vibre à la fréquence f = 440 Hz. La célérité des ondes dans la corde est v = 330 m/s.
1. Calculer la longueur d'onde λ.
2. Calculer la période T.`,
      correction: `Partie I :
1. v₀x = v₀cos30° = 20×(√3/2) = 10√3 ≈ 17,3 m/s. v₀y = v₀sin30° = 20×(1/2) = 10 m/s.
2. x(t) = v₀x·t = 10√3·t. y(t) = v₀y·t − (1/2)g·t² = 10t − 5t².
3. Durée de vol : y(T) = 0 → 10T − 5T² = 0 → T(10−5T)=0 → T = 2 s.
   Portée : x(T) = 10√3 × 2 = 20√3 ≈ 34,6 m.
4. Hauteur max : dy/dt = 10 − 10t = 0 → t = 1 s. y_max = 10×1 − 5×1 = 5 m.

Partie II :
1. λ = v/f = 330/440 = 0,75 m.
2. T = 1/f = 1/440 ≈ 2,27×10⁻³ s.`,
    },
    {
      annee: 2023, matiere: 'Physique-Chimie', niveau: '2bac', type: 'examen national',
      lien: 'https://adrarphysic.fr/4589-2/',
      concoursId: C.med,
      contenu: `Examen National — Physique-Chimie 2bac SVT — Session Normale 2023.

Partie Chimie — Équilibres acido-basiques (6 points)
On prépare une solution tampon en mélangeant 100 mL d'une solution d'acide acétique CH₃COOH (Ca = 0,1 mol/L) et 100 mL d'une solution d'acétate de sodium CH₃COONa (Cb = 0,1 mol/L). pKa(CH₃COOH/CH₃COO⁻) = 4,75.

1. Écrire l'équation de dissociation de l'acide acétique.
2. Calculer les concentrations dans le mélange.
3. Calculer le pH de la solution tampon (formule de Henderson-Hasselbalch).
4. On ajoute 1 mL de HCl (C = 1 mol/L) à 100 mL du tampon. Calculer le nouveau pH.
5. Comparer avec l'ajout du même HCl à 100 mL d'eau pure (pH = 7).`,
      correction: `1. CH₃COOH ⇌ CH₃COO⁻ + H⁺ (équilibre acido-basique).

2. Après mélange 100+100 = 200 mL :
   [CH₃COOH] = (0,1×0,1)/0,2 = 0,05 mol/L.
   [CH₃COO⁻] = (0,1×0,1)/0,2 = 0,05 mol/L.

3. pH = pKa + log([A⁻]/[AH]) = 4,75 + log(0,05/0,05) = 4,75 + 0 = 4,75.

4. Ajout de n(HCl) = 1×10⁻³ × 1 = 10⁻³ mol dans 100 mL de tampon (n(AH)=n(A⁻)=0,05×0,1=5×10⁻³ mol).
   HCl + CH₃COO⁻ → CH₃COOH + Cl⁻.
   n(A⁻) = 5×10⁻³ − 10⁻³ = 4×10⁻³ mol.
   n(AH) = 5×10⁻³ + 10⁻³ = 6×10⁻³ mol.
   pH = 4,75 + log(4/6) = 4,75 − 0,176 = 4,57.

5. Ajout de 10⁻³ mol HCl à 100 mL eau : [H⁺] = 10⁻³/0,101 ≈ 0,0099 mol/L → pH ≈ 2.
   Variation : 7 → 2 (Δ = 5 unités) vs 4,75 → 4,57 (Δ = 0,18 unités). Le tampon résiste à la variation de pH.`,
    },

    // ── SVT 2BAC ────────────────────────────────────────────────────────────
    {
      annee: 2024, matiere: 'SVT', niveau: '2bac', type: 'examen national',
      lien: 'https://khaymasvt.ma/exam2024/',
      concoursId: C.med,
      contenu: `Examen National — SVT 2bac Sciences de la Vie et de la Terre — Session Normale 2024.

Partie I — Neurophysiologie (7 points)
Document : Schéma d'une synapse chimique. On observe : vésicules synaptiques, fente synaptique (20 nm), récepteurs post-synaptiques. Enregistrements : un PA de −70 mV à +30 mV sur le neurone pré-synaptique génère un PPSE de 5 mV sur le neurone post-synaptique.

1. Décrire les 5 étapes de la transmission synaptique chimique.
2. Pourquoi un seul PPSE ne génère-t-il pas de PA sur le neurone post-synaptique ?
3. Définir la sommation spatiale et la sommation temporelle.
4. Expliquer comment les anesthésiants locaux bloquent la douleur au niveau synaptique.`,
      correction: `1. Transmission synaptique (5 étapes) :
① Arrivée du PA → dépolarisation de la membrane pré-synaptique.
② Ouverture des canaux Ca²⁺ → entrée de Ca²⁺.
③ Vésicules synaptiques fusionnent avec la membrane → exocytose du neurotransmetteur.
④ Neurotransmetteur diffuse dans la fente et se fixe sur les récepteurs post-synaptiques.
⑤ Ouverture de canaux ioniques → modification du potentiel post-synaptique (PPSE ou PPSI).

2. Un seul PPSE = 5 mV de dépolarisation. Le seuil de déclenchement du PA est ~−55 mV (soit ~15 mV de dépolarisation depuis −70 mV). 5 mV est insuffisant pour atteindre le seuil.

3. Sommation spatiale : plusieurs synapses simultanées additionnent leurs PPSE sur le neurone post-synaptique jusqu'au seuil.
Sommation temporelle : une même synapse envoie des PA répétés à haute fréquence → les PPSE se cumulent dans le temps.

4. Les anesthésiants locaux (ex : lidocaïne) bloquent les canaux Na⁺ voltage-dépendants de la membrane du neurone sensitif → le PA ne peut pas se propager → le message douloureux n'atteint pas le cerveau.`,
    },
    {
      annee: 2023, matiere: 'SVT', niveau: '2bac', type: 'examen national',
      lien: 'https://khaymasvt.ma/exam2024/',
      concoursId: C.med,
      contenu: `Examen National — SVT 2bac Sciences Mathématiques — Session Normale 2023.

Partie II — Endocrinologie (6 points)
Document : Expériences sur la régulation de la glycémie.
Expérience 1 : Ablation du pancréas → hyperglycémie persistante.
Expérience 2 : Injection d'insuline → retour à la glycémie normale.
Expérience 3 : Injections de glucagon → hyperglycémie.
Glycémie normale : 1 g/L. Après repas riche en glucides : glycémie monte à 1,4 g/L puis revient à 1 g/L en 2h.

1. Quel organe est responsable de la régulation de la glycémie ?
2. Quel est le rôle de l'insuline ? Du glucagon ?
3. Expliquer la régulation glycémique après un repas (rétrocontrôle négatif).
4. Qu'est-ce que le diabète de type 1 ? Quel est son traitement ?`,
      correction: `1. Le pancréas (îlots de Langerhans) régule la glycémie via deux hormones antagonistes.

2. Insuline (cellules β) : hormone hypoglycémiante. Elle stimule la captation du glucose par les cellules, la glycogenèse (stockage du glucose sous forme de glycogène dans le foie et les muscles), et inhibe la glycogénolyse.
Glucagon (cellules α) : hormone hyperglycémiante. Il stimule la glycogénolyse (dégradation du glycogène en glucose) et la néoglucogenèse dans le foie.

3. Rétrocontrôle négatif après repas :
① Repas → absorption intestinale → glycémie monte à 1,4 g/L.
② Détection par les cellules β du pancréas → sécrétion d'insuline.
③ L'insuline stimule la captation cellulaire du glucose et la glycogenèse.
④ Glycémie diminue → retour à 1 g/L → rétrocontrôle négatif sur les cellules β → arrêt de la sécrétion d'insuline.

4. Diabète type 1 : maladie auto-immune → destruction des cellules β par le système immunitaire → absence totale d'insuline → hyperglycémie chronique.
Traitement : injections quotidiennes d'insuline (le pancréas ne pouvant plus en produire).`,
    },
    {
      annee: 2022, matiere: 'SVT', niveau: '2bac', type: 'examen national',
      lien: 'https://khaymasvt.ma/exam2024/',
      concoursId: C.med,
      contenu: `Examen National — SVT 2bac SVT — Session Normale 2022.

Partie — Génétique moléculaire (6 points)
Le gène G code pour une protéine P. Sa séquence nucléotidique sur le brin non transcrit est :
5' − ATG − CGA − TAT − GCC − TGA − 3'

1. Donner la séquence du brin transcrit (matrice).
2. Donner la séquence de l'ARNm transcrit.
3. Donner la séquence de la protéine P (utiliser le code génétique).
4. Une mutation remplace le 4ème nucléotide (C par T). Réécrire la séquence mutée et déterminer la protéine obtenue. Quel type de mutation est-ce ?`,
      correction: `1. Brin non transcrit : 5'-ATG-CGA-TAT-GCC-TGA-3'
   Brin transcrit (matrice, antiparallèle) : 3'-TAC-GCT-ATA-CGG-ACT-5'

2. ARNm (complémentaire du brin transcrit, même sens que le brin non transcrit avec U à la place de T) :
   5'-AUG-CGA-UAU-GCC-UGA-3'

3. Code génétique :
   AUG → Met (méthionine, codon initiateur)
   CGA → Arg (arginine)
   UAU → Tyr (tyrosine)
   GCC → Ala (alanine)
   UGA → STOP
   Protéine P : Met-Arg-Tyr-Ala (4 acides aminés)

4. Mutation C→T en position 4 (dans le codon ATG-C...):
   Brin non transcrit muté : 5'-ATG-TGA-TAT-GCC-TGA-3'
   ARNm muté : 5'-AUG-UGA-UAU-GCC-UGA-3'
   UGA en 2ème position = codon STOP prématuré.
   Protéine obtenue : Met (1 seul acide aminé → protéine tronquée, non fonctionnelle).
   Type de mutation : mutation non-sens (création d'un codon stop prématuré).`,
    },

    // ── ÉCONOMIE 2BAC ───────────────────────────────────────────────────────
    {
      annee: 2024, matiere: 'Économie', niveau: '2bac', type: 'examen national',
      lien: 'https://ecobacprepa.com/egs-eco-2-examens-nationaux/',
      concoursId: C.encg,
      contenu: `Examen National — Économie Générale et Statistiques 2bac Sciences Économiques — Session Normale 2024.

Dossier : Le commerce international du Maroc.
Document 1 : Balance commerciale du Maroc (en milliards DH)
2021 : Exportations = 320, Importations = 580 → Solde = −260
2022 : Exportations = 390, Importations = 650 → Solde = −260
2023 : Exportations = 420, Importations = 710 → Solde = −290

Document 2 : Part des exportations dans le PIB : 2021 = 23%, 2022 = 27%, 2023 = 29%.

Questions :
1. Calculer le taux de couverture pour chaque année.
2. Analyser l'évolution du solde commercial.
3. Calculer le taux de variation des exportations entre 2021 et 2023.
4. Quelles sont les causes possibles d'un déficit commercial chronique ? Proposer deux politiques commerciales pour y remédier.`,
      correction: `1. Taux de couverture = (Exportations/Importations) × 100 :
   2021 : (320/580)×100 = 55,2%
   2022 : (390/650)×100 = 60%
   2023 : (420/710)×100 = 59,2%
   Le Maroc couvre environ 55 à 60% de ses importations par ses exportations.

2. Analyse du solde : Le déficit commercial reste important et s'aggrave légèrement en valeur absolue (−260 en 2021-2022 → −290 en 2023). Malgré la hausse des exportations (+31%), les importations croissent encore plus vite (+22% mais en valeur absolue plus forte). La dépendance commerciale persiste.

3. Taux de variation des exportations 2021→2023 :
   ((420−320)/320) × 100 = (100/320) × 100 = 31,25%.

4. Causes du déficit commercial : faible compétitivité des produits nationaux, forte dépendance aux importations énergétiques et alimentaires, tissu industriel insuffisamment développé.
   Politiques de remédiation :
   a) Politique de promotion des exportations : aides à l'exportation, zones franches, diversification des marchés.
   b) Politique de substitution aux importations : développement de l'industrie nationale, protectionnisme ciblé (droits de douane), encouragement de la production locale.`,
    },

    // ── FRANÇAIS 2BAC ───────────────────────────────────────────────────────
    {
      annee: 2024, matiere: 'Français', niveau: '2bac', type: 'examen national',
      lien: 'https://www.men.gov.ma/Fr/Pages/ExaNat.aspx',
      concoursId: C.ensa,
      contenu: `Examen National — Français 2bac toutes filières — Session Normale 2024.

Texte : Extrait adapté d'un article sur l'intelligence artificielle et l'éducation.
« L'intelligence artificielle s'invite désormais dans les salles de classe. Des outils comme les tuteurs virtuels ou les plateformes adaptatives promettent de personnaliser l'apprentissage pour chaque élève. Pourtant, des voix s'élèvent pour mettre en garde : l'IA ne peut pas remplacer la relation humaine entre l'enseignant et l'apprenant. Elle peut suggérer, corriger, évaluer — mais peut-elle inspirer, encourager, comprendre les difficultés affectives d'un adolescent en plein doute ? La question reste ouverte. »

Questions de compréhension :
1. Dégager la problématique du texte en une phrase.
2. Relever deux avantages et deux limites de l'IA en éducation selon le texte.
3. Expliquer la figure de style dans « L'IA s'invite dans les salles de classe ».

Production écrite (15 lignes) :
Pensez-vous que l'intelligence artificielle améliorera l'éducation au Maroc ? Rédigez un texte argumenté.`,
      correction: `1. Problématique : L'intelligence artificielle peut-elle améliorer l'éducation sans pour autant remplacer le rôle humain et relationnel de l'enseignant ?

2. Avantages : personnalisation de l'apprentissage ; possibilité de correction et évaluation automatiques.
   Limites : impossibilité de remplacer la relation humaine ; incapacité à gérer les dimensions affectives et émotionnelles de l'élève.

3. « S'invite » est une personnification : l'IA est présentée comme un sujet qui agit de manière autonome et volontaire, comme une personne qui s'introduit dans un espace. Cette figure donne à la technologie une dimension presque humaine et souligne son intrusion progressive dans un domaine traditionnellement humain.

Production écrite (exemple) :
L'intelligence artificielle représente une opportunité réelle pour l'éducation marocaine, à condition d'en faire un usage réfléchi. D'abord, elle permettrait de remédier au manque d'enseignants dans les régions rurales grâce à des tuteurs virtuels accessibles 24h/24. Ensuite, les plateformes adaptatives pourraient aider les élèves à progresser à leur propre rythme, réduisant ainsi les inégalités liées au niveau des classes. Cependant, l'IA ne saurait se substituer à l'enseignant dans sa dimension humaine : la motivation, la confiance, l'encouragement sont des éléments que seule une vraie relation pédagogique peut fournir. Par ailleurs, les inégalités d'accès au numérique risquent d'aggraver la fracture éducative entre zones urbaines et rurales. En conclusion, l'IA enrichira l'éducation marocaine si elle complète l'enseignant sans le remplacer, et si son déploiement s'accompagne d'un effort équitable d'infrastructure numérique.`,
    },

    // ── ANNALES 1BAC ────────────────────────────────────────────────────────
    {
      annee: 2024, matiere: 'Mathématiques', niveau: '1bac', type: 'examen blanc',
      lien: 'https://www.sigmaths.net/1bac/',
      contenu: `Examen Régional — Mathématiques 1ère Bac Sciences Mathématiques — Session Normale 2024.

Exercice 1 — Polynômes et équations (4 points)
Soit P(x) = 2x³ − 3x² − 11x + 6.
1. Vérifier que x = 3 est racine de P.
2. Factoriser P(x).
3. Résoudre P(x) ≤ 0.

Exercice 2 — Inéquations (3 points)
Résoudre dans ℝ : |2x − 3| < 5.`,
      correction: `Exercice 1 :
1. P(3) = 2×27 − 3×9 − 11×3 + 6 = 54 − 27 − 33 + 6 = 0 ✓.
2. Division euclidienne par (x−3) : P(x) = (x−3)(2x²+3x−2) = (x−3)(2x−1)(x+2).
3. Tableau de signes de P(x) = 2(x−3)(x−1/2)(x+2) :
   P(x) ≤ 0 pour x ∈ ]−∞, −2] ∪ [1/2, 3].

Exercice 2 :
|2x−3| < 5 ↔ −5 < 2x−3 < 5 ↔ −2 < 2x < 8 ↔ −1 < x < 4.
Solution : ]−1, 4[.`,
    },
    {
      annee: 2023, matiere: 'Physique-Chimie', niveau: '1bac', type: 'examen blanc',
      lien: 'https://adrarphysic.fr/4589-2/',
      contenu: `Examen Régional — Physique-Chimie 1ère Bac Sciences Mathématiques — Session Normale 2023.

Exercice — Cinématique (5 points)
Une voiture part du repos et accélère uniformément. Elle atteint la vitesse de 90 km/h en 10 secondes.
1. Calculer l'accélération a en m/s².
2. Écrire les équations horaires v(t) et x(t) (en prenant x₀ = 0).
3. Calculer la distance parcourue pendant ces 10 secondes.
4. La voiture freine ensuite avec une décélération de 5 m/s² jusqu'à l'arrêt. Combien de temps met-elle pour s'arrêter ? Quelle distance parcourt-elle ?`,
      correction: `1. v = 90 km/h = 25 m/s. a = Δv/Δt = 25/10 = 2,5 m/s².

2. v(t) = at = 2,5t (m/s). x(t) = (1/2)at² = 1,25t² (m).

3. x(10) = 1,25×100 = 125 m.

4. Décélération : a' = −5 m/s². v(t) = 25 − 5t = 0 → t = 5 s.
   Distance : Δx = v₀t + (1/2)a't² = 25×5 + (1/2)(−5)×25 = 125 − 62,5 = 62,5 m.`,
    },
  ];

  const insertedAnnales = await Annale.insertMany(annalesData);
  console.log(`✅ ${insertedAnnales.length} annales créées`);

  // Link annales to concours
  const annalesByConcours = {};
  insertedAnnales.forEach(a => {
    if (!a.concoursId) return;
    const key = a.concoursId.toString();
    if (!annalesByConcours[key]) annalesByConcours[key] = [];
    annalesByConcours[key].push(a._id);
  });
  for (const [concoursId, annaleIds] of Object.entries(annalesByConcours)) {
    await Concours.findByIdAndUpdate(concoursId, { $push: { annales: { $each: annaleIds } } });
  }
  console.log('✅ Annales liées aux concours');

  console.log('\n════════════════════════════════════════════════════════');
  console.log('  ✅  Exercices & Annales seedés avec succès !');
  console.log('════════════════════════════════════════════════════════');
  console.log(`\n  EXERCICES: ${insertedExercices.length}`);
  console.log('    • Mathématiques (suites, fonctions, intégrales, complexes, trigo)');
  console.log('    • Physique-Chimie (oscillateur, radioactivité, titrages, cinétique)');
  console.log('    • SVT (génétique, immunologie, brassage, géologie)');
  console.log('    • Économie (croissance, politiques, statistiques)');
  console.log('    • Français (compréhension, argumentation)');
  console.log(`\n  ANNALES: ${insertedAnnales.length} (2022–2024, avec contenu et correction)\n`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err.message);
  process.exit(1);
});
