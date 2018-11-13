var nodemailer = require("nodemailer");
var prompt = require("prompt-sync")();
var json = require("jsonfile");
var fs = require('fs');

//I don't think this is needed as I am hosting my own mail server
nodemailer.createTestAccount((err, account) => {

  var tempIf = prompt("Use a template?(y/N) ");
  if(tempIf.toLowerCase() !== "n"){
    var templates = [];
    fs.readdirSync('./templates/').forEach(file => {
      templates.push(file);
    })
    var i = 0;
    templates.forEach(function(file){
      console.log(i + ': ' + file);
      i++
    })
    var fileName = prompt('Please select template number: ');
    var data = json.readFileSync('./templates/' + templates[fileName]);
  }else{
    var data = json.readFileSync('./templates/default.json');
    data.mail.sender = prompt("Sender: ");
    console.log();
    data.mail.recipients = prompt("Recipient: ");
    console.log();
    data.mail.subject = prompt("Subject: ");
    console.log();
    data.mail.content = prompt("Content: ");
    console.log();
    data.mailAmount = prompt("Amount of mails: ");
    console.log();
  }

  // setup email data with unicode symbols
  let transporter = nodemailer.createTransport({
    host: data.server.host,
    port: data.server.post,
    secure: false, // true for 465, false for other ports
    auth: {
      user: data.server.auth.user, // generated ethereal user
      pass: data.server.auth.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  for(var j = 0; j < data.mail.recipients.length; j++){
    let mailOptions = {
      from: data.mail.sender, // sender address
      to: data.mail.recipients[j]+data.mail.domain, // list of receivers
      subject: data.mail.subject, // Subject line
      text: data.mail.content, // plain text body
      html: '' // html body
    };
    for(var i = 0;i<data.mailAmount;i++){
      console.log(`R: ${j+1} of ${data.mail.recipients.length}, ${i+1} of ${data.mailAmount} // Message sent to ` + mailOptions.to);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
      });
    };
  };
});
