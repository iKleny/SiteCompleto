import express from "express";
import session from 'express-session'
import bode from 'body-parser'
import multer from 'multer'
import crypto from "crypto"
import nodemailer from "nodemailer"
import dotenv from 'dotenv';
import { UsuariosService } from "./services/usuariosService.js";
import { PedidosService } from "./services/pedidosService.js";
import { ProdutosService } from "./services/produtosService.js";

const server = express()

// Configuração do nodemailer para enviar e-mails
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

// Services
const usuariosService = new UsuariosService()
const pedidosService = new PedidosService()
const produtosService = new ProdutosService()

/* MIDDLEWARES */
function requireAuthentication(req, res, next) {
    if (req.session.userLogin) {
        next();
    } else {
        return res.redirect("/")
    }
}

function adminAuthentication(req, res, next) {
    if (req.session.userNivel === "1") {
        next();
    } else {
        return res.redirect("/")
    }
}

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/ImagemProdutos/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = file.originalname.split('.')[1];

        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = crypto
            .randomBytes(64)
            .toString('hex');

        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }
});
const upload = multer({ storage });

//FUNCTIONS

async function index(req, res){
    const produtos = await produtosService.produtos()
    return res.render("index", {array: produtos})
}

async function pedidos(req, res){
    const login = req.session.userLogin;
    const pedidos = await pedidosService.findPedidos(login)
    return res.render("pedidos", {array: pedidos})
}

async function demandas(req, res){
    const demandas = await pedidosService.findAllPedidos()
    return res.render("demandas", {array: demandas})
}

async function updateDemandas(req, res){
    const id = req.body.id
    const pedido = req.body.select
    await pedidosService.updateDemandas(id, {pedido})
    return res.redirect("/demandas")
}

async function updateProdutos(req, res){

    upload.single('imagem')(req, res, async function (err) {
        if (err) {
            return res.status(500).send('Erro ao fazer o upload da imagem.');
        }

            const imagem = req.file.path.replace(/\\/g, '/');
            const {produto, valor} = req.body
            const desc_produto = req.body.descricao
            const id = req.body.id
            await produtosService.updateProdutos(id, {produto, desc_produto, valor, imagem});
            return res.redirect("/prod")
        });
}

async function updateCadastro(req, res) {
    const id = req.session.userId;
    const login = req.session.userLogin;
    const password = req.body.editPassword;

    try {
        await usuariosService.auth(login, password);

        await usuariosService.updateCadastro(id, {
            email: req.body.editEmail,
            endereco: req.body.editEndereco,
            contato: req.body.editContato
        });

        res.redirect("/logout");
    } catch (error) {
        console.error(error);
        return erroLog(req, res, error.message);
    }
}

async function updateSenha(req, res) {
    const id = req.session.userId;
    const login = req.session.userLogin;
    const password = req.body.currentPassword;

    try {
        await usuariosService.auth(login, password);

        await usuariosService.updateSenha(id, {
            password: req.body.newPassword
        });

        res.redirect("/logout");
    } catch (error) {
        console.error(error);
        return erroLog(req, res, error.message);
    }
}

async function forgotpass(req, res){
    return res.render("forgotpass")
    
}

async function sendByEmail(req, res){
    const {token} = req.params
    const findTokens = await usuariosService.findToken(token)
    return res.render("sendByEmail", {findTokens})
}

async function updateForgotpass(req, res){
    const email = req.body.email
    const login = req.body.login
    try{
        const user = await usuariosService.findByLogin(login, email)
        if(!user){
            throw new Error("Email inválido");
        }
        const token = crypto.randomBytes(20).toString('hex');
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);

        await usuariosService.insertTokens({
            token,
            expiration_date: expirationDate
        })

        const resetLink = `http://localhost:5500/sendByEmail/${token}`;
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Redefinição de senha',
            text: `Para redefinir sua senha, clique no link a seguir: ${resetLink}`
        });

        return res.redirect("/")

    }catch (e) {
        console.log(e);
        return erroLog(req, res, e.message);
    }  
}

async function newPassword(req, res){
    const {token} = req.params
    const login = req.body.login
    
    try{
        const findToken = await usuariosService.findToken(token)
        if(!findToken){
            throw new Error("Token expirado");
        }
        const user = await usuariosService.findByLogin(login)
        if(!user){
            throw new Error("Login inválido");
        }
        await usuariosService.newPassword(user.id, {
            password: req.body.password
        })
        return res.redirect("/")
        
    } catch (error) {
        console.error(error);
        return erroLog(req, res, error.message);
    }
        
}

async function insertProdutos(req, res){
        
    upload.single('imagem')(req, res, async function (err) {
        if (err) {
            throw new Error('Erro ao fazer o upload da imagem.');
            }

            const imagePath = req.file.path.replace(/\\/g, '/');

            await produtosService.insertProduto({
                produto: req.body.produto,
                desc_produto: req.body.descricao,
                valor: req.body.valor,
                imagem: imagePath
            });

            return res.redirect("/prod");
    });
    
}

async function prod(req, res){
    const produtos = await produtosService.produtos()
    return res.render("prod", {array: produtos})
}

function success(req, res){
    return res.render("success")
}

function erroLog(req, res, errorMessage){
    return res.render("erroLog", { errorMessage })
}

async function verif(req, res){
    let login = req.session.userLogin
    let endereco = req.session.userEndereco
    let contato = req.session.userContato
    let nivel = req.session.userNivel
    let email = req.session.userEmail
    const produtos = await produtosService.produtos()
    return res.render("verif", {login, endereco, nivel, contato, email, array: produtos})
}

async function insertUsuario(req, res){
    try{
        await usuariosService.insertUsuario({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        endereco: req.body.endereco,
        contato: req.body.contato
    })
    return res.redirect("/")
} catch (e) {
    console.log(e);
    return erroLog(req, res, e.message);
    }    
}

async function insertPedidos(req, res){
    await pedidosService.insertPedidos({
        login: req.body.login,
        produto: req.body.produto,
        valor: req.body.valor,
        quantidade: req.body.quantidade,
        pagamento: req.body.pagamento,
        contato: req.body.contato,
        endereco: req.body.endereco
    })

    return res.redirect("/success")
}

async function authent(req, res) {
    const { login, password } = req.body

    return await usuariosService.auth(login, password)
    .then( user => {
        req.session.userLogin = user.login
        req.session.userEndereco = user.endereco
        req.session.userNivel = user.nivel_usuario
        req.session.userContato = user.contato
        req.session.userEmail = user.email
        req.session.userId = user.id
        return res.redirect("/verif")
    })
    .catch( e => {
        console.log(e)
        return erroLog(req, res, e.message)
    })
}

async function logout(req, res){
    req.session.destroy()
    return index(req, res)
}

async function remover(req, res) {
    const { id } = req.params
    await produtosService.delete(id)
    return res.redirect(`/prod`)
}

async function deletePedido(req, res) {
    const { id } = req.params
    await pedidosService.delete(id)
    return res.redirect(`/demandas`)
}

async function deleteExpiredTokens() {
    try {
        const now = new Date();
        const alltokens = await usuariosService.findAllTokens()
    
        for (const token of alltokens) {
            if (token.expiration_date <= now){
                await usuariosService.deleteToken(token.id)
            }
        }

    } catch (error) {
        console.error('Erro ao excluir tokens expirados:', error);
    }
}
setInterval(deleteExpiredTokens, 3600000);


//VIEWS
server.set('view engine', 'ejs')

// Set static files
server.use(express.static("public"))

//URLENCODED
server.use(express.urlencoded({extended:true}))
server.use(bode.urlencoded({ extended: true }));

// Set config session into express
server.use(session({
    secret: 'suaSenhaSecreta',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }//30min
}));


            //ROUTES

//get
server.get("/", index)
server.get("/verif", requireAuthentication, verif)
server.get("/pedidos", requireAuthentication, pedidos)
server.get("/demandas", adminAuthentication, demandas)
server.get("/success", requireAuthentication, success)
server.get("/logout", requireAuthentication, logout)
server.get("/prod", adminAuthentication, prod)
server.get("/remover/:id", adminAuthentication, remover)
server.get("/deletePedido/:id", adminAuthentication, deletePedido)
server.get("/forgotpass", forgotpass)
server.get("/sendByEmail/:token", sendByEmail)
server.get("/erroLog", erroLog)

//post
server.post("/insert", insertUsuario)
server.post("/updateForgotpass", updateForgotpass)
server.post("/updateProdutos", updateProdutos)
server.post("/updateDemandas", updateDemandas)
server.post("/updateCadastro", updateCadastro)
server.post("/updateSenha", updateSenha)
server.post("/newPassword/:token", newPassword)
server.post("/insertProdutos", insertProdutos)
server.post("/insertPedidos", insertPedidos)
server.post("/authent", authent)


//PORT
server.listen(5500)