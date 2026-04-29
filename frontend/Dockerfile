FROM node:20-alpine
WORKDIR /app
RUN npm install -g http-server

RUN echo "<h1>Frontend Angular (Simulation)</h1><p>L'infra fonctionne !</p>" > index.html

CMD ["http-server", "-p", "4200"]
