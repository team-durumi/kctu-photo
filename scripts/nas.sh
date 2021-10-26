#!/bin/env bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 mount|eject|check"
  exit -1
fi

pkg=nfs-kernel-server
status="$(dpkg-query -W --showformat='${db:Status-Status}' "$pkg" 2>&1)"
if [ ! $? = 0 ] || [ ! "$status" = installed ]; then
  echo "Install $pkg."
  sudo apt -y install $pkg
fi

if [ ! -d nas ]; then
  echo "mkdir mount point ./nas"
  mkdir -p nas
fi

if [ $1 == 'mount' ]; then
  if [ ! -z $(ls -A ./nas) ]; then
    echo './nas not empty, cannot be mounted.'
    exit -1
  else
    if [ -v $(sudo mount.nfs -o user,ro,sync 218.235.95.188:/volume1/photo_archives ./nas) ]; then
      echo 'NAS mounted.'
    else
      echo 'Mount failed.'
    fi
  fi
fi

if [[ $1 == 'eject' && $(sudo umount ./nas) == 0 ]]; then
  echo "NAS ejected."
fi

if [ $1 == 'check' ]; then
  if df -h | grep -qs '218.235.95.188:'; then
    echo "NAS mounted. $(pwd)/nas"
    sudo ls -alh ./nas
  else
    echo "NAS not mounted."
  fi
fi