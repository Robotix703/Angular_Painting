From trion/ng-cli as builder

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci

COPY . .
RUN npm run build

From nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist/painting .