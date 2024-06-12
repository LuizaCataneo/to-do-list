// Seleção de elementos do DOM
const todoForm = document.querySelector("#todo-form"); // Formulário para adicionar tarefas
const todoInput = document.querySelector("#todo-input"); // Campo de entrada para novas tarefas
const todoList = document.querySelector("#todo-list"); // Lista onde as tarefas serão exibidas
const editForm = document.querySelector("#edit-form"); // Formulário para editar tarefas
const editInput = document.querySelector("#edit-input"); // Campo de entrada para edição de tarefas
const cancelEditBtn = document.querySelector("#cancel-edit-btn"); // Botão para cancelar a edição
const searchInput = document.querySelector("#search-input"); // Campo de entrada para pesquisa de tarefas
const eraseBtn = document.querySelector("#erase-button"); // Botão para limpar a pesquisa
const filterBtn = document.querySelector("#filter-select"); // Seleção de filtro de tarefas

let oldInputValue; // Variável para armazenar o valor antigo da tarefa ao editar

// Função para salvar uma nova tarefa
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div"); // Cria um contêiner div para a tarefa
  todo.classList.add("todo"); // Adiciona a classe "todo" ao contêiner

  const todoTitle = document.createElement("h3"); // Cria um elemento h3 para o título da tarefa
  todoTitle.innerText = text; // Define o texto do título da tarefa
  todo.appendChild(todoTitle); // Adiciona o título ao contêiner da tarefa

  const doneBtn = document.createElement("button"); // Cria um botão para marcar a tarefa como concluída
  doneBtn.classList.add("finish-todo"); // Adiciona a classe "finish-todo" ao botão
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; // Adiciona um ícone ao botão
  todo.appendChild(doneBtn); // Adiciona o botão ao contêiner da tarefa

  const editBtn = document.createElement("button"); // Cria um botão para editar a tarefa
  editBtn.classList.add("edit-todo"); // Adiciona a classe "edit-todo" ao botão
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'; // Adiciona um ícone ao botão
  todo.appendChild(editBtn); // Adiciona o botão ao contêiner da tarefa

  const deleteBtn = document.createElement("button"); // Cria um botão para remover a tarefa
  deleteBtn.classList.add("remove-todo"); // Adiciona a classe "remove-todo" ao botão
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'; // Adiciona um ícone ao botão
  todo.appendChild(deleteBtn); // Adiciona o botão ao contêiner da tarefa

  // Verifica se a tarefa está marcada como concluída
  if (done) {
    todo.classList.add("done"); // Adiciona a classe "done" ao contêiner da tarefa
  }

  // Salva a tarefa no localStorage
  if (save) {
    saveTodoLocalStorage({ text, done: 0 }); // Salva a tarefa no localStorage com o status não concluído
  }

  todoList.appendChild(todo); // Adiciona a tarefa à lista de tarefas

  todoInput.value = ""; // Limpa o campo de entrada
  todoInput.focus(); // Define o foco no campo de entrada
};

// Função para alternar entre os formulários de adicionar e editar tarefas
const toggleForms = () => {
  editForm.classList.toggle("hide"); // Alterna a classe "hide" no formulário de edição
  todoForm.classList.toggle("hide"); // Alterna a classe "hide" no formulário de adicionar
  todoList.classList.toggle("hide"); // Alterna a classe "hide" na lista de tarefas
};

// Função para atualizar uma tarefa editada
const updateTodo = (editText) => {
  const todos = document.querySelectorAll(".todo"); // Seleciona todas as tarefas

  todos.forEach((todo) => {
    // Para cada tarefa
    let todoTitle = todo.querySelector("h3"); // Seleciona o título da tarefa

    if (todoTitle.innerText === oldInputValue) {
      // Verifica se o título é o mesmo que o antigo
      todoTitle.innerText = editText; // Atualiza o título da tarefa
      updateTodosLocalStorage(oldInputValue, editText); // Atualiza a tarefa no localStorage
    }
  });
};

// Função para pesquisar tarefas
const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo"); // Seleciona todas as tarefas

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase(); // Obtém o título da tarefa em minúsculas
    const normalizedSearch = search.toLowerCase(); // Normaliza a pesquisa para minúsculas

    todo.style.display = "flex"; // Exibe todas as tarefas

    if (!todoTitle.includes(normalizedSearch)) {
      todo.style.display = "none"; // Oculta as tarefas que não correspondem à pesquisa
    }
  });
};

// Função para filtrar tarefas
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo"); // Seleciona todas as tarefas
  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex")); // Exibe todas as tarefas
      break;

    case "done":
      todos.forEach(
        (todo) =>
          todo.classList.contains("done")
            ? (todo.style.display = "flex") // Exibe tarefas concluídas
            : (todo.style.display = "none") // Oculta tarefas não concluídas
      );
      break;

    case "todo":
      todos.forEach(
        (todo) =>
          !todo.classList.contains("done")
            ? (todo.style.display = "flex") // Exibe tarefas não concluídas
            : (todo.style.display = "none") // Oculta tarefas concluídas
      );
      break;

    default:
      break;
  }
};

// Evento para adicionar uma nova tarefa
todoForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita o comportamento padrão do formulário

  const inputValue = todoInput.value; // Obtém o valor do campo de entrada
  if (inputValue) {
    saveTodo(inputValue); // Salva a nova tarefa
  }
});

// Evento para ações nos botões de concluir, editar e remover tarefas
document.addEventListener("click", (e) => {
  const targetEl = e.target; // Elemento alvo do clique
  const parentEl = targetEl.closest("div"); // Elemento pai mais próximo que é uma div
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText; // Obtém o título da tarefa
  }
  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done"); // Alterna a classe "done" para marcar/desmarcar a tarefa como concluída
    updateTodosStatusLocalStorage(todoTitle); // Atualiza o status da tarefa no localStorage
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove(); // Remove a tarefa
    removeTodoLocalStorage(todoTitle); // Remove a tarefa do localStorage
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms(); // Alterna para o formulário de edição
    editInput.value = todoTitle; // Preenche o campo de entrada de edição com o título da tarefa
    oldInputValue = todoTitle; // Armazena o título antigo da tarefa
  }
});

// Evento para cancelar a edição de uma tarefa
cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Evita o comportamento padrão do botão
  toggleForms(); // Alterna para o formulário de adicionar
});

// Evento para salvar a edição de uma tarefa
editForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita o comportamento padrão do formulário

  const editInputValue = editInput.value; // Obtém o valor do campo de entrada de edição

  if (editInputValue) {
    updateTodo(editInputValue); // Atualiza a tarefa
  }

  toggleForms(); // Alterna para o formulário de adicionar
});

// Evento para pesquisar tarefas conforme o usuário digita
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value; // Obtém o valor do campo de pesquisa
  getSearchTodos(search); // Filtra as tarefas com base na pesquisa
});

// Evento para limpar o campo de pesquisa
eraseBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Evita o comportamento padrão do botão
  searchInput.value = ""; // Limpa o campo de pesquisa
  searchInput.dispatchEvent(new Event("keyup")); // Dispara o evento "keyup" para atualizar a lista de tarefas
});

// Evento para filtrar tarefas conforme a seleção do filtro
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value; // Obtém o valor do filtro selecionado
  filterTodos(filterValue); // Filtra as tarefas com base no valor selecionado
});

// Funções para manipulação do localStorage
const getTodoLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || []; // Obtém as tarefas do localStorage ou inicializa um array vazio
  return todos;
};

const loadTodos = () => {
  const todos = getTodoLocalStorage(); // Carrega as tarefas do localStorage
  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0); // Salva cada tarefa na lista
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodoLocalStorage(); // Obtém as tarefas do localStorage
  todos.push(todo); // Adiciona a nova tarefa ao array
  localStorage.setItem("todos", JSON.stringify(todos)); // Salva o array atualizado no localStorage
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodoLocalStorage(); // Obtém as tarefas do localStorage
  const filteredTodos = todos.filter((todo) => todo.text !== todoText); // Filtra as tarefas removendo a tarefa específica
  localStorage.setItem("todos", JSON.stringify(filteredTodos)); // Salva o array atualizado no localStorage
};

const updateTodosStatusLocalStorage = (todoText) => {
  const todos = getTodoLocalStorage(); // Obtém as tarefas do localStorage
  todos.map(
    (todo) => (todo.text === todoText ? (todo.done = !todo.done) : null) // Alterna o status da tarefa
  );
  localStorage.setItem("todos", JSON.stringify(todos)); // Salva o array atualizado no localStorage
};

const updateTodosLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodoLocalStorage(); // Obtém as tarefas do localStorage
  todos.map(
    (todo) => (todo.text === todoOldText ? (todo.text = todoNewText) : null) // Atualiza o texto da tarefa
  );
  localStorage.setItem("todos", JSON.stringify(todos)); // Salva o array atualizado no localStorage
};

// Carrega as tarefas do localStorage ao carregar a página
loadTodos();
