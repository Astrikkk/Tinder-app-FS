# 1. Базовий образ для запуску
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# 2. Образ для збирання коду
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# 3. Копіюємо проєкт і встановлюємо залежності
COPY ["TinderApp/TinderApp.csproj", "TinderApp/"]
RUN dotnet restore "TinderApp/TinderApp.csproj"

# 4. Копіюємо весь код і збираємо застосунок
COPY . .
WORKDIR "/src/TinderApp"
RUN dotnet build "TinderApp.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 5. Публікуємо застосунок
FROM build AS publish
RUN dotnet publish "TinderApp.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# 6. Фінальний образ для запуску
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TinderApp.dll"]
