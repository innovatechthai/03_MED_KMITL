# Raspberry Pi3 B+ Code

### Hardware

Connect the Lepton module's power, I2C, SPI and VSYNC output to the Pi as follows.  

| Pi Header Pin | Function | Lepton Module |
|:-------------:|:--------:|:-------------:|
| 1             | 3V3      | VIN           |
| 3             | SDA      | SDA           |
| 5             | SCL      | SCL           |
| 6             | GND      | GND           |
| 7             | VSYNC    | GPIO3         |
| 19            | MOSI     | MOSI          |
| 21            | MISO     | MISO          |
| 23            | SCLK     | SCLK          |
| 24            | CS0      | CS            |

sudo apt-get update
sudo apt-get upgrade

wget https://nodejs.org/dist/v8.9.0/node-v8.9.0-linux-armv6l.tar.gz
tar -xzf node-v8.9.0-linux-armv6l.tar.gz
cd node-v8.9.0-linux-armv6l/
sudo cp -R * /usr/local/
node -v
npm -v

wget https://download.opensuse.org/repositories/network:/messaging:/zeromq:/release-stable/Debian_9.0/Release.key -O- | sudo apt-key add
sudo apt-get install libzmq3-dev

