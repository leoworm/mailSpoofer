var nodemailer = require("nodemailer");
var prompt = require("prompt-sync")();
var json = require("jsonfile");

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'wini.ott@web.de', // generated ethereal user
            pass: 'artemisfowl' // generated ethereal password
        }
    });
	var tempIf = prompt("Use a template?(y/N)");
	if(tempIf.toLowerCase() !== "n"){
		console.log("Selected template.");
		
	}else{
		var sender = prompt("Sender: ");
		console.log();
		var recipient = prompt("Recipient: ");
		console.log();
		var subj = prompt("Subject: ");
		console.log();
		var content = prompt("Content: ");
		console.log();
		var times = prompt("Amount of mails: ");
		console.log();
		
		// setup email data with unicode symbols
		let mailOptions = {
			from: sender, // sender address
			to: recipient, // list of receivers
			subject: subj, // Subject line
			text: content, // plain text body
			html: '' // html body
		};

		// send mail with defined transport object
		for(i=0;i<times;i++){
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: %s', info.messageId);
				// Preview only available when sending through an Ethereal account
				//console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
				// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
			});
		};
	};
});
