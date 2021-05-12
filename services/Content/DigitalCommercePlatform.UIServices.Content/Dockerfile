FROM techdata.azurecr.io/df-base-debian-5:latest
ARG BuildConfiguration=Debug
ARG Environment=Development
COPY bin/$BuildConfiguration/net5.0/. app
ENV ASPNETCORE_ENVIRONMENT $Environment
