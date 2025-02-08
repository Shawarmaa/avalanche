#!/bin/bash

# Open first terminal and run command in a specific path
gnome-terminal --tab --working-directory="C:\Users\OMEN\VS_Code\avalanche\backend" -- bash -c "npm run server; exec bash"

# Open second terminal and run command in a different path
gnome-terminal --tab --working-directory="C:\Users\OMEN\VS_Code\avalanche\my-app" -- bash -c "npm run dev; exec bash"


# on windows you need bash
# for the macos donnys do $chmod +x runapp.sh    in the terminal to make the script executable then;
# $./runapp.sh  to actually run the script