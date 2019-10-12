from subprocess import call
import threading 
import time
import os

def Program0():
		time.sleep(0.5)
		call(["sudo", "rm", "/var/run/pigpio.pid"])
		call(["node", "./Lepton3_Human/frontend/index.js"])
		# try:
		  # call(["node", "./Lepton3_Human/frontend/index.js"])
		# except:
		  # call(["node", "./Lepton3_Human/frontend/index.js"])
  
  

def Program1():
		try:
		  call(["sudo", "./Lepton3_Human/leptonic-vsync/bin/leptonic","/dev/i2c-1","/dev/spidev0.0"])
		except:
		  call(["sudo", "./Lepton3_Human/leptonic-vsync/bin/leptonic","/dev/i2c-1","/dev/spidev0.0"])


def Program2():
	    time.sleep(108000)
	    os.system("sudo reboot")




t1 = threading.Thread(target=Program0) 
t2 = threading.Thread(target=Program1)


time.sleep(60)

# starting thread 1 
t1.start() 
# starting thread 2 
t2.start() 
# starting thread 3
#t3.start() 

t1.join()
t2.join()



