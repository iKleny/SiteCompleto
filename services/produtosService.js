import { connect } from "../database/db.js"

export class ProdutosService{
    async produtos() {
        const conn = await connect()
        const [rows] = await conn.query('SELECT * FROM produtos')
        return rows
    }

    async delete(id) {
        const conn = await connect()
        const rows = await conn.query('delete from produtos where id = ?', [id])
        return rows
    }

    async insertProduto(obj) {
        const conn = await connect()
        await conn.query(
            'INSERT INTO produtos (produto, desc_produto, valor, imagem) VALUES (?,?,?,?);',
            [obj.produto, obj.desc_produto, obj.valor, obj.imagem]
        )
    }

    async updateProdutos(id, produto) {
        const conn = await connect();
        return await conn.query(
            `UPDATE produtos SET produto = ?, desc_produto = ?, valor = ?, imagem = ? WHERE id = ?;`,
            [produto.produto, produto.desc_produto, produto.valor, produto.imagem, id]
        );
    }
}