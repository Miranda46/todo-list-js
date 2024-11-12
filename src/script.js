import './styles.css';

const lists_HTML = (function () {
    function createHTMLList(list, index, listName) {
        let elem = document.createElement('div');
        elem.classList.add('item');
        let name = document.createElement('h5');
        name.innerText = list.name;
        let description = document.createElement('p');
        description.innerText = list.description;
        if (list.urgent) {
            elem.classList.add('urgent');
        }
        if (list.important) {
            elem.classList.add('important');
        }
        let date = document.createElement('p');
        date.innerText = 'Due date: ' + list.date;
        let next = document.createElement('button');
        next.innerText = 'Next Stage';
        next.addEventListener('click', function () { forwardHTML(index, listName) })


        elem.appendChild(name);
        elem.appendChild(description);
        elem.appendChild(date);
        elem.appendChild(next);

        return elem;
    }

    function addElem(elem, list) {
        let listHTML = document.getElementById(list);
        listHTML.appendChild(elem);
    }

    function showLists(lists) {
        console.log(lists);
        document.getElementById('todo_list').innerHTML = '';
        document.getElementById('in_progress_list').innerHTML = '';
        document.getElementById('done_list').innerHTML = '';
        generateNewButton();
        for (let i in lists[0]) {
            let elem = createHTMLList(lists[0][i], i, 'todo_list');
            addElem(elem, 'todo_list');
        }
        for (let i in lists[1]) {
            let elem = createHTMLList(lists[1][i], i, 'in_progress_list');
            addElem(elem, 'in_progress_list');
        }
        for (let i in lists[2]) {
            let elem = createHTMLList(lists[2][i], i, 'done_list');
            addElem(elem, 'done_list');
        }
    }

    function start() {
        createAddButton();
    }

    function createAddButton() {
        let add = document.getElementById('add');
        add.addEventListener('click', function () { openAddModal() });

        let addInput = document.getElementById('add_input');
        addInput.addEventListener('click', function () { addHTML() });

    }

    function openAddModal() {
        let dialog = document.querySelector('dialog');
        dialog.showModal();
    }

    function addHTML() {
        let form = document.getElementById('formular');
        let formdata = new FormData(form);
        console.log(formdata)
        let name = formdata.get('name_input');
        let description = formdata.get('description_input');
        let date = formdata.get('date_input');
        let urgent = formdata.get('urgent_input');
        let important = formdata.get('important_input');
        lists.add(name, description, date, urgent, important, lists.getTodoList());
        showLists(lists.getLists());

        let dialog = document.querySelector('dialog');
        dialog.close();
    }

    function forwardHTML(index, listName) {
        lists.forward(index, listName);
        showLists(lists.getLists());
    }

    function generateNewButton(){
        let div = document.createElement('div');
        div.classList.add('item');
        div.id = 'add';
        let img = document.createElement('img');
        img.src = "./assets/plus-box.svg";
        img.alt = 'add';
        div.appendChild(img);
        let parent = document.getElementById('todo_list');
        parent.appendChild(div);
        let add = document.getElementById('add');
        add.addEventListener('click', function () { openAddModal() });
    }

    return { start };
})();


const lists = (function () {
    let todo_list = [];
    let in_progress_list = [];
    let done_list = [];

    function getTodoList() {
        return todo_list;
    }

    function create(name, description, date, urgent, important) {
        description = description ? description : '(no description)';
        urgent = urgent ? true : false;
        important = important ? true : false;

        return { name, description, date, urgent, important };
    }
    function add(name, description, date, urgent, important, list) {
        let todo = create(name, description, date, urgent, important);
        addToList(todo, list);
    }

    function addToList(todo, list) {
        console.log(todo)
        if (list.length == 0) {
            list.push(todo);
        }
        else if (!todo.urgent && !todo.important) {
            list.push(todo);
        }
        else if (todo.important) {
            list.splice(0, 0, todo);
        }
        else if (todo.urgent) {
            for (let i in list) {
                if (!list[i].important) {
                    list.splice(i, 0, todo);
                    break
                }
            }
        }
    }

    function forward(index, listName) {
        if (listName == 'todo_list') {
            let todo = todo_list.splice(todo_list[index], 1);
            addToList(todo[0], in_progress_list);
        }
        else if (listName == 'in_progress_list') {
            let todo = in_progress_list.splice(in_progress_list[index], 1);
            addToList(todo[0], done_list);
        }
        else if (listName == 'done_list') {
            let todo = done_list.splice(done_list[index]);
        }
    }

    function getLists() {
        return [todo_list, in_progress_list, done_list];
    }

    return { forward, add, getLists, getTodoList };
})();

lists_HTML.start();


