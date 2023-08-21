import { Request,Response,NextFunction } from "express"
import { db, userTable,User } from "../models/Users"
import { eq } from "drizzle-orm";
import { compare, hash,hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { url } from "inspector";


export const SignUp = async (req:any,res:any) => {
    const {name,email,password} = req.body;
    try{
        if(!name || !email || !password){
            if(!(!name)){
               return res.json({data:"Name is Missing",status:"name-missing"})
            }
            else if(!(!email)){
               return res.json({data:"Email is Missing",status:"email-missing"})
            }
            else if(!(!password)){
               return res.json({data:"Password is Missing",status:"password-missing"})
            }
       }

        const data = await db.select().from(userTable).where(eq(userTable.email,email));
        if(data.length){
            return res.json({data:"Email already registered with another account",status:"email-exists"})
        }
        else{
            const passHash = await hash(password,10);
            const data = await db.insert(userTable).values({name,email,password:passHash});
            if(data){
                return res.json({data:data,status:"email-registered"});
            }else{
                return res.json()
            }

        }       

    }catch(error){
        console.log("Error in sign up ", (error as {message:string}).message);
    }
    
}
export const Login = async (req:Request,res:Response,next:NextFunction) => {
    const  {email,password} = req.body;
   
    try{
        if(!email || !password){
            if(!(!email)){
                return res.json({data:"Email is Missing",status:"email-missing"})
             }
             else if(!(!password)){
                return res.json({data:"Password is Missing",status:"password-missing"})
             }
        }

        else{
            const user:User[] = await db.select().from(userTable).where(eq(userTable.email,email))

            if(!user){
                return res.json({data:"user dosen't exits.Signup first",status:"signup-first"})
            }

            const UserData = user[0];
            console.log("FFFFFF",UserData);
            const passwordStatus = await compare(password,UserData.password);
            console.log("Password",passwordStatus)
            if(passwordStatus){
                var token = jwt.sign(UserData,process.env.SECERT_KEY!,{expiresIn:"1d"})
                console.log(token);
                const response = res.json({data:"Login Successfull",success:true});
                res.cookie("token", token, { httpOnly: true });
                return response;
            }
            else{
                return res.json({message:"Password is incorrect",status:"incorrect-password"})
            }
            
        }

    }catch(error){
        console.log("Error in sign up ", (error as {message:string}).message);
    }
}

export const Logout = (req:Request,res:Response,next:NextFunction) => {

    try {
        const response = res.json({data:"Logout Successfull",success:true});
        res.cookie("token", "", { httpOnly: true, expires:new Date(0) });
        return response;
    } catch (error) {
        console.log("Error in sign up ", (error as {message:string}).message);
    }
}


export const Auth = (req:Request,res:Response,next:NextFunction) => {
     const path = req.path;
     const isPublicPath = path === '/login' || path === '/signup' || path === '';
     const token = req.cookies.token;
     if (isPublicPath && token) {
        const pathUrl = new URL('/', 'http://localhost:3000');
        return res.json({ data: pathUrl.href }); 
    }
    if(!isPublicPath && !token){
        const pathUrl = new URL('/login', 'http://localhost:3000');
        return res.json({ data: pathUrl.href }); 
    }
}
