function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: ${book.quantity}</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;
    return div;
}

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books');

    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });

                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                        calculateShipping(id, cep);
                    });
                });

                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.log(err);
        });
});

function SearchProductByID(id){
    fetch('http://localhost:3000/product/' + id)
    .then((data) => {
        console.log(data);
        if (data.ok) {
            return data.json();
        }
        throw data.statusText;
    })
    .then((data) => {
        swal('Resultados da busca', `Nome do livro: ${data.name}\nAutor: ${data.author}\nValor: ${data.price.toFixed(2)}\nEstoque: ${data.quantity}`, 'success');
    })
    .catch((err) => {
        swal('Erro', 'Erro ao consultar produto', 'error');
        console.log(err);
    });
}


button = document.querySelector("#pesquisar_button");
button.addEventListener('click', (e) => {
    const texto = document.getElementById("pesquisa").value
    console.log(texto)
    SearchProductByID(texto)
});

buttonAdd = document.getElementById("add_book");
buttonAdd.addEventListener('click', e=>{
   let container = document.querySelector('.box.cta')
   let id = document.createElement('input');
   let name = document.createElement('input');
   let valor = document.createElement('input');
   let autor = document.createElement('input');
   let estoque = document.createElement('input');
   let new_button = document.createElement('button');
   new_button.style.width = '150px';
   new_button.style.height = '25px';
   id.placeholder = 'Informe o id';
   id.style.marginRight = '5px';
   name.style.marginRight = '5px';
   valor.style.marginRight = '5px';
   autor.style.marginRight = '5px';
   estoque.style.marginRight = '5px';
   name.placeholder = 'Informe o nome';
   valor.placeholder = 'Informe o valor';
   autor.placeholder = 'Informe o Autor';
   estoque.placeholder = 'Informe o estoque';
   new_button.textContent = 'Adicionar';
   container.appendChild(id);
   container.appendChild(name);
   container.appendChild(valor);
   container.appendChild(autor);
   container.appendChild(estoque);
   container.appendChild(new_button);
    buttonAdd.style.display = 'none';
    new_button.addEventListener('click', e=>{
        const dados = {
            id: parseInt(id.value),
            name: name.value,
            quantity: parseInt(estoque.value),
            price: parseFloat(valor.value),
            photo: "/img/esm.png",
            author: autor.value
        };
        console.log(dados);
        fetch('http://localhost:3000/newProduct',{
            method: 'POST',
            body: JSON.stringify(dados),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((data) =>{
            if(data.ok){
                
               return data.json();
            }
            throw data.statusText;
        }).then((data) => {
            livro_adicionado = JSON.parse(data);
            swal('Livro adicionado', `id do livro adicionado: ${livro_adicionado.id}`).then(()=>{
                location.reload();
            });
            
        })
        .catch((err) => {
            swal('Erro', 'Erro ao adicionar novo livro', 'error');
            console.log(err);
        });
    });
});