#!/bin/bash

# Install Nessus Agent
if [ -n "$(uname -a | grep Ubuntu)" ]; then
  curl -s "https://tddevops.blob.core.windows.net/artifacts/nessus/ubuntu/NessusAgent-7.6.0-debian6_amd64.deb?st=2020-03-10T02%3A59%3A36Z&se=2030-03-11T01%3A59%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=fI9uLIMpRfuMwY6kqDPwaEw3utsNQz3mw6yIy3RRtXM%3D" -o NessusAgent-7.6.0-debian6_amd64.deb
  dpkg -i NessusAgent-7.6.0-debian6_amd64.deb
else
  curl -s "https://tddevops.blob.core.windows.net/artifacts/nessus/centos/NessusAgent-7.6.0-es5.x86_64.rpm?st=2020-03-10T03%3A01%3A08Z&se=2029-03-10T23%3A01%3A00Z&sp=rl&sv=2018-03-28&sr=b&sig=%2BmF98oHgh4%2Bg9WnXrO7Mk3iu6ST8qRbzBxbICiAiwjE%3D" -o NessusAgent-7.6.0-es5.x86_64.rpm
  rpm -ivh NessusAgent-7.6.0-es5.x86_64.rpm

fi
/etc/init.d/nessusagent start
/opt/nessus_agent/sbin/nessuscli agent link \
--key=9cc626c2f356721443ffdce137fc32a8f8db6e595bdd6bd9b669047ca3c3eb4d \
--name=$(hostname) \
--groups="Azure_Non-Prod" \
--host=cloud.tenable.com --port=443

