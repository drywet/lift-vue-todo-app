// visibility filters
var filters = {
    all: function (todos) {
        return todos
    },
    active: function (todos) {
        return todos.filter(function (todo) {
            return !todo.completed
        })
    },
    completed: function (todos) {
        return todos.filter(function (todo) {
            return todo.completed
        })
    }
}

// app Vue instance
var app = new Vue({
    // app initial state
    data: {
        todos: [],
        newTodo: '',
        editedTodo: null,
        visibility: 'all'
    },

    // watch todos change for localStorage persistence
    watch: {
        todos: {
            handler: function (todos) {
                saveTodos(todos)
            },
            deep: true
        }
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
        filteredTodos: function () {
            return filters[this.visibility](this.todos)
        },
        remaining: function () {
            return filters.active(this.todos).length
        },
        allDone: {
            get: function () {
                return this.remaining === 0
            },
            set: function (value) {
                this.todos.forEach(function (todo) {
                    todo.completed = value
                })
            }
        }
    },

    filters: {
        pluralize: function (n) {
            return n === 1 ? 'item' : 'items'
        }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
        addTodo: function () {
            var value = this.newTodo && this.newTodo.trim()
            if (!value) {
                return
            }
            this.todos.push({
                id: getNextId(),
                title: value,
                completed: false
            })
            this.newTodo = ''
        },

        removeTodo: function (todo) {
            this.todos.splice(this.todos.indexOf(todo), 1)
        },

        editTodo: function (todo) {
            this.beforeEditCache = todo.title
            this.editedTodo = todo
        },

        doneEdit: function (todo) {
            if (!this.editedTodo) {
                return
            }
            this.editedTodo = null
            todo.title = todo.title.trim()
            if (!todo.title) {
                this.removeTodo(todo)
            }
        },

        cancelEdit: function (todo) {
            this.editedTodo = null
            todo.title = this.beforeEditCache
        },

        removeCompleted: function () {
            this.todos = filters.active(this.todos)
        }
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
        'todo-focus': function (el, binding) {
            if (binding.value) {
                el.focus()
            }
        }
    }
})

// handle routing
function onHashChange() {
    var visibility = window.location.hash.replace(/#\/?/, '')
    if (filters[visibility]) {
        app.visibility = visibility
    } else {
        window.location.hash = ''
        app.visibility = 'all'
    }
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
app.$mount('.todoapp')

function getNextId() {
    const ids = app.todos.map(x => x.id)
    const maxId = Math.max(...ids)
    if (maxId >= 0) {
        return maxId + 1
    } else {
        return 0
    }
}

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

function ajaxPut(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'PUT',
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

function fetchTodos() {
    ajaxGet('/api/todo')
        .then(items => {
            app.$set(app, 'todos', items.sort((a, b) => a.id - b.id))
        })
}

fetchTodos()

function saveTodos(todos) {
    ajaxPut('/api/todo/save_all', todos)
}