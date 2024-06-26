#!/bin/bash

set -ef

R=`tput setaf 1`
G=`tput setaf 2`
Y=`tput setaf 3`
W=`tput sgr0`

echo "example: build.sh test /path/to/ec2/key.pem"
# also MUST modify isso.cfg [general]-[host] !!!

./clean.sh

#######################################################################################

declare -A mR

# ---------------------------------- #

if [[ $1 == 'test' ]]; then

    # CHANGE DOMAIN from local(.test) to test(.link)
read -r R1 <<'EOF'
data-dictionary.test
EOF
read -r mR['$R1'] <<'EOF'
data-dictionary.link
EOF

    file1="./src/share/ip.ts"
    file2="./isso/isso.cfg"

    for key in "${!mR[@]}"; do
        value=${mR[$key]}
        sed -i "s#$key#$value#g" "$file1"
        sed -i "s#$key#$value#g" "$file2"
        unset mR["$key"]
    done

fi

if [[ $1 == 'prod' || $1 == 'product' ]]; then
    
    # CHANGE DOMAIN from local(.test) to prod(.net)
read -r R1 <<'EOF'
data-dictionary.test
EOF
read -r mR['$R1'] <<'EOF'
data-dictionary.net
EOF

    # CHANGE http to https
read -r R2 <<'EOF'
http://
EOF
read -r mR['$R2'] <<'EOF'
https://
EOF

    file1="./src/share/ip.ts"
    file2="./isso/isso.cfg"

    for key in "${!mR[@]}"; do
        value=${mR[$key]}
        sed -i "s#$key#$value#g" "$file1"
        sed -i "s#$key#$value#g" "$file2"
        unset mR["$key"]
    done

fi

#######################################################################################

rm -rf ./dist

npm run build

#######################################################################################

if [ -f "$2" ]; then
    if [[ $1 == 'test' ]]; then IP='3.24.210.59'; fi
    if [[ $1 == 'prod' || $1 == 'product' ]]; then IP='54.66.224.148'; fi
        
    TM=`date +%F@%T@%Z`
    TM="${TM//:/-}" # change ':' to '-'
    CD=`pwd`
    PKG_NAME='dist'
    echo "scp -i $2 -r $CD/$PKG_NAME ubuntu@$IP:dd/$PKG_NAME-$TM"
    scp -i $2 -r $CD/$PKG_NAME ubuntu@$IP:dd/ndd-view-$PKG_NAME-$TM

    ###############################################################
    # copy isso.cfg
    # also MUST modify uploaded isso.cfg [general]-[host] !!!

    scp -i $2 isso/isso.cfg ubuntu@$IP:dd/ndd-isso.cfg

else
    echo "${Y}valid key file is not provided, cannot send package to EC2${W}"
fi

#######################################################################################

# ---------------------------------- #

if [[ $1 == 'test' ]]; then

    # CHANGE DOMAIN from test(.link) back to local(.test)
read -r R1 <<'EOF'
data-dictionary.link
EOF
read -r mR['$R1'] <<'EOF'
data-dictionary.test
EOF

    file1="./src/share/ip.ts"
    file2="./isso/isso.cfg"

    for key in "${!mR[@]}"; do
        value=${mR[$key]}
        sed -i "s#$key#$value#g" "$file1"
        sed -i "s#$key#$value#g" "$file2"
        unset mR["$key"]
    done

fi

# ---------------------------------- #

if [[ $1 == 'prod' || $1 == 'product' ]]; then
    
    # CHANGE DOMAIN from prod(.net) back to local(.test)
read -r R1 <<'EOF'
data-dictionary.net
EOF
read -r mR['$R1'] <<'EOF'
data-dictionary.test
EOF

    # CHANGE https back to http
read -r R2 <<'EOF'
https://
EOF
read -r mR['$R2'] <<'EOF'
http://
EOF

    file1="./src/share/ip.ts"
    file2="./isso/isso.cfg"

    for key in "${!mR[@]}"; do
        value=${mR[$key]}
        sed -i "s#$key#$value#g" "$file1"
        sed -i "s#$key#$value#g" "$file2"
        unset mR["$key"]
    done

fi
