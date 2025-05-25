FROM node:20

WORKDIR /app

COPY package* .
COPY tsconfig* .
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
RUN npm run build

CMD ["node","dist/index.js"]






