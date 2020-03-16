#!/bin/bash

# Install node, node package manager (npm), and nodemon.
sudo apt install nodejs npm
sudo npm i -g nodemon

# If GitHub folder doesn't exist, make one.
if [ ! -d "$HOME/Github" ]
then
	printf "WARNING: No GitHub directory detected, making new directory '$HOME/GitHub'...\n"
	mkdir "$HOME/Github"
else
	printf "INFO: Github directory found '$HOME/Github'.\n"
fi

# Clone the traffic-all repository.
if [ -d "$HOME/Github/traffic-all" ]
then
	printf "INFO: Directory '$HOME/Github/traffic-all' already exists.\n"
else
	printf "INFO: Trying to git clone...\n"
	cd ~/Github
	git clone https://github.com/trafficCapstone/traffic-all.git
	cd ~
fi
chmod +x ~/Github/traffic-all/main.py


# Prompt user to install Python dependencies.
valid_input=false
user_input=""

printf "\nTry to automatically install Python dependencies? [Y/n] "
read user_input

while [ "$valid_input" = false ]
do
	if [ "$user_input" = "y" ] || [ "$user_input" = "Y" ] || [ "$user_input" = "yes" ] || [ "$user_input" = "Yes" ] || [ "$user_input" = "YES" ]
	then
		valid_input=true
		sudo apt install python3-pip
		# python -m pip install --user opencv-python tensorflow==1.14 easydict Pillow python-socketio==4.5.0
		python3 -m pip install --user opencv-python tensorflow==1.14 tensorflow-gpu==1.14 easydict Pillow python-socketio==4.5.0
	elif [ "$user_input" = "n" ] || [ "$user_input" = "N" ] || [ "$user_input" = "no" ] || [ "$user_input" = "No" ] || [ "$user_input" = "NO" ]
	then
		valid_input=true
		printf "\nEnsure you have pip installed:\n"
		printf "\tsudo apt install python3-pip\n\n"
		printf "Then to install the Python dependencies:\n"
		printf "\tpython3 -m pip install --user opencv-python tensorflow==1.14 tensorflow-gpu==1.14 easydict Pillow python-socketio==4.5.0\n"
	else
		printf "ERROR: Invalid response.\n"
		printf "Try to automatically install Python dependencies? [Y/n] "
		read user_input
	fi
done

# Prompt user to install node dependencies.
valid_input=false
user_input=""

printf "\nTry to automatically install Node dependencies? [Y/n] "
read user_input

while [ "$valid_input" = false ]
do
	if [ "$user_input" = "y" ] || [ "$user_input" = "Y" ] || [ "$user_input" = "yes" ] || [ "$user_input" = "Yes" ] || [ "$user_input" = "YES" ]
	then
		valid_input=true
		npm i
	elif [ "$user_input" = "n" ] || [ "$user_input" = "N" ] || [ "$user_input" = "no" ] || [ "$user_input" = "No" ] || [ "$user_input" = "NO" ]
	then
		valid_input=true
		printf "\nEnsure you have npm installed:\n"
		printf "\tsudo apt install npm\n\n"
		printf "Then to install the Node dependencies:\n"
		printf "\tnpm install\n"
	else
		printf "ERROR: Invalid response.\n"
		printf "Try to automatically install Node dependencies? [Y/n] "
		read user_input
	fi
done


# Potentially Unnecessary.
# npm install @ionic/app-scripts@latest
# echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

# CUDA 10.0 (10.0.130)
# Change Nvidia Graphics Driver to version >=410.48.
# Download local install for CUDA (.deb).
# sudo apt-get install cuda-toolkit-10-0
# sudo apt-get install cuda-10-0
# Set PATH and LD_LIBRARY_PATH in ~/.bashrc
# Assert "nvcc -V" -> "Cuda compilation tools, release 10.0, V10.0.130"



printf "\nIMPORTANT: Additionally, you must download the models from: 'https://drive.google.com/file/d/1Y37laWQad_WIVwml0vC4B8YQ3tL5ey4U/view'"
printf "\n(Once downloaded, extract the 'models' folder to '$HOME/Github/traffic-all'.)\n"
