def stageFunction(command) {
   def errorForSearch = 'toHaveTitle'
   def countForRetry = 0
   def searchStringCountBefore = 0
   while (countForRetry < 3) {
      try {
         bat command
         break
      }catch (Throwable t) {
         def errorMessage = t.getMessage()
         echo "Jenkins Home: ${env.JENKINS_HOME}"
         def logData = bat(returnStdout: true, script: 'type %JENKINS_HOME%\\jobs\\%JOB_NAME%\\builds\\%BUILD_NUMBER%\\log')
         def logDataForParse = logData.trim()
         def searchStringCountAfter = logDataForParse.tokenize('\n').countForRetry { line ->
            line.contains(errorForSearch)
         }
         echo "The string '$errorForSearch' appears $searchStringCountAfter times in the console log"
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
      // if (logData.contains(searchString)) {
      //    countForRetry++
      //    echo "Found expected text in the console log.Attempts remaining: ${3 - countForRetry}"
      // } else {
      //    countForRetry = 3
      //    echo 'Did not find expected text in the console log. Unexpected error'
      //    currentBuild.result = 'FAILURE'
      //    error(errorMessage)
      //    throw t
      // }
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
