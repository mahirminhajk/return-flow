export const enquiryTemplate = (name: string, phone: string, description: string, email?: string, service?: string,) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #02621a;
            color: white;
            padding: 15px;
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            color: #333;
            margin: 10px 0;
        }
        .info-box {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            border-left: 4px solid #02621a;
        }
        .info-box strong {
            color: #333;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #666;
            background: #f4f4f4;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">New Inquiry</div>
    
    <div class="content">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service ? service : ''}</p>
        <p><strong>Description:</strong> ${description ? description : ''}</p>
    </div>

    <div class="footer">
        &copy; 2025 RETURN FLOW | All Rights Reserved
    </div>
</div>

</body>
</html>
`
};