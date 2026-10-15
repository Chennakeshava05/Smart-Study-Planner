
pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    options {
        timestamps()
    }

    stages {
        stage('Check Environment') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'git --version'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('FrontEnd') {
                    bat 'if exist package-lock.json (npm ci) else (npm install)'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('FrontEnd') {
                    bat 'npm run build'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('BackEnd') {
                    bat 'if exist package-lock.json (npm ci) else (npm install)'
                }
            }
        }

        stage('Validate Backend') {
            steps {
                dir('BackEnd') {
                    bat 'node --check server.js'
                }
            }
        }

        stage('Archive Frontend Build') {
            steps {
                archiveArtifacts artifacts: 'FrontEnd/dist/**',
                                 fingerprint: true
            }
        }
    }
}
