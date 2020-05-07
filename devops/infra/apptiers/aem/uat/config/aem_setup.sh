#!/bin/bash
# Setup AEM 6.5 Publish and Author
FILE=/etc/aem-setup.lock
if test -f "$FILE"; then
    echo "$FILE exist - The server is already setup"
    exit 0
fi 

apt update
apt install -y nginx
systemctl enable nginx
rm -f /etc/nginx/sites-available/default
rm -f /etc/nginx/sites-enabled/default
wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/aem.nginx.txt -O /etc/nginx/sites-available/aem
ln -s /etc/nginx/sites-available/aem /etc/nginx/sites-enabled/aem
systemctl restart nginx

apt install -y openjdk-8-jre-headless
mkdir -p /opt/aem/author
mkdir -p /opt/aem/publish
cd /opt/aem/author/
wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/cq5-author-p4502.jar
wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/license.properties
cd /opt/aem/publish
wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/cq5-publish-p4503.jar
wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/license.properties

wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/publish.txt -O /usr/bin/publish
wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/author.txt -O /usr/bin/author
sed -i -e 's/\r$//' /usr/bin/author
sed -i -e 's/\r$//' /usr/bin/publish
chmod +x /usr/bin/publish
chmod +x /usr/bin/author

wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/author.service.txt -O /etc/systemd/system/author.service
wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/publish.service.txt -O /etc/systemd/system/publish.service
sed -i -e 's/\r$//' /etc/systemd/system/author.service
sed -i -e 's/\r$//' /etc/systemd/system/publish.service
systemctl daemon-reload
sudo systemctl enable author
sudo systemctl enable publish

#####Once this is completed, run the author and publish instance manually for the first time so that it unzips the jar

echo "======================================================================"
echo "Installing the JAR for author instance..."
echo "======================================================================"
date
cd /opt/aem/author/
nohup java -jar cq5-author-p4502.jar & > /dev/null

sleep 300
echo "======================================================================"
echo "Installing the JAR for publish instance..."
echo "======================================================================"
date
cd /opt/aem/publish/
nohup java -jar cq5-publish-p4503.jar & > /dev/null

sleep 800
echo "======================================================================"
date
######Add Sling.run.modes as per branch
echo "Adding the run modes in sling.properties file according to the branch name"
echo "======================================================================"
cd /opt/aem/author/crx-quickstart/conf
sed -i '$ a sling.run.modes=uat' sling.properties

cd /opt/aem/publish/crx-quickstart/conf
sed -i '$ a sling.run.modes=uat' sling.properties
#mv /opt/aem/author/crx-quickstart/conf/sling.properties  /opt/aem/author/crx-quickstart/conf/sling.properties_bkp
#mv /opt/aem/publish/crx-quickstart/conf/sling.properties  /opt/aem/publish/crx-quickstart/conf/sling.properties_bkp
#
#
####ION Content/Pages and DAM Package Upload and Tree Activation
#cd /opt/aem
#wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/tng-uat-pages-1.1.zip
#wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/tng-dam-1.0.zip
#wget https://tddevops.blob.core.windows.net/aem-artifacts/AEM/Setup/ION-Content.zip
#echo "======================================================================"
#date
#sleep 60

####ION pages and dam package for TNG
#curl -u admin:admin -F file=@"ION-Content.zip" -F name="ION Content Package" -F force=true -F install=true http://localhost:4502/crx/packmgr/service.jsp
#sleep 300
#echo "======================================================================="
#echo "ION Content installation"
#echo "======================================================================="
#curl -u admin:admin -X POST -F path="/content/tng" -F cmd="activate" http://localhost:4502/bin/replicate.json
#sleep 600
#echo "======================================================================="
#echo "ION Content replication is in progress ..."
#echo "======================================================================="
#curl -u admin:admin -F file=@"tng-uat-pages-1.1.zip" -F name="ION pages" -F force=true -F install=true http://localhost:4502/crx/packmgr/service.jsp
#sleep 300
#echo "======================================================================="
#echo "ION pages installation"
#echo "======================================================================="
#curl -u admin:admin -X POST -F path="/content/tng" -F cmd="activate" http://localhost:4502/bin/replicate.json
#sleep 600
#echo "======================================================================="
#echo "ION pages replication is in progress ..."
#echo "======================================================================="
#curl -u admin:admin -F file=@"tng-dam-1.0.zip" -F name="ION DAM Package" -F force=true -F install=true http://localhost:4502/crx/packmgr/service.jsp
#sleep 600
#echo "======================================================================="
#echo "ION DAM Package installation"
#echo "======================================================================="
#curl -u admin:admin -X POST -F path="/content/dam/streamone-tng" -F cmd="activate" http://localhost:4502/bin/replicate.json
#sleep 300
#echo "======================================================================="
#echo "ION DAM Package replication is in progress ..."
#echo "======================================================================="

#### Reset the admin password

curl -s -u admin:admin -Fplain=TP9UyrinKgvNadKdWL/k -Fverify=TP9UyrinKgvNadKdWL/k  -Fold=admin -FPath=$USER_PATH http://localhost:4502/crx/explorer/ui/setpassword.jsp
sleep 60
echo "======================================================================"
echo "Resetting admin password for Author ..."
echo "======================================================================"
curl -s -u admin:admin -Fplain=TP9UyrinKgvNadKdWL/k -Fverify=TP9UyrinKgvNadKdWL/k  -Fold=admin -FPath=$USER_PATH http://localhost:4503/crx/explorer/ui/setpassword.jsp
sleep 60
echo "======================================================================"
echo "Resetting admin password for Publish Instance ..."
echo "======================================================================"
kill -9 `ps -ef |grep -v "grep"|grep -i "cq5-author-p4502.jar"|awk '{print $2}'`
kill -9 `ps -ef |grep -v "grep"|grep -i "cq5-publish-p4503.jar"|awk '{print $2}'`

echo "Restart the author and publish instance ..."
systemctl restart author.service

systemctl restart publish.service

rm -rf /opt/aem/*.zip
####Enable Monitoring for Diskspace and load average 
curl -s https://monitor.tddevops.com/install-agent.sh | sudo bash -s -

#To stop AEM
#systemctl stop author
#systemctl stop publish

echo "================================================================================================================="
echo "The AEM setup installation is completed. Please check below points for further steps:"
echo "1)Check configMgr for root mapping"
echo "2)Install VSTS agent for deployment"
echo "3)Update the admin password for Default Agent (publish)"
echo "4)After deployment Give read permission for etc/designs to anonymous user and save"
echo "5)Inform the PING team to configure SSO domains"
echo "6)Verify the SSO URL and global API config URLs"
echo "================================================================================================================="

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

touch /etc/aem-setup.lock
