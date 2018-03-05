```
See
https://hub.docker.com/r/hilschernetpi/netpi-nodered-fieldbus/
https://hub.docker.com/r/hilschernetpi/netpi-nodered-fram/

Portainer.io
Containers +Add container
Image: schranz/netpi-nodered-fieldbus-fram
Port mapping +map additinal port: host 1880 container 1880
Port mapping +map additinal port: host 9000 container 9000
Port mapping +map additinal port: host 22 container 22
Network: host
Restart policy: Always
Runtime\Devices +add device: Host path /dev/spidev0.0 Container path /dev/spidev0.0
Runtime\Devices +add device: Host path /dev/i2c-1     Container path /dev/i2c-1
Env\Environment variables +add environment variables : FIELD pns
```
