# Compar Frameworks: Selenium vs Cypress vs Playwright

Projekt do porównania trzech popularnych frameworków E2E (Selenium, Cypress, Playwright) na tej samej aplikacji testowej (Bookstore). Każdy framework działa w osobnym kontenerze, a aplikacja testowa w osobnych kontenerach z własną siecią.

## Założenia
- Jednolite scenariusze E2E w każdym frameworku (tu: proste smoke testy).
- Uruchamianie w Dockerze na osobnych kontenerach.
- Raporty HTML + JUnit w `reports/`.
- Integracja z TestRail przez zmienne środowiskowe.
- CI/CD w GitHub Actions z auto‑PR i auto‑merge po sukcesie testów.

## Struktura repo
```
apps/bookstore/            # docker-compose dla aplikacji testowej (obrazy Docker)
apps/test-bookstore/       # submodule: źródła aplikacji testowej (fork)
tests/selenium/            # Selenium + Mocha
/tests/cypress/            # Cypress
/tests/playwright/         # Playwright Test
reports/                   # generowane raporty
.github/workflows/         # CI/CD
```

## Szybki start (krok po kroku)
1. Skopiuj env:
```
cp .env.example .env
```
2. Uruchom aplikację:
```
npm install
npm run env:up
npm run env:wait
```
3. Uruchom testy:
```
npm run test:selenium
npm run test:cypress
npm run test:playwright
```

## Proste przykłady (co robi każdy test)
- Selenium: otwiera stronę główną i sprawdza tytuł.
- Cypress: otwiera `/` i sprawdza, czy `body` jest widoczny.
- Playwright: otwiera `/` i sprawdza tytuł strony.

## Submodule aplikacji testowej
Aplikacja testowa jest dodana jako submodule, aby mieć lokalny „snapshot” kodu i nie mieszać w oryginalnym repo:
```
git submodule update --init --recursive
```

## CI/CD (skrót)
- `auto-pr.yml` tworzy PR dla każdego brancha poza `main`.
- `ci.yml` uruchamia lint + testy tylko tych frameworków, których kod się zmienił.
- `ci-summary` jest jedynym wymaganym checkiem do merge.

## Raporty
Po testach raporty są w `reports/`:
- `reports/selenium/html`
- `reports/cypress/junit`
- `reports/playwright/html`

## Uwaga o obrazach
Runtime aplikacji testowej korzysta z gotowych obrazów Docker. Submodule jest tylko do wglądu i wersjonowania kodu aplikacji po Twojej stronie.
