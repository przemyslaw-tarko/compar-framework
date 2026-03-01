# Compar-Framework — porównanie Selenium / Cypress / Playwright + CI/CD + TestRail

Projekt realizowany w ramach pracy inżynierskiej – środowisko badawcze do porównania frameworków E2E w architekturze kontenerowej.

## Cel i zakres
- Porównanie łatwości konfiguracji i uruchomienia frameworków E2E (Selenium, Cypress, Playwright).
- Identyczne scenariusze testowe w każdym frameworku.
- Uruchamianie w Dockerze i spójne raportowanie.
- Integracja z CI/CD (GitHub Actions) oraz przygotowanie pod TestRail.

## Architektura
- **AUT**: aplikacja testowa (WordPress + DB) uruchamiana przez Docker Compose i dostępna pod `http://localhost:8080`.
- **Frameworki**: każdy framework uruchamiany w osobnym kontenerze runnera, w tej samej sieci dockerowej co AUT (`wpsite`).
- **Izolacja**: frameworki są niezależne — można je uruchamiać oddzielnie lub równolegle.
- **Raporty**: każdy framework zapisuje wyniki do `reports/` i publikuje je jako artifacts w CI.

## Struktura repo
```
apps/bookstore/            # docker-compose dla AUT (obrazy Docker)
apps/test-bookstore/       # submodule: źródła aplikacji testowej (AUT)
tests/selenium/            # Selenium + Mocha
tests/cypress/             # Cypress
tests/playwright/          # Playwright Test
reports/                   # wyniki testów (JUnit/HTML)
.github/workflows/         # CI/CD
```

## Wymagania lokalne
- Git
- Docker + Docker Compose v2
- Node.js zgodny z `.nvmrc` (dla lokalnych skryptów)

## Pobranie repo + submodule
AUT jest podpięte jako submodule. Po klonowaniu repo:

```bash
git submodule update --init --recursive
```

## Uruchomienie AUT
```bash
cp .env.example .env
npm install
npm run env:up
npm run env:wait
```

AUT będzie dostępna pod:
```
http://localhost:8080
```

## Uruchomienie testów
```bash
npm run test:selenium
npm run test:cypress
npm run test:playwright
```

## Scenariusze testowe (aktualny etap)
- Selenium: tytuł strony zawiera `Test App`.
- Cypress: tytuł strony zawiera `Test App`.
- Playwright: tytuł strony zawiera `Test App`.

## Raporty
- `reports/selenium/html`
- `reports/selenium/junit`
- `reports/cypress/junit`
- `reports/playwright/html`

## Logi (cisza / debug)
Domyślnie logi z oczekiwania na aplikację i z Docker Compose są wyciszone.
Aby włączyć pełne logi:
```bash
VERBOSE_LOGS=true npm run test:selenium
```

## CI/CD (aktualny przepływ)
1. `auto-pr.yml` — tworzy PR dla każdego brancha poza `main`.
2. `ci.yml` — lint + testy tylko tych frameworków, których kod się zmienił (tylko na PR).
3. `auto-merge.yml` — włącza auto‑merge po zielonym CI.
4. `cd.yml` — publikuje obrazy testów do GHCR po merge do `main`.

## CD: obrazy testów w GHCR
Po merge do `main` publikowane są obrazy:
- `ghcr.io/przemyslaw-tarko/compar-selenium-tests:latest`
- `ghcr.io/przemyslaw-tarko/compar-cypress-tests:latest`
- `ghcr.io/przemyslaw-tarko/compar-playwright-tests:latest`

Pobieranie obrazów:
```bash
docker pull ghcr.io/przemyslaw-tarko/compar-selenium-tests:latest
```

Jeśli obrazy są prywatne, zaloguj się do GHCR:
```bash
echo <TOKEN> | docker login ghcr.io -u przemyslaw-tarko --password-stdin
```

## TestRail (przygotowane)
Integracja jest gotowa przez zmienne środowiskowe:
- `TESTRAIL_ENABLED`
- `TESTRAIL_URL`
- `TESTRAIL_USER`
- `TESTRAIL_API_KEY`
- `TESTRAIL_PROJECT_ID`
- `TESTRAIL_RUN_ID`

## Porządek z branchami
W repo jest włączone **Automatically delete head branches**, więc po merge PR zdalny branch jest kasowany automatycznie.
Lokalne branche można sprzątać:
```bash
git fetch --prune
git branch -d <branch>
```

## Troubleshooting
1) `apps/test-bookstore` jest puste
```bash
git submodule update --init --recursive
```

2) Runner nie widzi AUT / błąd DNS `wordpress`
- sprawdź `npm run env:up` i `npm run env:wait`
- sprawdź sieć `wpsite`

3) Strona nie działa w przeglądarce
```bash
curl -I http://localhost:8080
```

## Roadmap
- Pełny scenariusz biznesowy wspólny dla trzech frameworków.
- Metryki porównawcze: czas, flakiness, powtarzalność.
- Integracja z TestRail (publikacja wyników + mapowanie case’ów).
- Raport zbiorczy z wynikami w CI.

## Autor
Przemysław Tarko
