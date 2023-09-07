#!/bin/bash

set -e

R=`tput setaf 1`
G=`tput setaf 2`
Y=`tput setaf 3`
W=`tput sgr0`

#####################################

# if [[ -z "$1" ]]
# then 
#     echo "${R}need args [domain] or [local], abort. (src/share/ip_***.ts.bak could be modified if needed!)${R}"
#     exit
# fi

rm -f *.log
rm -rf ./dist

# change src IP etc.

# if [[ $1 == 'domain' ]]
# then
#     cp ./src/share/ip_domain.ts.bak ./src/share/ip.ts
# fi

# if [[ $1 == 'local' ]]
# then
#     cp ./src/share/ip_local.ts.bak ./src/share/ip.ts
# fi

#####################################

npm run build