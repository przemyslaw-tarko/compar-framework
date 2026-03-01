# Compar-Framework — porównanie Selenium / Cypress / Playwright + CI/CD + TestRail

Projekt realizowany w ramach pracy inżynierskiej – środowisko badawcze do porównania frameworków E2E w architekturze kontenerowej.  

## Założenia
- Jednolite scenariusze E2E w każdym frameworku (tu: proste smoke testy).
- Uruchamianie w Dockerze na osobnych kontenerach.
- Raporty HTML + JUnit w `reports/`.
- Integracja z TestRail przez zmienne środowiskowe.
- CI/CD w GitHub Actions: auto‑PR → CI → auto‑merge → CD (publikacja obrazów testów).

Porównanie obejmuje:
- łatwość konfiguracji i uruchomienia,
- czas wykonania testów,
- stabilność uruchomień w kontenerach,
- gotowość do integracji z **CI/CD (GitHub Actions)**,
- (docelowo) raportowanie wyników do **TestRail**.

Aplikacja testowa (AUT) pochodzi z otwartego repozytorium i jest podpinana jako **git submodule**, aby uniknąć konfliktów i nie wprowadzać zmian do upstream.

---

## Architektura w skrócie

- **AUT**: aplikacja testowa (WordPress + DB) uruchamiana w Docker Compose i wystawiona lokalnie na `http://localhost:8080`.
- **Frameworki**: każdy framework uruchamiany w **osobnym kontenerze runnera**, w tej samej sieci dockerowej co AUT (sieć **`wpsite`**).
- **Izolacja**: frameworki są od siebie niezależne — można je uruchamiać oddzielnie lub równolegle.
- **Raporty**: każdy framework zapisuje wyniki do katalogu `reports/` (artefakty również trafiają do GitHub Actions).

---

## Struktura katalogów

Najważniejsze elementy:

- `apps/bookstore/` — docker-compose dla AUT (obrazy Docker)
- `apps/test-bookstore/` — **submodule** z aplikacją testową (AUT)
- `tests/selenium/` — Selenium + Mocha
- `tests/cypress/` — Cypress
- `tests/playwright/` — Playwright Test
- `reports/` — wyniki testów (JUnit/HTML)
- `.github/workflows/` — pipeline’y CI/CD

---

## Wymagania

Lokalnie:
- Git
- Docker + Docker Compose v2 (`docker compose ...`)
- Node.js zgodny z `.nvmrc` (dla uruchomień lokalnych skryptów)

---

## Pobranie repo + submodule (ważne)

AUT jest podpięte jako submodule. Po klonowaniu repo uruchom:

```bash
git submodule update --init --recursive
```

Bez tego katalog `apps/test-bookstore` może być pusty.

---

## Uruchomienie aplikacji testowej (AUT)

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

---

## Uruchomienie testów

```bash
npm run test:selenium
npm run test:cypress
npm run test:playwright
```

## Proste przykłady (co robi każdy test)
- Selenium: otwiera stronę główną i sprawdza, czy tytuł zawiera `Test App`.
- Cypress: otwiera `/` i sprawdza, czy tytuł zawiera `Test App`.
- Playwright: otwiera `/` i sprawdza, czy tytuł zawiera `Test App`.

---

## Scenariusze testowe (aktualny etap)

- Selenium: tytuł strony zawiera `Test App`.
- Cypress: tytuł strony zawiera `Test App`.
- Playwright: tytuł strony zawiera `Test App`.

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

## Raporty i wyniki

Raporty są zapisywane do `reports/`:
- `reports/selenium/html`
- `reports/selenium/junit`
- `reports/cypress/junit`
- `reports/playwright/html`

W CI raporty są publikowane jako **Artifacts**.

---

## CI/CD (GitHub Actions)

Repo posiada workflowy:
- `auto-pr.yml` — tworzy PR dla każdego brancha poza `main`.
- `ci.yml` — lint + testy tylko tych frameworków, których kod się zmienił (tylko na PR).
- `auto-merge.yml` — włącza auto‑merge po zielonym CI.
- `cd.yml` — publikuje obrazy testów do GHCR po merge do `main`.

---

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

---

## TestRail (przygotowane)

Integracja jest gotowa przez zmienne środowiskowe:
- `TESTRAIL_ENABLED`
- `TESTRAIL_URL`
- `TESTRAIL_USER`
- `TESTRAIL_API_KEY`
- `TESTRAIL_PROJECT_ID`
- `TESTRAIL_RUN_ID`

---

## Logi (cisza / debug)

Domyślnie logi z oczekiwania na aplikację i z Docker Compose są wyciszone.
Aby włączyć pełne logi:

```bash
VERBOSE_LOGS=true npm run test:selenium
```

---

## Dobre praktyki i założenia porównania

- Każdy framework ma własny runner i własną konfigurację.
- Testy wykonują się na tym samym AUT i w tej samej sieci dockerowej.
- Porównania obejmują: czas wykonania, ergonomię konfiguracji, stabilność uruchomień i integrację z CI.

---

## Najczęstsze problemy (Troubleshooting)

1) `apps/test-bookstore` jest puste  
```
git submodule update --init --recursive
```

2) Runner nie widzi AUT / błąd DNS `wordpress`  
- sprawdź `npm run env:up` i `npm run env:wait`
- sprawdź, czy sieć `wpsite` istnieje i czy runner jest do niej podpięty

3) Strona nie działa w przeglądarce  
```
curl -I http://localhost:8080
```

---

## Roadmap (plan rozwoju)

- Dodanie pełnych zestawów testów porównawczych (wspólny scenariusz biznesowy).
- Metryki: agregacja czasu, flakiness, powtarzalność.
- Integracja z TestRail (publikacja wyników + mapowanie case’ów).
- Raport porównawczy (CI artifacts + podsumowanie).

---

## Licencja i źródła

AUT pochodzi z repozytorium open source i jest używana w celach edukacyjnych/badawczych w ramach pracy inżynierskiej. Szczegóły licencji znajdują się w repozytorium aplikacji testowej (submodule).

## Autor

Przemysław Tarko
