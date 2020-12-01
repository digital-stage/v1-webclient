FROM node:14.15.0-buster AS build
ENV NEXT_PUBLIC_USE_SSL=false
ENV PORT=3000

COPY . ./
RUN rm .env* && npm install && npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "run", "dev"]