def stageFunction(command) {
   def count = 0
   def searchString = 'toHaveTitle'
   def occurrenceCount = 0
   while (count < 3) {
      try {
         bat command
         break
      }catch (Throwable t) {
         def errorMessage = t.getMessage()
         // StackTraceElement[] stackTrace = t.getStackTrace()
         def logData
         bat(returnStdout: true, script: 'type %JENKINS_HOME%\\jobs\\%JOB_NAME%\\builds\\%BUILD_NUMBER%\\log') { output ->
            logData = output.trim()
         }
         
         def occurrenceCount = logData.tokenize('\n').count { line ->
            line.contains(searchString)
         }
         echo "Found $occurrenceCount occurrences of '$searchString' in the console log"
         if (logData.contains('toHaveTitle')) {
            count++
            echo "Found expected text in the console log.Attempts remaining: ${3 - count}"
         } else {
            count = 3
            echo 'Did not find expected text in the console log. Unexpected error'
            currentBuild.result = 'FAILURE'
            error(errorMessage)
            throw t
         }
      // for (StackTraceElement element : stackTrace) {
      //    echo 'STACK TRACE IS COMING----------------------------------------------------------------------'
      //    echo element.toString()
      //    echo 'STACK TRACE IS COMING----------------------------------------------------------------------'
      // }
      // if (errorMessage.contains('script returned exit code 2')) {
      //    echo 'CATCH IF BLOCK----------------------------------------------------------------------'
      //    count++
      // } else {
      //    count = 3
      //    echo 'CATCH ELSE BLOCK----------------------------------------------------------------------'
      //    echo errorMessage.toString()
      //    echo 'CATCH ELSE BLOCK----------------------------------------------------------------------'
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
