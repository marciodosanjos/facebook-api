dias = [1, 2, 3, 4]
vendas = [12, 23, 34, 33]
descontos = [4, 7, 8, 3]
vendedores = [56, 56, 56, 67]

const newVendas = dias.map((item, index) => {
    return {
        dia: item,
        vendas: vendas[index],
        descontos: descontos[index],
        vendedores: vendedores[index]
    }
})

console.log(newVendas)

// //params
// const user = req.params
// url/marcio

// //query
// const user2 = req.query
// url?nome=marcio