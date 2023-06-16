pipeline {
   agent any
   parameters {
      string defaultValue: '', description: 'Environment URL for running tests', name: 'STAGING'
      string defaultValue: '', description: 'Domain for test user accounts', name: 'DOMAIN'
      string defaultValue: '', description: 'Suite for running tests', name: 'SUITE'
    }
   stages {
      
      stage('Installation'){
         steps {
            bat 'npm install'
            bat 'npx playwright install'
         }
      }
      stage('e2e-tests'){
         parallel {
            stage('webkit') {
               steps {
                  catchError(stageResult: 'FAILURE') {
                     bat  """ npx playwright test --project="webkit" --grep-invert='@serial' $SUITE """
                  }
               }
            }
            stage('chromium') {
               steps {
                  catchError(stageResult: 'FAILURE') {
                     bat  """ npx playwright test --project="chromium" --grep-invert='@serial' $SUITE """
                  }
               }
            }
            stage('firefox') {
               steps {
                  catchError(stageResult: 'FAILURE') {
                     bat  """ npx playwright test --project="firefox" --grep-invert='@serial' $SUITE """
                     
                  }
               }
            }
            stage('serial') {
               stages {
                 stage('webkit') {
                     steps {
                        catchError(stageResult: 'FAILURE') {
                           bat  """ npx playwright test --workers=1 --project="webkit" --grep='@serial' $SUITE """
                        }
                     }
                  }
                 stage('chromium') {
                     steps {
                        catchError(stageResult: 'FAILURE') {
                           bat  """ npx playwright test --workers=1 --project="chromium" --grep='@serial' $SUITE """
                        }
                     }
                  }
                 stage('firefox') {
                     steps {
                        catchError(stageResult: 'FAILURE') {
                           bat  """ npx playwright test --workers=1 --project="firefox" --grep='@serial' $SUITE """
                        }
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
   post {
      failure {
         emailext body: '$DEFAULT_CONTENT', recipientProviders: [requestor()], subject: "Allure Report", to: "autotests.reports@zextras.com"
      }
   }
}