#!/bin/bash
script_dir=$(dirname "$(realpath "$0")")
echo "Current script path: $script_dir"

rm -rf "$script_dir/pubkey"
mkdir "$script_dir/pubkey"

cd "$script_dir"
sleep 1
#npm install -g iterm2-tab-set
#brew tap mklement0/ttab https://github.com/mklement0/ttab.git
#brew install mklement0/ttab/ttab

#npm install -g truffle
#npm install -g ganache
yarn


ttab 'tabset -a 'ganache' -c purple; ganache-cli --gasPrice 0 -k berlin'
sleep 2

ttab 'truffle migrate; exit'
sleep 2

names=("alice" "bob" "carol" "dave" "miner")
colors=("red" "blue" "yellow" "green" "orange")

for i in "${!names[@]}"; do
    name="${names[i]}"
    color="${colors[i]}"
    ttab "tabset -a '$name' -c '$color'; node -i -e \"const name='$name'; \$(cat ./node.js)\";"
done

exit