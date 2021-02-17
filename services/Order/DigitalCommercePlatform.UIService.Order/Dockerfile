FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine
ARG BuildConfiguration=Debug
ARG Environment=Development
COPY bin/$BuildConfiguration/netcoreapp3.1/. app
ENV ASPNETCORE_ENVIRONMENT $Environment
RUN apk add curl \
    && curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin \
    && trivy filesystem --exit-code 1 --no-progress /