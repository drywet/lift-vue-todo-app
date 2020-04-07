## Description
A todo app using:
- Liftweb for REST API
- Vue or jQuery for ui

## Running the app
Start sbt in the project directory and run `jetty:quickstart`.

## AWS EC2 deployment example
```
wget https://download.java.net/java/GA/jdk12.0.1/69cfe15208a647278a19ef0990eea691/12/GPL/openjdk-12.0.1_linux-x64_bin.tar.gz
tar xvf openjdk-12.0.1_linux-x64_bin.tar.gz
JAVA_HOME=/home/ec2-user/jdk-12.0.1
PATH="/home/ec2-user/jdk-12.0.1/bin:$PATH"
java -version

curl https://bintray.com/sbt/rpm/rpm | sudo tee /etc/yum.repos.d/bintray-sbt-rpm.repo
sudo yum install sbt

sudo yum install git

git clone https://github.com/drywet/lift-vue-todo-app.git

cd lift-vue-todo-app

sbt -Djline.terminal=jline.UnsupportedTerminal
jetty:quickstart
Ctrl+Z
bg
jobs
disown -h %1 # The number of the job
```
