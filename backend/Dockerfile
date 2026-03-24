# ===== Build stage =====
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# 先複製 pom.xml（加快 cache）
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline

# 再複製整個專案
COPY . .

# build jar
RUN mvn clean package -DskipTests


# ===== Run stage =====
FROM eclipse-temurin:21-jdk

WORKDIR /app

# 從 build 階段拿 jar
COPY --from=builder /build/target/*.jar app.jar

# Render 會提供 PORT
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]