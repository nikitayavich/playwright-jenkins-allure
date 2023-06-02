def stageFunction(command) {
   def count = 0
   while (count < 3) {
      try {
         bat command
         break
      }catch (Throwable t) {
         def errorMessage = t.getMessage()
         if (errorMessage.contains('toHaveTitle')) {
            echo 'CATCH IF BLOCK----------------------------------------------------------------------'
            count++
         } else {
            count = 3
            echo 'CATCH ELSE BLOCK----------------------------------------------------------------------'
            echo errorMessage
            currentBuild.result = 'FAILURE'
            error(errorMessage)
            throw t
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
