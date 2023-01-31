pipeline {
    agent any

    environment {
        DISCORD_BOT_TOKEN = credentials('dioanalytics.discord.bot_token')
        DISCORD_CLIENT_ID = credentials('dioanalytics.discord.client_id')
    }

    stages {
        stage('check creds exist') {
            steps {
                sh 'if [ -z ${DISCORD_BOT_TOKEN} ]; then exit 1; else echo "set"; fi'
                sh 'if [ -z ${DISCORD_CLIENT_ID} ]; then exit 1; else echo "set"; fi'
            }
        }
        stage('deploy') {
            steps {
                echo 'deploying...'
                sh 'docker compose down'
                sh 'docker compose up --build --detach'
                sh 'docker network connect webnetwork dioanalytics-ui'
            }
        }
    }
}