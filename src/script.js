import './styles.css';

const lists_HTML = (function() {
    function createHTMLList(list){
        let elem = document.createElement('div');
        elem.classList.add('item');
        let name = document.createElement('h5');
        name.innerText = list.name;
        let description = document.createElement('p');
        description.innerText = list.description;
        if (list.urgent) {
            elem.classList.add('urgent');
        }
        if (list.important){
            elem.classList.add('important');
        }
        let date = document.createElement('p');
        date.innerText = list.date;
        elem.appendChild(name);
        elem.appendChild(description);
        elem.appendChild(date);

        return elem;
    }

    function addElem(elem, list) {
        let listHTML = document.getElementById(list);
        listHTML.appendChild(elem);
    }

    function showLists(lists){
        for (let i in lists[0]){
            let elem = createHTMLList(lists[0][i]);
            addElem(elem, 'todo_list');
        }
        console.log('lists')
        for (let i in lists[1]){
            let elem = createHTMLList(lists[1][i]);
            addElem(elem, 'in_progress_list');
        }
        for (let i in lists[2]){
            let elem = createHTMLList(lists[2][i]);
            addElem(elem, 'done_list');
        }
    }

    function start(){
        createAddButton();
    }

    function createAddButton(){
        let add = document.getElementById('add');
        add.addEventListener('click', function(){openAddModal()});

        let addInput = document.getElementById('add_input');
        addInput.addEventListener('click', function(){addHTML()});

    }

    function openAddModal(){
        let dialog = document.querySelector('dialog');
        dialog.showModal();
    }

    function addHTML(){
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

    return { start };
})();


const lists = (function (){
    let todo_list = [];
    let in_progress_list = [];
    let done_list = [];

    function getTodoList(){
        return todo_list;
    }

    function create(name, description, date, urgent, important) {
        description = description ? description : '(no description)';
        urgent = urgent ? true : false;
        important = important ? true: false;

        return { name, description, date, urgent, important };
    }
    function add(name, description, date, urgent, important, list) {
        let todo = create(name, description, date, urgent, important);
        list.push(todo);
    }

    function forward(todo, listName){
        if (listName == 'todo_list') {
            todo_list.splice(todo_list.indexOf(todo));
            in_progress_list.push(todo);
        }
        else if (listName == 'in_progress_list') {
            in_progress_list.splice(in_progress_list.indexOf(todo));
            done_list.push(todo);
        }
        else if (listName == 'done_list') {
            done_list.splice(done_list.indexOf(todo));
        }
    }

    function getLists() { 
        return  [ todo_list, in_progress_list, done_list ];
    }

    return { forward, add, getLists, getTodoList };
})();

lists_HTML.start();


