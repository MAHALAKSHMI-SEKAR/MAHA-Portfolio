FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN for attempt in 1 2 3 4 5; do \
      if mvn -B -ntp clean package -DskipTests > /tmp/mvn-build.log 2>&1; then \
        cat /tmp/mvn-build.log; exit 0; \
      else \
        status=$?; cat /tmp/mvn-build.log; \
        if ! grep -Eqi '429|Too Many Requests' /tmp/mvn-build.log || [ "$attempt" -eq 5 ]; then exit "$status"; fi; \
        echo "Maven Central rate limited the build; retrying in $((attempt * 10)) seconds."; \
        sleep $((attempt * 10)); \
      fi; \
    done

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
