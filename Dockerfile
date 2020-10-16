FROM node:12.19.0-alpine AS build

ENV NODE_ENV=developement
ENV USE_SSL=false
ENV USE_REDIS=false
ENV MONGO_URL=mongodb://mongo:27017

COPY . ./
RUN npm install && npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]