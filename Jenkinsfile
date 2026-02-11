pipeline {
    agent any
    stages {
        stage('Build') {
            agent { docker {
                image 'mcr.microsoft.com/playwright:v1.58.0-noble'
                args '--network=host'
            } }
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test_UI'){
            agent { docker {
                image 'mcr.microsoft.com/playwright:v1.58.0-noble'
                args '--network=host'
            } }
            steps {
                sh 'npm run test:unit'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        icon: '', keepAll: true,
                        reportDir: '.',
                        reportFiles: 'test-report.html',
                        reportName: 'VitestReport',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                     ])
                }
            }
        }
        stage('Test_Integration'){
            agent { docker {
                image 'mcr.microsoft.com/playwright:v1.58.0-noble'
                args '--network=host'
            } }
            steps {
                sh 'npm run test:e2e'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: false,
                        icon: '', keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'VitestReport2',
                        reportTitles: '',
                        useWrapperFileDirectly: true
                     ])
                }
            }
        }
        stage('docker') {
            agent any
            when { branch 'master' }
            environment {
                CI_REGISTRY = 'ghcr.io' 
                CI_REGISTRY_USER = 'AtymmoJohanna' 
                CI_REGISTRY_IMAGE = "$CI_REGISTRY" + '/' + "$CI_REGISTRY_USER" + '/chess'
                CI_REGISTRY_PASSWORD = credentials('CI_REGISTRY_PASSWORD')
            }
            steps {
                sh 'docker build -t --network=host $CI_REGISTRY_IMAGE .'
                sh 'docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY'
                sh 'docker push $CI_REGISTRY_IMAGE'
            }
        }
    }
}