const express= require('express');
const connection = require('./configs/db')
const bcrypt = require('bcrypt');
const UserModel = require('./models/User.module');
const jwt = require('jsonwebtoken');
const {autentication}= require('./middleware/authentication');
const petroApp = require("./Router/petro.Routes");



const app= express();
app.use(express.json());


app.get('/', (req,res)=>{
    res.send({'petrol app runing  ': ' endpoints (/petro)for see logs , (/petro/create) for creating , (petro/id) for delete and edit (/login) for login , (signup) for signup'});
});


app.post('/signup', async (req,res)=>{
    const {name , email , password  ,phone_number , vehicle_type}  = req.body;
    try {
        bcrypt.hash(password, 4, async function(err, hash) {
   
        const user=   await  UserModel.create({name : name , email : email , password : hash , phone_number : phone_number, vehicle_type: vehicle_type});
           res.send({ msg : ' sign up succusfull ' , user});
        });
           
    } catch (error) {
        console.error(error);
        res.send('sign up failed');
    }
}
);




app.post('/login', async (req, res) => {
    const { email, password } = req.body; 
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                throw err;
            }
            if (result) {
                const token = jwt.sign({userId: user._id}, 'secret');
                console.log(result);
                return res.json({ msg: 'Login successful', token});
            } else {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});



app.use(autentication);
app.use('/petro',petroApp);


const port =7000;

  
app.listen(port, async ()=>{
  await connection;
console.log('app runing at port 7000');
})

