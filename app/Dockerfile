FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install && npm install -g @angular/cli

COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]