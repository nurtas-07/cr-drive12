# Публикация CR Drive12

Локальная папка подключена к https://github.com/nurtas-07/cr-drive12.git. Подготовлено обновление: полностью тёмная тема, жирная типографика и Instagram @crdrive.kz. Это обновление ещё не отправлено на GitHub.

## 1. Настройка Pages

Откройте https://github.com/nurtas-07/cr-drive12/settings/pages.
В Build and deployment → Source выберите **GitHub Actions**.

Если GitHub Actions уже выбран, менять настройку не нужно. При необходимости после настройки откройте Actions → Deploy CR Drive to GitHub Pages → Run workflow → main → Run workflow.

## 2. Команды для Windows CMD

Выполняйте по одной строке. Не добавляйте `^` и не пишите `&&` в начале следующей строки.

```cmd
cd /d "%USERPROFILE%\Documents\Codex\2026-11-04\https-cr-drive-pages-dev-https\outputs\CR-Drive12-Deploy"
git add .
git commit -m "Apply dark theme and update Instagram"
git push
```

При запросе входа авторизуйтесь в GitHub через окно браузера. Пароль аккаунта не нужно вставлять в CMD.

Если любой шаг завершился ошибкой, остановитесь на нём. Не используйте force push.

## 3. Проверить результат

Откройте https://github.com/nurtas-07/cr-drive12/actions.
После зелёного результата заданий **build** и **deploy** сайт будет доступен по адресу:

https://nurtas-07.github.io/cr-drive12/

Это ожидаемый адрес; до успешного деплоя он может показывать 404.

В дальнейшем редактируйте файлы в `src` и `public`. После `git add .`, `git commit` и `git push` GitHub автоматически установит зависимости из package-lock.json, проверит TypeScript, соберёт Vite и опубликует содержимое `dist`.

В репозиторий не включены node_modules, локальные пароли или служебные файлы сессии. Публичная конфигурация существующего кабинета диспетчера сохранена из исходного проекта; доступ к его данным по-прежнему требует входа.
