# Écrire ou étoffer une page de VisaCalc (uk-visas)

Notice pour les agents qui écrivent ou prolongent le site. À lire en entier, avec `~/Documents/GitHub/RECETTE-SITE.md`
(§0, §6, §6.5, §7, §9.3, §11, §17.4, §21, §26) et le rapport SERP `~/Documents/GitHub/reports/uk-visas-serp-2026-10-13.md`.

Le site : calculateurs de visas du Royaume-Uni (seuil Skilled Worker par code SOC, coût visa + IHS pour une famille,
revenu du spouse visa, dates d'ILR et de naturalisation avec la règle glissante des 180 jours, délais, registre des
sponsors). **Anglais britannique seul**, sous `/en/` (« naturalisation », « licence », « programme », « organisation »,
dates « 8 October 2026 », livres « £41,700 »). Éditeur : **Radif Partners** (jamais un nom de personne). Partout :
**not legal advice, not affiliated with the Home Office**. Aucun lien vers un autre site du portefeuille
(`_trame/domaines-ovh.txt`), aucune collecte de leads, aucun nom d'organisme dans le nom du site ni le logo.

## D'où viennent les chiffres

| Donnée | Source (OGL v3) | Fichier | Rebâtir |
|---|---|---|---|
| Frais (12 barèmes depuis le 31 janvier 2024, barème courant du 8 octobre 2026) | gov.uk/government/publications/visa-regulations-revised-table (ODS) | `src/data/fees.json` | `python3 scripts/build-data.py --only fees` |
| 412 codes SOC 2020, tables 1, 1a, 2, 3, 3a, 4, 5, 6, taux imprimés à 90/80/70 % | Appendix Skilled Occupations (API de contenu GOV.UK) | `src/data/soc.json` | `--only soc` |
| Immigration Salary List, Temporary Shortage List (SW 6.1A) | Appendix ISL, Appendix Skilled Worker | `src/data/soc.json` (`isl`, `tsl`) | `--only soc` |
| Registre des sponsors (CSV quotidien, 143 218 lignes, 127 800 organisations au 2026-10-13) | gov.uk/government/publications/register-of-licensed-sponsors-workers | `public/data/sponsors/<lettre>.json`, `src/data/sponsors-meta.json` | `--only sponsors` (quotidien, `.github/workflows/rebuild.yml`) |
| Jours fériés | gov.uk/bank-holidays.json | `src/data/bank-holidays.json` | `--only holidays` |
| Seuils, règles, IHS, family, settlement, citizenship, student, sponsor, délais, sources | pages GOV.UK lues le 2026-10-13 | `src/data/params-2026.json` | à la main, avec la source |

Textes GOV.UK lus (pièces d'audit, à relire avant d'écrire) : `scripts/data-raw/govuk/*.txt` (pages de chaque route,
appendices des règles, guidance continuous residence v10.0) et `scripts/data-raw/rules-changes/*.txt` (mémorandums HC 1691,
HC 259, HC 584). Un fait qui n'est pas dans ces fichiers ou dans `params-2026.json` ne s'écrit pas, ou se lit d'abord sur
GOV.UK avec `curl -sL -A 'Mozilla/5.0 …' https://www.gov.uk/api/content/<chemin>` puis s'ajoute aux pièces.

## Une page = un fichier

`src/content/pages/<id>.ts` (`definePage`, types dans `src/lib/page-types.ts`). Modèle : `skilled-worker-visa.ts`
(copier la **structure**, jamais les phrases). Les ids prévus sont dans `PLANNED` de `src/i18n/routes.ts` : on peut lier
une page pas encore écrite.

| Champ | Règle |
|---|---|
| `id` | = nom du fichier = segment d'URL |
| `group` | `work`, `family`, `settlement`, `study`, `costs`, `employers` |
| `order` | ordre dans le menu du groupe (10, 20…) |
| `nav`, `card` | libellé court ; une phrase pour les cartes « Read next » |
| `title` | **50 à 60 caractères**, terme-clé d'abord, jamais « UK », « British », « How », « Calculator » en tête (ex. « Citizenship Application UK 2026: … ») |
| `description` | **150 à 160 caractères**, unique |
| `h1` | proche de la requête, différent du titre |
| `intro` | 1 ou 2 phrases, ≤ 45 mots, la réponse directe avec le chiffre clé |
| `resume` | **un seul paragraphe ≥ 120 mots** (130–170 visés) : la réponse citable, chiffres du kit |
| `tool` | le simulateur du premier écran : `{ kind, props }` (voir plus bas) |
| `body(h)` | 2 à 4 `<h2>` propres à la page, `<p>`, `<ul>`, tableaux `h.table(...)` ; **450 à 900 mots de prose** ; un second simulateur possible avec `${h.tool({...})}` |
| `faqs` | 3 à 5 questions (6 à 8 si le corps dépasse 1 100 mots), réponses de **40 à 90 mots**, question jamais posée ailleurs sur le site |
| `related` | ≥ 3 ids |
| `sources` | ≥ 2 clés de `params-2026.json > sources` (en ajouter si besoin, avec URL GOV.UK lue) |

### Simulateurs (`tool.kind` et `props`)

| kind | Composant | props utiles |
|---|---|---|
| `sw` | `SkilledWorkerTool` | `initialCode` (SOC), `initialSalary`, `initialSituation` (`standard`, `new-entrant`, `phd-stem`, `phd-other`, `postdoc`), `title` |
| `cost` | `CostTool` | `initialRoute` (`skilled-worker`, `health-and-care`, `student`, `graduate`, `global-talent`, `hpi`, `partner`, `fiance`, `ancestry`, `visitor`, `ilr`, `citizenship`), `initialWhere` (`outside`/`inside`), `initialMonths`, `initialPartner`, `initialChildren`, `title` |
| `ilr` / `absence` / `citizenship` | `SettlementTool` (même outil, titre et chiffre de tête différents) | `initialRoute` (`skilled-worker`, `family`, `global-talent-3`, `global-talent-5`, `ancestry`, `long-residence`), `title` |
| `spouse` | `SpouseTool` | `initialEmployment`, `initialStage` (`entry`, `extension`, `settlement`), `title` |
| `time` | `TimeTool` | `initialRoute` (`skilled-worker`, `health-and-care`, `student`, `visitor`, `partner`, `global-talent`, `hpi`, `ancestry`, `graduate`, `ilr`, `citizenship`), `initialWhere` |
| `history` | `FeeHistoryTool` | `initial` (id de `HISTORY_SERIES` dans `lib/engine/fees.ts`) |
| `student` | `StudentTool` | `title` |
| `licence` | `SponsorCostTool` | `title` |
| `sponsor` | `SponsorSearch` | `initialQuery`, `initialTown`, `initialRoute` |

Chaque outil donne un `title` différent par page (c'est le H2 du cadre).

## Le kit (`h` dans `body`, `K` = `KIT` dans le fichier)

`K.P` (params), `K.FEE.<ligne>()` (frais du barème courant, voir `lib/engine/fees.ts`), `K.ihs(mois, 'outside'|'inside', réduit)`,
`K.visaCost({...})`, `K.checkSkilledWorker({...})`, `K.occ(code)` (occupation : `title`, `examples`, `table`, `goingRate`, `r90/r80/r70`,
`goingRateTransitional`, `isl`, `tsl`, `phd`), `K.payOptions(occ, nation)`, `K.OCCUPATIONS`, `K.BANDS`, `K.TEACHERS`, `K.count('Table 1')`,
`K.isl()`, `K.tsl()`, `K.requiredIncome`, `K.spouseTest`, `K.settlementDate`, `K.citizenshipDate`, `K.decisionDate`, `K.skillsCharge`,
`K.sponsorCost`, `K.studentFunds`, `K.SPONSORS` (meta du registre, `topTowns`), `K.FEES` (versions), `K.HISTORY_SERIES`, `K.feeHistory`,
`K.date(iso)` « 8 October 2026 », `K.gbp(x)` « £41,700 », `K.int`, `K.pct(0.7)` « 70 % », `K.listOf([...])`.
Dans le corps : `h.a(id, texte)` lien interne, `h.src(clé, texte?)` source officielle, `h.ext(url, texte)` lien GOV.UK, `h.table(...)`,
`h.box(titre, html)`, `h.tool({ kind, props })`.

## La règle de vérité (non négociable)

- **Aucun montant, seuil ou date réglementaire tapé à la main** : tout vient du kit. Le test refuse un nombre de 5 chiffres
  écrit en clair. Un code SOC ou une année s'écrivent tels quels.
- Rien d'invérifiable : pas de taux de refus, pas de délai « réel » non publié, pas de salaire de marché, pas de nom
  d'employeur « qui sponsorise » hors du registre. Un doute = on ne l'écrit pas.
- Les projets (earned settlement, Life in the UK test refondu, etc.) sont des projets : on dit « proposed », jamais
  « from 2026 the rule is ».
- Pas de conseil personnel : on explique la règle et on renvoie au simulateur ; pour un refus, un recours ou un passé
  compliqué, solicitor ou adviser registered with the Immigration Advice Authority.

## Ton

Anglais britannique, voix humaine, phrases de longueur variable, le chiffre d'abord, la deuxième personne. Interdits :
tiret cadratin, « it's important to note », « delve », « dive into », « whether you're », « moreover », « furthermore »,
« crucial », « navigate the », « seamless », « unlock », « embark », « in today's », conclusions-résumés, émojis.
Unicité (§6, `check-unique.py` ≤ 30 %) : chaque page parle de son sujet avec son propre vocabulaire et ses propres
exemples chiffrés ; ne reprendre aucune tournure d'une autre page, même entre pages voisines (spouse visa / spouse cost /
financial requirement ; pages métier).

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/uk-visas
export NODE_PATH=$(npm root -g):$PWD/node_modules
PAGE_FILES=spouse-visa-uk npx vitest run tests/pages.test.ts   # une page
npx vitest run                                                   # tout
npm run build                                                    # inclut typo-nbsp et check-snippets
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py .
python3 scripts/check-simulateurs.py . ; python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py .
python3 scripts/check-cookies.py . ; python3 scripts/check-liens.py . ; python3 scripts/check-snippets.py .
node scripts/check-legal.mjs ; node scripts/check-sources.mjs . ; node scripts/typo-nbsp.mjs dist --check
node scripts/check-contraste.mjs dist ; node scripts/check-nombres.mjs dist ; node scripts/check-saisie.mjs dist --max=60
node scripts/check-url-propre.mjs dist ; node scripts/check-premier-ecran.mjs . ; node scripts/check-layout.mjs .
```

Serveur local : port **4591** (`npm run preview`). Pour l'arrêter : `lsof -ti tcp:4591 | xargs kill` (jamais `pkill -f`).

## À refaire

- **Chaque jour ouvré** : registre des sponsors (`--only sponsors`, workflow GitHub Actions), puis build.
- **À chaque nouveau barème ou Statement of Changes** : `python3 scripts/build-data.py --refresh`, relire
  `params-2026.json` sur GOV.UK (seuils, IHS, family, student), relancer `npx vitest run` ; les tests de
  `tests/engine.test.ts` reprennent les exemples GOV.UK.
- **Dates connues** : 30 novembre 2026 (maintenance Student, déjà dans le moteur), 31 décembre 2026 (fin TSL et de la
  plupart des entrées ISL : relire les deux listes), 1er janvier 2027 (Graduate 18 mois), 26 mars 2027 (B2 pour
  l'ILR), 22 juillet 2028 (fin des switches care worker).

## Ce qu'on ne fait pas

Pas de dépôt GitHub, pas de push, pas de DNS. Ne toucher ni à `_trame` ni à la RECETTE. `CLARITY_ID` reste vide jusqu'à
l'achat du domaine. Pas de page Life in the UK test (hors périmètre), pas de page ETA en tête (navigation) : la page
Standard Visitor cite l'ETA.
