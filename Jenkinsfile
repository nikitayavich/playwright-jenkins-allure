def stageFunction(command, count = 0) {
   catchError {
      try {
         bat command
      } catch (Exception e) {
         def errorMessage = e.getMessage()
         if (errorMessage.contains('Timed out 5000ms waiting for expect(received).toHaveTitle(expected)') && count < 3) {
            echo "Retrying... (Attempts remaining: ${3 - count})"
            stageFunction(command, count + 1)
         } else {
            currentBuild.result = 'FAILURE'
            error("Failed after retries: ${errorMessage}", e)
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
         parallel {
            stage('A') {
               steps {
                  script {
                     def commandA = 'npx playwright test --project="chromium"'
                     stageFunction(commandA)
                  }
               }
            }
            stage('B') {
               steps {
                  script {
                     def commandB = 'npx playwright test --project="firefox"'
                     stageFunction(commandB)
                  }
               }
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
