def stageFunction(command) {
   def count = 0
   while (count < 3) {
      try {
         bat command
         break
      }catch (Throwable t) {
         def consoleLog = readFile "${env.BUILD_LOG}"
         def expectedValue = "toHaveTitle"
         // def errorMessage = t.getMessage()
         // StackTraceElement[] stackTrace = t.getStackTrace()
         if (consoleLog.contains(expectedValue)) {
                echo "Found the expected value in the console log"
                // Perform additional actions or steps based on the condition
            } else {
                echo "Did not find the expected value in the console log"
                // Perform alternative actions or steps based on the condition
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
