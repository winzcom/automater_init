pipeline {
    environment {
        registry = 'winzcom/new'
        registerCred = 'docker-hub'
        dI = ''
    }
    agent any
    stages {
        stage('build image') {
            steps {
                script {
                    dI = docker.build registry + ":$BUILD_NUMBER"
                }
            }
        }
        stage('deploy image') {
            steps {
                script {
                    docker.withCredentials('', registerCred)
                    dI.push()
                }
            }
        }
    }
}
