const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

function createAdmin() {
    const phone = "";
    if(phone === "") {
        console.error("Please provide a phone number in the createAdmin function");
        return;
    };
    const password = "123456789";
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const admin = {
        name: "Admin",
        phone: phone,
        password: hashedPassword,
    }
    const URI = "mongodb://localhost:27017/return-flow";
    mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            const Admin = mongoose.model("Admin", {
                name: String,
                phone: String,
                password: String,
            });

            return Admin.create(admin);
        })
        .then(() => {
            console.log("Admin created successfully");
            mongoose.disconnect();
        })
        .catch(err => {
            console.error("Error creating admin:", err);
        });
};

createAdmin(); // Call the function