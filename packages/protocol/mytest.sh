#!/bin/bash
#tested on macOS only
#install following packages
#npm install -g iterm2-tab-set
#brew tap mklement0/ttab https://github.com/mklement0/ttab.git
#brew install mklement0/ttab/ttab

#npm install -g truffle
#npm install -g ganache

script_dir=$(dirname "$(realpath "$0")")
echo "Current script path: $script_dir"

cd "$script_dir"
sleep 1

yarn

ttab 'tabset -a 'ganache' -c purple; ganache-cli --gasPrice 0 -k berlin'
sleep 2

ttab 'truffle migrate; exit'
sleep 5

ttab "tabset -a 'mytest' -c 'blue'; node ./mytest.js;"

exit