pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = 'github-credentials'
    }

    stages {

        stage('Clone Repository') {
            steps {
                git(
                    branch: 'main',
                    credentialsId: "${GITHUB_CREDENTIALS}",
                    url: 'https://github.com/Vikas6360/student-management-system.git'
                )
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Deploy Application') {
            steps {
                sh '''
                    pkill -f "student-management" || true
                    nohup java -jar target/*.jar > application.log 2>&1 &
                '''
            }
        }

        stage('Health Check') {
            steps {
                sleep 20
                sh 'curl http://localhost:8080/actuator/health || true'
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully.'
            archiveArtifacts artifacts: 'target/*.jar', allowEmptyArchive: true
        }

        failure {
            echo 'Deployment failed.'
        }
    }
}
