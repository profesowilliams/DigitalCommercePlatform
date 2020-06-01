#!/bin/bash
#Solr Setup Package installation

echo "The installation for Solr is in progress"
                                                                                                       
export DEBIAN_FRONTEND=noninteractive
if [ $(whoami) != 'root' ]; then
  echo "Must be root to run $0"
  exit 1
fi
  
FILE=/etc/solr-setup.lock
if test -f "$FILE"; then
    echo "$FILE exist - The server is already setup"
    exit 0
fi 

apt-get update -y
apt-get install -y wget apt-transport-https openjdk-11-jre-headless uuid-runtime pwgen curl unzip dos2unix
apt-get update && apt-get install -y nginx
mkdir -p /home/ubuntu/setup
cd /home/ubuntu/setup
#wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/solr_setup.sh
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/jetty.xml
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/security.json
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/solr-ssl.keystore.jks
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/solr.in.sh
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/solr.txt
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/sqljdbc4-4.0.jar

mkdir -p /opt/solr
cd /opt/solr

wget https://archive.apache.org/dist/lucene/solr/8.2.0/solr-8.2.0.tgz
tar -zxvf solr-8.2.0.tgz
sleep 10

mv /opt/solr/solr-8.2.0/server/lib/sqljdbc4-4.0.jar /opt/solr/solr-8.2.0/server/lib/sqljdbc4-4.0.jar_bkp
mv /opt/solr/solr-8.2.0/server/etc/jetty.xml /opt/solr/solr-8.2.0/server/etc/jetty.xml_bkp
cp -ipr  /home/ubuntu/setup/sqljdbc4-4.0.jar  /opt/solr/solr-8.2.0/server/lib/
cp -ipr  /home/ubuntu/setup/jetty.xml /opt/solr/solr-8.2.0/server/etc/

cd /opt/solr/solr-8.2.0
bin/solr start -p 8983 -force

sleep 10
bin/solr create -c program -force
bin/solr create -c product -force

bin/solr create -c productnested -force
bin/solr create -c programnested -force
sleep 30
mv /opt/solr/solr-8.2.0/server/solr/product/conf /opt/solr/solr-8.2.0/server/solr/product/conf_bkp
mv /opt/solr/solr-8.2.0/server/solr/program/conf /opt/solr/solr-8.2.0/server/solr/program/conf_bkp
mv /opt/solr/solr-8.2.0/server/solr/productnested/conf /opt/solr/solr-8.2.0/server/solr/productnested/conf_bkp
mv /opt/solr/solr-8.2.0/server/solr/programnested/conf /opt/solr/solr-8.2.0/server/solr/programnested/conf_bkp

cd /opt/solr/solr-8.2.0/server/solr/product/
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/hotfix/product/db-data-config.xml
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/product/conf.zip
unzip -o conf.zip
mv db-data-config.xml conf/
rm conf.zip 

cd /opt/solr/solr-8.2.0/server/solr/program/
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/hotfix/program/db-data-config.xml
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/program/conf.zip
unzip -o conf.zip
mv db-data-config.xml conf/
rm conf.zip 

cd /opt/solr/solr-8.2.0/server/solr/productnested/
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/hotfix/productnested/db-data-config.xml
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/productnested/conf.zip
unzip -o conf.zip
mv db-data-config.xml conf/
rm conf.zip 

cd /opt/solr/solr-8.2.0/server/solr/programnested/
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/hotfix/programnested/db-data-config.xml
wget https://tddevops.blob.core.windows.net/solr-artifacts/Solr/Setup/programnested/conf.zip
unzip -o conf.zip
mv db-data-config.xml conf/
rm conf.zip 

cp -iprf /home/ubuntu/setup/solr-ssl.keystore.jks /opt/solr/solr-8.2.0/server/etc/
mv /opt/solr/solr-8.2.0/bin/solr.in.sh /opt/solr/solr-8.2.0/bin/solr.in.sh_bkp
cp -iprf /home/ubuntu/setup/solr.in.sh /opt/solr/solr-8.2.0/bin
dos2unix /opt/solr/solr-8.2.0/bin/solr.in.sh
cp -iprf /home/ubuntu/setup/security.json /opt/solr/solr-8.2.0/server/solr

#echo "{
#"authentication":{
#   "blockUnknown": true,
#   "class":"solr.BasicAuthPlugin",
#   "credentials":{"solr":"IV0EHq1OnNrj6gvRCwvFwTrZ1+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c="}
#}}
#"  > /opt/solr/solr-8.2.0/server/solr/security.json

chown root:root -R /opt/solr
chmod 755 -R /opt/solr
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-available/default

mkdir -p /etc/nginx/ssl
cd /etc/nginx/ssl
wget https://tddevops.blob.core.windows.net/solr-artifacts/s1nextgen.com-ssl-certs/s1nextgen.fullchain.pem
wget https://tddevops.blob.core.windows.net/solr-artifacts/s1nextgen.com-ssl-certs/s1nextgen.key.pem
#cat /etc/nginx/ssl/s1nextgen.fullchain.pem > /etc/nginx/ssl/s1nextgen.fullchain.pem
#cat /etc/nginx/ssl/s1nextgen.com.ca >> /etc/nginx/ssl/tddevops.fullchain.pem
#cat /etc/nginx/ssl/s1nextgen.key.pem > /etc/nginx/ssl/s1nextgen.key.pem
#apt-get install dos2unix -y
mv /home/ubuntu/setup/solr.txt /home/ubuntu/setup/solr
cp -ipr /home/ubuntu/setup/solr /etc/nginx/sites-available/solr

#dos2unix /etc/nginx/sites-available/solr

ln -s /etc/nginx/sites-available/solr /etc/nginx/sites-enabled/solr
systemctl enable nginx
systemctl restart nginx
rm -rf /opt/solr/solr-8.2.0.tgz 
rm -rf /home/ubuntu/setup
cd /tmp
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
#Restart the Solr Service

cd /opt/solr/solr-8.2.0
./bin/solr restart -p 8983 -force

touch /etc/solr-setup.lock