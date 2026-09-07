FROM node:22-alpine

# dumb-init reicht Signale korrekt an Node weiter (sauberes Stoppen).
RUN apk add --no-cache dumb-init

WORKDIR /app

# Erst die Manifeste: Layer-Cache greift, solange sich Abhängigkeiten nicht ändern.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Datenverzeichnis anlegen und dem node-Benutzer geben (NeDB schreibt dorthin).
RUN mkdir -p /app/data && chown -R node:node /app

USER node

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/',r=>process.exit(r.statusCode<400?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
