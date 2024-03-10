'use strict'
const date = new Date()

const emailBody = (email, message) => { return `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head><title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <!--[if mso]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
            <o:AllowPNG/>
        </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <style>
        * {
            box-sizing: border-box
        }

        body {
            margin: 0;
            padding: 0
        }

        p {
            line-height: inherit
        }

        @media (max-width: 695px) {
            .social_block.desktop_hide .social-table {
                display: inline-block !important
            }
        }
    </style>
</head>
<body>
    <p> A new message has been recieved from  ${email} </p>
    <p> Message ${message} </p>
    <p> This message was sent on ${date.getTime.toString} </p>
</body>
</html>`
}
module.exports = emailBody