# CR Drive

Сайт CR Drive: полностью тёмное оформление, выразительная жирная типографика, вступление с новостным монтажом, ShimmerText, интерактивный мониторинг, тарифы и калькулятор автопарка. React, TypeScript, Tailwind CSS 4, Vite. Три языка: RU/KZ/EN.

Instagram проекта: https://www.instagram.com/crdrive.kz/.

## Публикация

Репозиторий: https://github.com/nurtas-07/cr-drive12

В **Settings → Pages → Source** выберите **GitHub Actions**. Каждый push в `main` запускает `.github/workflows/deploy-pages.yml`: установка зависимостей → проверка TypeScript → сборка → публикация содержимого `dist`.

После успешного запуска сайт будет доступен на https://nurtas-07.github.io/cr-drive12/.

Команды CMD и первая настройка: [DEPLOY.md](DEPLOY.md).

## Разработка

```cmd
npm ci
npm run dev
```

```cmd
npm run build
```

Тексты и новости: `src/content.ts`. Вступление: `src/components/Intro.tsx`. UI-компоненты: `src/components/ui/`. Оформление: `src/styles.css`. Существующий рабочий кабинет: `public/dispatcher.html`.

Подробная структура и зависимости: [DEVELOPMENT.md](DEVELOPMENT.md). Происхождение изображений: [ASSETS-AND-SOURCES.md](ASSETS-AND-SOURCES.md).
