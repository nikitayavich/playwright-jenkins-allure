def stageFunction(command) {
   while (count < 3) {
      catchError {
         try {
            bat command
         } catch (Exception e) {
            def errorMessage = e.getMessage()
            if (errorMessage.contains('Timed out 5000ms waiting for expect(received).toHaveTitle(expected)')) {
               echo 'CATCH IF BLOCK----------------------------------------------------------------------'
               count++
            } else {
               count = 3
               echo 'CATCH ELSE BLOCK----------------------------------------------------------------------'
               currentBuild.result = 'FAILURE'
               error(e)
               throw e
            }
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
