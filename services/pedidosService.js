import { connect } from "../database/db.js"


export class PedidosService {

    async insertPedidos(obj) {
        const conn = await connect()
        await conn.query(
            'INSERT INTO pedidos (login, produto, valor, quantidade, pagamento, contato, endereco, pedido) VALUES (?,?,?,?,?,?,?,"a caminho");',
            [obj.login, obj.produto, obj.valor, obj.quantidade, obj.pagamento, obj.contato, obj.endereco]
        )
    }

    async findPedidos(login) {
        const conn = await connect()
        const [rows] = await conn.query('SELECT * FROM pedidos WHERE login = ?', [login])
        return rows
    }

    async findAllPedidos() {
        const conn = await connect()
        const [rows] = await conn.query('SELECT * FROM pedidos')
        return rows
    }

    async delete(id) {
        const conn = await connect()
        const rows = await conn.query('delete from pedidos where id = ?', [id])
        return rows
    }

    async updateDemandas(id, obj) {
        const conn = await connect();
        return await conn.query(
            `UPDATE pedidos SET pedido = ? WHERE id = ?;`,
            [obj.pedido, id]
        );
    }
}