def stageFunction(command) {
   def errorForSearch = 'Timed out 5000ms waiting for '
   def countForRetry = 0
   def searchStringCountBefore = 0
   while (countForRetry < 3) {
      try {
         bat command
         currentBuild.result = 'SUCCESS'
         break
      }catch (Throwable t) {         
         def errorMessage = t.getMessage()         
         def logData = currentBuild.rawBuild.log         
         def searchStringCountAfter = logData.countMatches(errorForSearch)
         echo "The ERROR message appears $searchStringCountAfter times in the console log"
         if (searchStringCountAfter > searchStringCountBefore) {
            countForRetry++
            searchStringCountBefore = searchStringCountAfter
            echo "Found expected ERROR text in the console log.Attempts remaining: ${3 - countForRetry}"
         } else {
            countForRetry = 3
            echo 'Did not find expected ERROR text in the console log. Unexpected error'
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
                     catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        def commandA = 'npx playwright test --project="chromium"'
                        stageFunction(commandA)
                     }
                  }
               }
            }
            stage('B') {
               steps {
                  script {
                     catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        def commandB = 'npx playwright test --project="firefox"'
                        stageFunction(commandB)
                     }
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
