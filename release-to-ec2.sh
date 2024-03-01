#!/bin/bash

set -ef

echo "example: release-to-ec2.sh /path/to/ec2/key.pem"

if [ -f "$1" ]; then

    ./build.sh test "$1"
    ./build.sh prod "$1"

fi