#!/bin/bash

set -e

#######################################################################################

if [[ $1 == 'test' ]]; then
    file="./src/share/ip.ts"
    search="data-dictionary.test"
    replacement="data-dictionary.link"    
    sed -i "s#${search}#${replacement}#g" "$file"
fi

if [[ $1 == 'prod' || $1 == 'product' ]]; then

    file="./src/share/ip.ts"
    
    search="data-dictionary.test"
    replacement="data-dictionary.net"    
    sed -i "s#${search}#${replacement}#g" "$file"

    search="http://"
    replacement="https://"
    sed -i "s#${search}#${replacement}#g" "$file"

fi

#######################################################################################

rm -rf ./dist

npm run build

#######################################################################################

if [ -f "$2" ]; then
    if [[ $1 == 'test' ]]; then IP='3.24.210.59'; fi
    if [[ $1 == 'prod' || $1 == 'product' ]]; then IP='54.66.224.148'; fi
        
    TM=`date +%F@%T@%Z`
    CD=`pwd`
    PKG_NAME='dist'
    echo "scp -i $2 -r $CD/$PKG_NAME ubuntu@$IP:dd/$PKG_NAME-$TM"
    scp -i $2 -r $CD/$PKG_NAME ubuntu@$IP:dd/ndd-view-$PKG_NAME-$TM

else
    echo "valid key file is not provided, cannot send package to EC2"
fi

#######################################################################################

if [[ $1 == 'test' ]]; then
    file="./src/share/ip.ts"
    search="data-dictionary.link"
    replacement="data-dictionary.test"    
    sed -i "s#${search}#${replacement}#g" "$file"
fi

if [[ $1 == 'prod' || $1 == 'product' ]]; then

    file="./src/share/ip.ts"
    
    search="data-dictionary.net"
    replacement="data-dictionary.test"    
    sed -i "s#${search}#${replacement}#g" "$file"

    search="https://"
    replacement="http://"
    sed -i "s#${search}#${replacement}#g" "$file" 

fi

#######################################################################################