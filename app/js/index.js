class Formulary {
  constructor() {
    this.products = []; // produtos
    this.isEditing = false; // flag para indicar quando editar ou adicionar um produto
    this.indProdToBeEdited = 0; // índice do produto a ser editado

    this.initializeBtns(); // ações do formulário
  }

  initializeBtns() {
    var save = document.querySelector("#save");
    var clean = document.querySelector("#clean");
    var generatePDF = document.querySelector("#generate-pdf");

    save.addEventListener("click", () => {
      this.save();
    });

    clean.addEventListener("click", () => {
      this.clean();
    });

    generatePDF.addEventListener("click", () => {
      this.generatePDF();
    });
  }

  // verificando se o produto já está presente na lista
  checkProd(name) {
    var isAlreadyIncluded = false;

    for (const product of this.products) {
      if (product["name"] == name) {
        isAlreadyIncluded = true;
        break;
      }
    }
    return isAlreadyIncluded;
  }

  // editando o produto
  editItem(i, name) {
    this.isEditing = true;
    this.indProdToBeEdited = i;
    document.getElementById("prodName").value = name;
  }

  // deletando o produto
  deleteItem(i) {
    var del = confirm("Deseja excluir este produto da lista?");

    if (del) {
      this.products.splice(i, 1);
      localStorage.setItem("products", JSON.stringify(this.products));
      this.buildProdCard();
    }
  }

  // construindo a lista de produtos
  buildProdCard() {
    var prodList = document.querySelector(".list-container");

    prodList.innerHTML = "";

    for (let i = 0; i < this.products.length; i++) {
      const name = this.products[i]["name"];

      // criando os elementos HTML do card
      var card = document.createElement("div");
      var actionsContent = document.createElement("div");
      var pName = document.createElement("p");
      var editIcon = document.createElement("span");
      var deleteIcon = document.createElement("span");

      // definindo os atributos dos elementos
      card.setAttribute("class", "prod-card");
      actionsContent.setAttribute("class", "prod-card-actions");

      pName.setAttribute("id", "prod-name");
      editIcon.setAttribute("class", "material-symbols-outlined");
      deleteIcon.setAttribute("class", "material-symbols-outlined");

      // definindo o conteúdo dos elementos
      pName.textContent = name;
      editIcon.textContent = "edit";
      deleteIcon.textContent = "delete";

      // adicionando os métodos de ação
      editIcon.addEventListener("click", () => {
        this.editItem(i, name);
      });
      deleteIcon.addEventListener("click", () => {
        this.deleteItem(i);
      });

      // definindo as relações entre os elementos HTML
      actionsContent.append(editIcon, deleteIcon);
      card.append(pName, actionsContent);
      prodList.appendChild(card);
    }
  }

  // salvar o produto na lista de compras
  save() {
    var name = document.getElementById("prodName").value;

    if (name) {
      // criando um produto
      var product = new Product(name.trim());

      if (this.isEditing) {
        // editando o produto
        this.products[this.indProdToBeEdited] = product;
        this.isEditing = false;
      } else {
        // verificando se o produto já foi incluído na lista
        var isAlreadyIncluded = this.products.some(
          (product) => product["name"] === name
        );

        if (!isAlreadyIncluded) {
          // adicionando o produto na lista
          this.products.push(product);
        } else {
          alert("Este produto já está na lista de compras!");
        }
      }

      localStorage.setItem("products", JSON.stringify(this.products));

      document.getElementById("prodName").value = "";

      this.buildProdCard();
    } else {
      alert("Campo obrigatório!");
    }
  }

  // limpar todos os produtos da lista de compra
  clean() {
    this.products = [];
    localStorage.setItem("products", JSON.stringify([]));
    this.buildProdCard();
  }

  // gerar pdf
  generatePDF() {
    if (this.products.length != 0) {
      // configurações do arquivo final PDF
      const options = {
        margin: [10, 10, 10, 10],
        filename: "lista_compras.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // conteúdo do PDF
      let content = "<h3>Lista de Compras</h3><br><ul>";
      this.products.forEach((item, index) => {
        content += `<li>${index + 1} - ${item["name"]}</li>`;
      });
      content += "</ul>";

      // salvando o PDF
      html2pdf().set(options).from(content).save();

      console.log("PDF gerado com sucesso.");
    } else {
      alert("A lista de compras está vazia.");
    }
  }
}

class Application {
  constructor() {
    this.formulary = new Formulary();

    // inicializando os itens
    this.initializeItems();
  }

  initializeItems() {
    if (localStorage.getItem("products") != null) {
      // recebendo os produtos da lista de compras
      this.formulary.products = JSON.parse(localStorage.getItem("products"));
    } else {
      localStorage.setItem("products", JSON.stringify([]));
    }

    this.formulary.buildProdCard(); // construindo a lista dos produtos
  }
}

const app = new Application();
