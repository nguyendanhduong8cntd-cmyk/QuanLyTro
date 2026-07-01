# ===== Build stage: bien dich & dong goi jar =====
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

# ===== Run stage: chi chay jar (nhe) =====
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
# Railway/Render se cap bien PORT; ung dung da doc ${PORT}
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
