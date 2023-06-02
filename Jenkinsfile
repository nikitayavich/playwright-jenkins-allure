def stageFunction(count = 0) {
   catchError {
      try {
         bat 'npx playwright test'
      } catch (Exception e) {
         def errorMessage = e.getMessage()
         if (errorMessage.contains('Timed out 5000ms waiting for expect(received).toHaveTitle(expected)') && count < 3) {
            echo "Retrying... (Attempts remaining: ${3 - count})"
            stageFunction(count + 1)
         } else {
            throw e
         }
      }
   }
}
pipeline {
   agent any
   stages {
      stage('Installation') {
         steps {
            bat 'npm install'
            bat 'npx playwright install'
         }
      }
      stage('e2e-tests') {
         steps {
            script {

               stageFunction()
            }
         }
      }
      stage('Test reports') {
         steps {
            allure([includeProperties: false, jdk: '', reportBuildPolicy: 'ALWAYS', results: [[path: 'allure-results']]])
         }
      }
   }
}
