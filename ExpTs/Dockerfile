FROM node:18

WORKDIR /ExpTs

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

RUN npm run deploy

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
