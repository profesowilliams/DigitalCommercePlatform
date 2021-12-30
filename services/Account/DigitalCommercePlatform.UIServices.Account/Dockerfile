FROM techdata.azurecr.io/df-base-debian-6:latest
ARG BuildConfiguration=Debug
ARG Environment=Development
COPY bin/$BuildConfiguration/net6.0/. app
ENV ASPNETCORE_ENVIRONMENT $Environment