def stageFunction(command) {
   def count = 0
   while (count < 3) {
      try {
         bat command
         break
      }catch (Throwable t) {
         // def errorMessage = t.getMessage()
         // StackTraceElement[] stackTrace = t.getStackTrace()
         def logData = bat(returnStdout: true, script: 'type %JENKINS_HOME%\\jobs\\%JOB_NAME%\\builds\\%BUILD_NUMBER%\\log')
         if (logData.contains('toHaveTitle')) {
            echo 'Found expected text in the console log'
            count++
         } else {
            echo 'Did not find expected text in the console log'
            count = 3
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
