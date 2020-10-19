* INSTALL
- redis
    - sudo apt-get install build-essential tcl
    - http://download.redis.io/releases/redis-5.0.7.tar.gz
    - cd src; make

- sudo apt install npm
# to update the version
* sudo apt install nodejs
* curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
- sudo npm install -g typescript
- sudo npm install -g npx

- manage node version
* sudo npm install n -g
* sudo n stable or sudo n latest

* BUILD
- npm install
- tsc -p tsconfig.json 
- npx webpack --config kanban.webpack.config.js 
- npx webpack --config happyvalley.webpack.config.js 
- npx webpack --config sim.webpack.config.js 

* RUN
- sudo node src/examples/examples.js
- node built/TableFlowServer.js --dbName=han.test
- ./redis-server