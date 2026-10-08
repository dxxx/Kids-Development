# Animal Rally

A tablet web game for kids aged about 4 to 7. A crew of animals drives a rally car
around the world; every stop is earned by playing short logic, maths and
three-language mini-games. Content follows the England Year 1 and Year 2
curriculum and adapts to the child, one skill at a time.

Version 0.1: the engine, four mini-games, pit stops, a daily time limit and a
grown-ups corner. Art is placeholder emoji for now.

## Run it with Docker

Requires Docker with Compose.

```bash
docker compose up -d --build
```

Open `http://<server>:8080`. To use another port:

```bash
PORT=80 docker compose up -d --build
```

Without Compose:

```bash
docker build -t animal-rally .
docker run -d --name animal-rally --restart unless-stopped -p 8080:80 animal-rally
```

The image builds and tests the app, then serves the static files from nginx.
It is about 74 MB and has a health check at `/healthz`.

If Docker Hub rate-limits the base images, build from a mirror:

```bash
docker build --build-arg REGISTRY=mirror.gcr.io/library -t animal-rally .
# or with compose
REGISTRY=mirror.gcr.io/library docker compose up -d --build
```

### Putting it on a domain with HTTPS

The container speaks plain HTTP on port 80. Put it behind whatever already
terminates HTTPS on the server (Caddy, Traefik, nginx with certbot) and proxy to
the container port. HTTPS matters: tablets only install the app to the home
screen and enable offline play on HTTPS.

### Updating

```bash
git pull
docker compose up -d --build
```

Progress is stored on the tablet, not on the server, so updating or
recreating the container never loses a child's progress.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests for the engine and puzzle generators
npm run build      # type check and production build into dist/
```

## Install on the tablet

Open the site in Safari (iPad) or Chrome (Android), then Share, Add to Home
Screen. It opens full screen like an app and works offline after the first visit.

## Grown-ups corner

Hold the lock button on the home screen for 3 seconds, then answer the sum.
There you can see levels and recent rounds, set the daily limit, instruction
language (English, Spanish, Romanian), voice, calm mode and skill mix, and
save or load progress as a file.

## Documents

- `docs/GAME_DESIGN.md`: the concept, core loop and interaction principles
- `docs/RESEARCH_ENGAGEMENT.md`: research on engagement and autistic traits
- `docs/RESEARCH_UK_YEAR1_YEAR2.md`: the curriculum and the level ladder
- `docs/ARCHITECTURE.md`: how the code is organised
