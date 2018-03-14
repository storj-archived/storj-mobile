pipeline {
  agent any
  stages {
    stage('Install Deps') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
        junit 'junit.xml'
      }
    }
    stage('Build Debug APK') {
      steps {
        sh '''cd android
./gradlew assembleDebug'''
      }
    }
  }
}