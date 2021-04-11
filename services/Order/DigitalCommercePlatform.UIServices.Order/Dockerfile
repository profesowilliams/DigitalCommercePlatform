FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine
ARG BuildConfiguration=Debug
ARG Environment=Development
COPY bin/$BuildConfiguration/netcoreapp3.1/. app
ENV ASPNETCORE_ENVIRONMENT $Environment
