# Imagem para rodar o REP Calc num contêiner.
#
# A produção em repcalc.leandrofaria.com NÃO usa esta imagem: lá o app roda
# direto com `next start` sob o PM2. Isto existe para quem quiser hospedar a
# própria cópia, e é o caminho documentado no README.

# --- Dependências -----------------------------------------------------------
# Estágio separado para que a instalação só refaça quando o lockfile mudar.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci, não npm install: instala exatamente o lockfile e falha se ele
# divergir do package.json.
RUN npm ci

# --- Build ------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# BUILD_STANDALONE liga o output standalone no next.config.ts, que produz um
# servidor mínimo com só as dependências realmente usadas.
ENV BUILD_STANDALONE=1
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Execução ---------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuário sem privilégios: um processo web não tem motivo para rodar como root.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# O standalone traz o servidor e o node_modules mínimo; static e public são
# copiados à parte porque o Next não os inclui.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
