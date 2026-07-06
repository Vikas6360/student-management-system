# Student Management System

A complete production-ready Student Management System built using Spring Boot 3.5.x, Java 21, and MySQL. It includes Docker and Kubernetes configurations for deployment, and a Jenkinsfile for CI/CD.

## Project Structure
```text
student-management-system
├── Dockerfile
├── .dockerignore
├── .gitignore
├── Jenkinsfile
├── README.md
├── docker-compose.yml
├── postman_collection.json
├── pom.xml
├── k8s/
│   ├── namespace.yaml
│   ├── service-account.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── persistent-volume.yaml
│   └── persistent-volume-claim.yaml
└── src/main/
    ├── java/com/student/management
    │   ├── StudentManagementApplication.java
    │   ├── config/OpenApiConfig.java
    │   ├── controller/StudentController.java
    │   ├── dto/StudentDto.java
    │   ├── entity/Student.java
    │   ├── exception/GlobalExceptionHandler.java
    │   ├── exception/ResourceNotFoundException.java
    │   ├── repository/StudentRepository.java
    │   ├── response/ApiResponse.java
    │   └── service/
    │       ├── StudentService.java
    │       └── impl/StudentServiceImpl.java
    └── resources/
        ├── application.properties
        ├── application-prod.properties
        └── data.sql
```

## Step-by-Step Instructions

### 1. Clone Project
```bash
git clone <repository_url>
cd student-management-system
```

### 2. Configure MySQL
For local development, you can use the provided Docker Compose file which includes a MySQL database container.
Alternatively, install MySQL locally and update `src/main/resources/application.properties` with your credentials.

### 3. Run Locally (with Docker Compose)
```bash
docker-compose up -d
```
The application will be accessible at `http://localhost:8080`.

### 4. Build with Maven
```bash
mvn clean package
```

### 5. Build Docker Image
```bash
docker build -t student-management-system:latest .
```

### 6. Run Docker Container Locally
```bash
docker run -p 8080:8080 -e DB_HOST=host.docker.internal student-management-system:latest
```

### 7. Kubernetes Deployment (kubectl apply)
Before applying, replace the `IMAGE_NAME` in `k8s/deployment.yaml` with your actual Docker image. Make sure you update the ConfigMap and Secret as well if you are using an external DB.
```bash
kubectl apply -f k8s/
```

### 8. Jenkins Pipeline
1. Create a pipeline in Jenkins pointing to this repository.
2. Add Docker Hub credentials with ID `dockerhub-credentials`.
3. Add Kubernetes config credentials with ID `kubernetes-kubeconfig`.
4. Run the pipeline. The Jenkinsfile covers: Checkout, Build, Unit Test, Docker Build/Login/Push, Kubernetes Update & Deploy, Verify, Health Check, and Rollback on failure.

### 9. Verify Deployment
Useful Kubernetes Commands:
```bash
kubectl get pods -n student-management
kubectl get svc -n student-management
kubectl describe pod <pod-name> -n student-management
kubectl logs <pod-name> -n student-management
kubectl exec -it <pod-name> -n student-management -- /bin/sh
kubectl rollout status deployment/student-management -n student-management
```

### 10. Scale Deployment
You can manually scale the deployment:
```bash
kubectl scale deployment student-management --replicas=3 -n student-management
```
Or allow HPA (Horizontal Pod Autoscaler) to scale it (configured in `k8s/hpa.yaml` from 2 to 5 replicas based on CPU utilization).

### 11. Rollback Deployment
If an update fails, you can check the history and undo the rollout:
```bash
kubectl rollout history deployment/student-management -n student-management
kubectl rollout undo deployment/student-management -n student-management
```

### 12. Cleanup
```bash
kubectl delete deployment student-management -n student-management
kubectl delete service student-management-service -n student-management
kubectl delete -f k8s/
```

## Health Endpoint
```
GET http://localhost:8080/actuator/health
```

## API Documentation (Swagger)
```
GET http://localhost:8080/swagger-ui.html
```
