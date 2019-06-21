const todoProtoElem = $('.todo')
todoProtoElem.removeClass('invisible')
todoProtoElem.remove()

// visibility filters
const filters = {
    all: (todos) => {
        return todos
    },
    active: (todos) => {
        return todos.filter((todo) => {
            return !todo.completed
        })
    },
    completed: (todos) => {
        return todos.filter((todo) => {
            return todo.completed
        })
    }
}

// app initial state
const data = {
    todos: [],
    visibility: 'all'
}

const computed = {
    filteredTodos: () => {
        return filters[data.visibility](data.todos)
    },
    remaining: () => {
        return filters.active(data.todos).length
    },
    isAllDone: () => {
        return computed.remaining() === 0
    }
}

function pluralizeItem(n) {
    return n === 1 ? 'item' : 'items'
}

const methods = {
    addTodo: (title) => {
        const value = title.trim()
        if (!value) {
            return
        }
        const todoDto = {
            title: value,
            completed: false
        }
        ajaxPost('/api/todo', todoDto)
            .then((todo) => {
                data.todos = data.todos.concat(todo)
                render()
                console.log('added')
            })
    },
    removeTodo: (todo) => {
        data.todos = data.todos.filter(x => x.id !== todo.id)
        render()
        ajaxDelete('/api/todo/' + todo.id)
            .then(() => {
                console.log('deleted')
            })
    },
    removeCompleted: () => {
        filters
            .completed(data.todos)
            .forEach(todo => methods.removeTodo(todo))
    },
    toggleCompleted: (todo, completed) => {
        todo.completed = completed
        render()
        ajaxPut('/api/todo/' + todo.id, todo)
            .then(() => {
                console.log('updated')
            })
    },
    setAllDone: (value) => {
        data.todos.forEach((todo) => {
            toggleCompleted(todo, value)
        })
    }
}

// handle routing
function onHashChange() {
    const visibility = window.location.hash.replace(/#\/?/, '')
    if (filters[visibility]) {
        data.visibility = visibility
    } else {
        window.location.hash = ''
        data.visibility = 'all'
    }
    render()
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

function getNextId() {
    const existingIds = data.todos.map(x => x.id)
    let i = 0
    while (existingIds.includes(i)) {
        i++
    }
    return i
}

function render() {
    $('.main').toggleClass('invisible', data.todos.length <= 0)
    $('.footer').toggleClass('invisible', data.todos.length <= 0)
    $('.clear-completed').toggleClass('invisible', data.todos.length - computed.remaining() <= 0)
    $('.clear-completed').click(() => methods.removeCompleted())
    $('#toggle-all')[0].checked = computed.isAllDone()
    $('#toggle-all').click(() => methods.setAllDone($('#toggle-all')[0].checked))
    $('.todo-count__remaining').text(computed.remaining())
    $('.todo-count__item-pluralized').text(pluralizeItem(computed.remaining()))

    $('.todo-list').empty()
    computed.filteredTodos().forEach(todo => {
        const elem = todoProtoElem.clone()
        $('.todo-list').append(elem)
        elem.toggleClass('completed', todo.completed)
        elem.find('.toggle')[0].checked = todo.completed
        elem.find('.toggle').click(() => methods.toggleCompleted(todo, elem.find('.toggle')[0].checked))
        elem.find('label').text(todo.title)
        elem.find('button').click(() => methods.removeTodo(todo))
    })
}

$('.new-todo').keypress((e) => {
    if (e.which === 13) {
        methods.addTodo($('.new-todo').val())
        $('.new-todo').val('')
    }
})

function ajaxGet(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/json;charset=utf-8',
            data: data,
            dataType: 'json',
            success: (data) => {
                resolve(data)
            },
            error: (jqXHR, textStatus, error) => {
                reject(error)
            }
        })
    })
}

function ajaxPost(url, data) {
    return ajaxWithJsonBody(url, data, 'POST')
}

function ajaxPut(url, data) {
    return ajaxWithJsonBody(url, data, 'PUT')
}

function ajaxWithJsonBody(url, data, httpMethod) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: httpMethod,
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            success: (data) => {
                resolve(data)
            },
            error: (jqXHR, textStatus, error) => {
                reject(error)
            }
        })
    })
}

function ajaxDelete(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'DELETE',
            contentType: 'application/json;charset=utf-8',
            success: (data) => {
                resolve(data)
            },
            error: (jqXHR, textStatus, error) => {
                reject(error)
            }
        })
    })
}

function fetchTodos() {
    ajaxGet('/api/todo')
        .then(items => {
            data.todos = items.sort((a, b) => a.id - b.id)
            render()
        })
}

fetchTodos()