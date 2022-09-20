

## How create typescript project?

```
$ pulumi new aws-typescript --force
This command will walk you through creating a new Pulumi project.

Enter a value or leave blank to accept the (default), and press <ENTER>.
Press ^C at any time to quit.

project name: (pulumi-infra-tdd) 
project description: (A minimal AWS TypeScript Pulumi program) 
Created project 'pulumi-infra-tdd'

stack name: (dev) demo
Created stack 'demo'

aws:region: The AWS region to deploy into: (us-east-1) 
Saved config

Installing dependencies...


added 163 packages, and audited 164 packages in 49s

48 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Finished installing dependencies

Your new project is ready to go! ✨

To perform an initial deployment, run 'pulumi up'

warning: A new version of Pulumi is available. To upgrade from version '3.35.3' to '3.40.1', run 
   $ brew upgrade pulumi
or visit https://pulumi.com/docs/reference/install/ for manual instructions and release notes.

```

## Install mocha

```
$ npm install mocha @types/mocha ts-node

added 67 packages, and audited 231 packages in 7s

67 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

## How run test's?

```
 ./node_modules/.bin/mocha -r ts-node/register ./test/ec2tests.ts


  TDD Demo Infrastructure
    # ec2 server
      ✔ must have a name tag
    # security group
      1) must not open port 22 (SSH) to the Internet


  1 passing (381ms)
  1 failing
```