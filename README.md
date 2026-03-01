# Compar Frameworks: Selenium vs Cypress vs Playwright

Projekt do porównania trzech popularnych frameworków E2E (Selenium, Cypress, Playwright) na tej samej aplikacji testowej (Bookstore). Każdy framework działa w osobnym kontenerze, a aplikacja testowa w osobnych kontenerach z własną siecią.

## Założenia
- Jednolite scenariusze E2E w każdym frameworku (tu: proste smoke testy).
- Uruchamianie w Dockerze na osobnych kontenerach.
- Raporty HTML + JUnit w `reports/`.
- Integracja z TestRail przez zmienne środowiskowe.
- CI/CD w GitHub Actions: auto‑PR → CI → auto‑merge → CD (publikacja obrazów testów).

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
- Selenium: otwiera stronę główną i sprawdza, czy tytuł zawiera `Test App`.
- Cypress: otwiera `/` i sprawdza, czy tytuł zawiera `Test App`.
- Playwright: otwiera `/` i sprawdza, czy tytuł zawiera `Test App`.

## Submodule aplikacji testowej
Aplikacja testowa jest dodana jako submodule, aby mieć lokalny „snapshot” kodu i nie mieszać w oryginalnym repo:
```
git submodule update --init --recursive
```

## CI/CD (skrót)
- `auto-pr.yml` tworzy PR dla każdego brancha poza `main`.
- `ci.yml` uruchamia lint + testy tylko tych frameworków, których kod się zmienił (tylko na PR).
- `auto-merge.yml` włącza auto‑merge po zielonym CI.
- `cd.yml` publikuje obrazy testów do GHCR po merge do `main`.

## Logi (cisza / debug)
Domyślnie logi z oczekiwania na aplikację i z Docker Compose są wyciszone.
Aby włączyć pełne logi:
```
VERBOSE_LOGS=true npm run test:selenium
```

## Porządek z branchami
W repo jest włączone **Automatically delete head branches**, więc po merge PR zdalny branch jest kasowany automatycznie.
Lokalne branche możesz sprzątać ręcznie:
```
git fetch --prune
git branch -d <branch>
```

## CD: obrazy testów w GHCR
Po merge do `main` publikowane są obrazy:
- `ghcr.io/przemyslaw-tarko/compar-selenium-tests:latest`
- `ghcr.io/przemyslaw-tarko/compar-cypress-tests:latest`
- `ghcr.io/przemyslaw-tarko/compar-playwright-tests:latest`

Pobieranie obrazów:
```
docker pull ghcr.io/przemyslaw-tarko/compar-selenium-tests:latest
```

Jeśli obrazy są prywatne, zaloguj się do GHCR:
```
echo <TOKEN> | docker login ghcr.io -u przemyslaw-tarko --password-stdin
```

## Raporty
Po testach raporty są w `reports/`:
- `reports/selenium/html`
- `reports/selenium/junit`
- `reports/cypress/junit`
- `reports/playwright/html`

## Uwaga o obrazach
Runtime aplikacji testowej korzysta z gotowych obrazów Docker. Submodule jest tylko do wglądu i wersjonowania kodu aplikacji po Twojej stronie.
