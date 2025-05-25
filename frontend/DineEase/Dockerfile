FROM node:20

WORKDIR /app

COPY package* .
COPY tsconfig* .
COPY eslint* .

COPY tailwind.config.js vite.config.ts postcss.config.js /app/
RUN npm install
COPY index.html .

COPY public ./public
COPY src ./src

RUN npm run build && npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]



