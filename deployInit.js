const {spawn } = require('child_process')
const fs = require('fs')

const shell = (command) => {

	return spawn(command, {shell: true, 
					cwd: process.cwd(), 
					stdio: 'inherit' }
		 )
}

let makeEC2 = 'aws ec2 run-instances --launch-template LaunchTemplateId=lt-04dfc64765fa9b907,Version=1 >> ec2Instance.json'

let make = shell(makeEC2)

function waitforAWS(){

	if(fs.existsSync('./ec2Instance.json')){

		let id = require('./ec2Instance').Instances[0].InstanceId

		let getEC2Addy = `aws ec2 describe-instances --instance-ids ${id} >> ec2Instance.json`

		shell(getEC2Addy)
	} 
	else{
		waitforAWS()
	}
}

make.on('exit', ()=>{

	waitforAWS()
})
