FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
# 1. Declare the ARGs so they can be passed from GitHub Actions
ARG VITE_AI_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_PUBLIC_POSTHOG_TOKEN
ARG VITE_PUBLIC_POSTHOG_HOST

# 2. Make them available as Environment Variables for the 'npm run build' process
ENV VITE_AI_API_URL=$VITE_AI_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_PUBLIC_POSTHOG_TOKEN=$VITE_PUBLIC_POSTHOG_TOKEN
ENV VITE_PUBLIC_POSTHOG_HOST=$VITE_PUBLIC_POSTHOG_HOST

COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:20-alpine AS production
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "start"]