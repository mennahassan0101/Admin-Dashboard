import bcrypt from "bcryptjs";
const password="admin1234";
const salt= await bcrypt.genSalt(10);
const HashedPassword=await bcrypt.hash(password,salt);
console.log(HashedPassword);
