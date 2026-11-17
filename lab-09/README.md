# Keepsake — landing-keepsake-vite

Адаптивний односторінковий лендінг агенції Keepsake, перенесений із макета ЛР №7 у робочий процес Vite + Pug + SCSS. Збережено мобільне меню на Popover API, фільтр робіт на radio/`:checked`, адаптивну кількість карток, стани форми та стиль оригінальної сторінки.

**Демо:** https://mobi82123-hub.github.io/web-technologies/ (після публікації через GitHub Actions)

## Запуск

Потрібен Node.js 20 або новіший з npm.

```bash
npm install
npm run dev
```

Інші команди:

```bash
npm run build       # збирає сайт у dist/
npm run preview     # локальний перегляд зібраного сайту
npm run images      # готує AVIF, WebP та JPEG-копії
npm run format      # форматує Pug, SCSS, JS, JSON і Markdown
npm run lint        # Stylelint і перевірка Prettier
```

`npm run dev` та `npm run build` автоматично запускають `npm run images`. Для чистого клонування використовуйте `npm ci`. Папки `node_modules/` і `dist/` ігноруються Git; `package-lock.json` зберігається в репозиторії.

## Структура

```text
lab-09/
├── .husky/pre-commit        # lint-staged перед комітом
├── public/images/           # згенеровані responsive-зображення
├── reports/image-sizes.json # розміри джерел та оптимізованих файлів
├── scripts/optimize-images.mjs
├── scripts/normalize-output.mjs
├── src/
│   ├── assets/images/source/ # оригінальні зображення ЛР №7
│   ├── components/sections/  # окремі Pug-секції сторінки
│   ├── data/data.pug         # дані для циклів і карток
│   ├── includes/icons.pug    # SVG-спрайт
│   ├── layouts/main.pug      # базовий макет
│   ├── mixins/ui.pug         # кнопка, іконка, picture, картка роботи
│   ├── pages/index.pug       # Pug-сторінка, що успадковує макет
│   └── styles/               # abstracts, base, layout, components
├── postcss.config.js
├── vite.config.js
└── package.json
```

Workflow GitHub Pages зберігається в `../.github/workflows/lab-09-pages.yml`.

## Реалізація вимог

- **Pug:** `extends`, блоки `meta`, `title`, `styles`, `content`, `scripts`, `append`/`prepend`, `include`, масиви даних, `each`, `if`, `unless`, `case/when`, інтерполяція, умовні класи та службові `//-` коментарі. Міксини `+btn`, `+icon`, `+picture`, `+work-card` розділяють повторювану розмітку; кнопка приймає `block` і довільні `&attributes`.
- **SCSS:** тільки `@use`/`@forward`; дизайн-токени й брейкпоінти зберігаються в map-ах, а кольори та розміри експортуються як CSS custom properties. Є функція `rem()`, mobile-first міксин `mq()` та допоміжні міксини. Компоненти використовують BEM і вкладеність не більш як три рівні.
- **Фільтр портфоліо:** CSS radio-перемикачі фільтрують картки без JavaScript. На мобільному видно 5 робіт, на планшеті — 8, на широкому екрані — 9.
- **Зображення:** вісім вихідних WebP з попередньої роботи конвертуються `sharp` у AVIF/WebP/JPEG шириною 320 і 358 px. `+picture` генерує `srcset`, `sizes`, alt, розміри та `decoding="async"`; картки мають `loading="lazy"`.
- **CSS pipeline:** Vite компілює SCSS і мініфікує production CSS; PostCSS запускає Autoprefixer за Browserslist. `cssnano` не потрібен.
- **Якість коду:** Prettier підключений до Pug через `@prettier/plugin-pug`; Stylelint налаштований на BEM, глибину вкладення до 3, без ID-селекторів і `!important`. Husky запускає `lint-staged` перед комітом.

## Браузери та розмір зображень

Browserslist підтримує останні дві версії Chrome, Firefox, Edge і Safari, а також iOS Safari 16+. Після `npm run images` скрипт записує точні розміри оригіналів і 48 вихідних файлів у `reports/image-sizes.json`; показники не фіксуються вручну.

| Артефакт                        | Кількість |                          Розмір |
| ------------------------------- | --------: | ------------------------------: |
| Вихідні WebP з ЛР №7            |         8 |                         25.3 KB |
| AVIF/WebP/JPEG, 320 px і 358 px |        48 | див. `reports/image-sizes.json` |

## Публікація

Workflow `.github/workflows/lab-09-pages.yml` у корені репозиторію збирає `lab-09/` і публікує артефакт GitHub Pages після push у `main`. У production Vite використовує `base: '/web-technologies/'`, що відповідає наданому репозиторію.
