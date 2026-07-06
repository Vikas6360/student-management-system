pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'vikas636/student-management-system'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        KUBE_CONFIG = 'kubernetes-kubeconfig'
        APP_ENDPOINT = 'http://student.local/actuator/health'
    }

    stages {

        stage('1. Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('2. Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('3. Unit Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('4. Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('5. Login Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin"
                }
            }
        }

        stage('6. Push Docker Image') {
            steps {
                sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                sh "docker push ${DOCKER_IMAGE}:latest"
            }
        }

        stage('7. Update Deployment Manifest') {
            steps {
                sh """
                    git checkout -- k8s/deployment.yaml || true
                    sed -i 's|IMAGE_NAME|${DOCKER_IMAGE}:${BUILD_NUMBER}|g' k8s/deployment.yaml
                """
            }
        }

        stage('8. Deploy to Kubernetes') {
            steps {
                withKubeConfig(credentialsId: "${KUBE_CONFIG}") {
                    sh '''
                        kubectl apply -f k8s/namespace.yaml
                        sleep 5

                        # MySQL
                        kubectl apply -f k8s/mysql-secret.yaml
                        kubectl apply -f k8s/mysql-pv.yaml
                        kubectl apply -f k8s/mysql-pvc.yaml
                        kubectl apply -f k8s/mysql-service.yaml
                        kubectl apply -f k8s/mysql-deployment.yaml


                        echo "Waiting for MySQL..."
                        sleep 30

                        # Spring Boot
                        kubectl apply -f k8s/configmap.yaml
                        kubectl apply -f k8s/secret.yaml
                        kubectl apply -f k8s/persistent-volume.yaml
                        kubectl apply -f k8s/persistent-volume-claim.yaml
                        kubectl apply -f k8s/service-account.yaml
                        kubectl apply -f k8s/service.yaml
                        kubectl apply -f k8s/deployment.yaml
                        kubectl apply -f k8s/hpa.yaml
                        kubectl apply -f k8s/ingress.yaml
                    '''
                }
            }
        }

        stage('9. Verify Deployment') {
            steps {
                withKubeConfig(credentialsId: "${KUBE_CONFIG}") {
                    sh 'kubectl get pods -n student-management'
                    sh 'kubectl get svc -n student-management'
                    sh 'kubectl rollout status deployment/student-management -n student-management'
                }
            }
        }

        stage('10. Health Check') {
            steps {
                sleep 30
                sh "curl -f ${APP_ENDPOINT} || true"
            }
        }
    }

    post {

        success {
            echo 'Deployment Successful!'
            archiveArtifacts artifacts: 'target/*.jar', allowEmptyArchive: true
        }

        failure {
            echo 'Deployment Failed!'

            withKubeConfig(credentialsId: "${KUBE_CONFIG}") {
                sh '''
                    kubectl get pods -n student-management
                    kubectl get svc -n student-management
                    kubectl logs deployment/student-management -n student-management --tail=100 || true
                    kubectl logs deployment/mysql -n student-management --tail=100 || true
                '''
            }
        }

        always {
            sh 'docker logout'
        }
    }
}
