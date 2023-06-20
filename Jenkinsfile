pipeline {
   agent any
   parameters {
      string defaultValue: '', description: 'Environment URL for running tests!', name: 'STAGING'
      string defaultValue: '', description: 'Domain for test user accounts!', name: 'DOMAIN'
      string defaultValue: '', description: 'Suite for running tests!', name: 'SUITE'
   }
   stages {
      stage('Installation') {
         steps {
            bat 'npm install'
            bat 'npx playwright install'
         }
      }
      stage('e2e-tests') {
         parallel {
            stage('webkit') {
               steps {
                  catchError(stageResult: 'FAILURE') {
                     bat  "npx playwright test --project='webkit'"
                  }
               }
            }
            stage('chromium') {
               steps {
                  catchError(stageResult: 'FAILURE') {
                     bat  "npx playwright test --project='chromium'"
                  }
               }
            }
            stage('firefox') {
               steps {
                  catchError(stageResult: 'FAILURE') {
                     bat  "npx playwright test --project='firefox'"
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
   post {
      failure {
         emailext body: '$DEFAULT_CONTENT', recipientProviders: [requestor()], subject: 'Allure Report', to: 'autotests.reports@zextras.com'
      }
   }
}
