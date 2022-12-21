# DOCTOR'S-PRESCRIPTION

Easy wasy to create and mail prescription using voice to develop transcript.

<video src="https://user-images.githubusercontent.com/63970193/208931371-bd5df911-a272-4caa-aa8b-e9114e3a8169.mp4" controls="controls" style="width: 730px;">
</video>

---
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###

## Install

    $ git clone https://github.com/ashishk1506/Urdu_Replacer.git
    $ cd PROJECT_TITLE
    $ npm install

## Configure app


### create .env file 
    DB_DATABASE_SSL= 
    DB_HOST_SSL=
    DB_PASS_SSL=
    DB_USER_SSL=
    DB_PORT=
    DB_DATABASE=
    DB_HOST=
    DB_PASS=
    DB_USER=
    PORT=
    SSL=0
    BLOB_CONNECTION_STRING=
###
#### This app can use 2 databases with(SSL = 1)/without(SSL = 0) SSL certification. 


## Running the project

    $ node index.js
