import { connect } from "../database/db.js"
import bcrypt from 'bcrypt'

export class UsuariosService {

    async insertUsuario(obj) {
        const conn = await connect()
        const password = await bcrypt.hash(obj.password, 10)
        try {
            await conn.query(
                'INSERT INTO usuarios (login, email, password, endereco, contato, nivel_usuario) VALUES (?,?,?,?,?,0);',
                [obj.login, obj.email, password, obj.endereco, obj.contato]
            );
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                if (error.sqlMessage.includes('usuarios.email')) {
                    throw new Error("Email já em uso");
                } else if (error.sqlMessage.includes('usuarios.login')) {
                    throw new Error("Login já em uso");
                }
            }
            throw error; // Se não for um erro de chave única, rejeite o erro
        }
        
    }

    async updateCadastro(id, usuario) {
        const conn = await connect();
        return await conn.query(
            `UPDATE usuarios SET email = ?, endereco = ?, contato = ? WHERE id = ?;`,
            [usuario.email, usuario.endereco, usuario.contato, id]
        );
    }

    async updateSenha(id, usuario) {
        const conn = await connect();
        const password = await bcrypt.hash(usuario.password, 10)
        return await conn.query(
            `UPDATE usuarios SET password = ? WHERE id = ?;`,
            [password, id]
        );
    }

    async insertTokens(obj) {
        const conn = await connect()
        await conn.query(
            'INSERT INTO tokens (token, expiration_date) VALUES (?,?);',
            [obj.token, obj.expiration_date]
        )
    }

    async newPassword(id, usuario) {
        const conn = await connect();
        const password = await bcrypt.hash(usuario.password, 10)
        return await conn.query(
            `UPDATE usuarios SET password = ? WHERE id = ?;`,
            [password, id]
        );
    }

    async findToken(token) {
        const conn = await connect()
        const rows = await conn.query('SELECT token FROM tokens WHERE token = ?', [token])
        return rows.length ? rows[0] : null
    }

    async findAllTokens() {
        const conn = await connect()
        const [rows] = await conn.query('SELECT * FROM tokens')
        return rows
    }

    async deleteToken(id) {
        const conn = await connect()
        const rows = await conn.query('delete from tokens where id = ?', [id])
        return rows
    }
    
    async findByLogin(login, email) {
        const conn = await connect()
        const [rows] = await conn.query('SELECT * FROM usuarios WHERE login = ? or email = ?', [login, email])
        return rows.length ? rows[0] : null
    }

    async auth(login, password) {
        const user = await this.findByLogin(login)
        if (!user) throw new Error("Login inválido")

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Senha inválida")
        }
        return user
    }
}