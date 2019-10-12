import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div className="Todo-container">
          <input type="text"
            className="todo-input"
            placeholder="What needs to be done"
            ref={this.todoInput} onKeyUp={this.addTodo}
          />

          {this.todosFiltered().map((todo, index) => 
            <div className="todo-item" key={todo.id}>
              <div className="todo-item-left">
                <input type="checkbox"
                  onChange={(event) => this.checkTodo(todo, index, event)}
                  checked={todo.completed}
                />

                { !todo.editing &&
                  <div 
                    className={ "todo-item-label " + (todo.completed ? 'completed' : '' )}
                    onDoubleClick={(event) => this.editTodo(todo, index, event)}
                  >
                  { todo.title }
                  </div> }

                { todo.editing &&
                  <input type="text"
                    className="todo-item-edit"
                    autoFocus
                    defaultValue={todo.title}
                    onBlur={(event) => this.doneEdit(todo, index, event)}
                    onKeyUp={(event) => {
                      if (event.key === 'Enter')
                        this.doneEdit(todo, index, event);
                      else if (event.key === 'Escape')
                        this.cancelEdit(todo, index, event);
                    }}
                  /> }

              </div>

              <div className="remove-item" onClick={(event) => this.deleteTodo(index)}>&times;</div>
            </div>
          )}

           <div className="extra-container">
             <div>
               <label>
                 <input type="checkbox"
                   checked={!this.anyRemaining()}
                   onChange={this.checkAllTodos}
                 />

               Check all</label>
             </div>

             <div>{this.remaining()} items left</div>
           </div>

           <div className="extra-container">
             <div>
               <button
                 onClick={() => this.updateFilter('all')}
                 className={this.state.filter === 'all' ? "active" : undefined}
               >All</button>

               <button
                 onClick={() => this.updateFilter('active')}
                 className={this.state.filter === 'active' ? "active" : undefined}
               >Active</button>

               <button
                 onClick={() => this.updateFilter('completed')}
                 className={this.state.filter === 'completed' ? "active" : undefined}
               >Completed</button>

             </div>

             { this.todosCompletedCount() > 0 &&
             <div>
               <button onClick={this.clearCompleted}>Clear completed</button>
             </div> }

           </div>

         </div> {/*End of Todo-container*/}

      </div>
    );
  }

  todoInput = React.createRef();

  state = {
    idForTodo: 3,
    filter: 'all',
    beforeEditCache: '',
    todos: [{
      'id': 1,
      'title': 'Finish react todo tutorial',
      'completed': false,
      'editing': false
    }, {
      'id': 2,
      'title': 'Get started with blogging app',
      'completed': false,
      'editing': false
    }]
  }

  addTodo = event => {
    // So we want it only to listen to ENTER key
    if (event.key === 'Enter') {
      const todoInput = this.todoInput.current.value;

      if (todoInput.trim().length === 0)
        return;

      this.setState((prevState, props) => {
        let todos = prevState.todos;
        let idForTodo = prevState.idForTodo + 1;

        todos.push({
          id: idForTodo,
          title: todoInput,
          completed: false
        });

        // Update to the new state
        return { todos, idForTodo };
      });

      // Clear input after hit enter key
      this.todoInput.current.value = '';
    }
  } /* End of addTodo */

  deleteTodo = (index) => {
    this.setState((prevState, props) => {
      let todos = prevState.todos;
      
      todos.splice(index, 1);

      return {todos}
    });
  } /* End of deleteTodo*/

  checkTodo = (todo, index, event)  => {
    this.setState((prevState, props) => {
      let todos = prevState.todos;
      todo.completed = !todo.completed;

      todos.splice(index, 1, todo);

      return { todos };
    });
  }

  editTodo = (todo, index, event) => {
    this.setState((prevState, props) => {
      let todos = prevState.todos;
      todo.editing = true;

      todos.splice(index, 1, todo);

      return { todos, beforeEditCache: todo.title };
    });
  }

  doneEdit = (todo, index, event) => {
    event.persist();

    this.setState((prevState, props) => {
      let todos = prevState.todos;
      todo.editing = false;

      if (event.target.value.trim().length === 0)
        todo.title = prevState.beforeEditCache;
      else
        todo.title = event.target.value;

      todos.splice(index, 1, todo);

      return { todos };
    });
  }

  cancelEdit = (todo,index,event) => {
    this.setState((prevState, props) => {
      let todos = prevState.todos;
      todo.editing = false;
      todo.title = prevState.beforeEditCache;

      todos.splice(index, 1, todo);
      return { todos };
    });
  }

  remaining = () => {
    return this.state.todos.filter(todo => !todo.completed).length;
  }

  anyRemaining = () => {
    return this.remaining() !== 0;
  }

  todosCompletedCount = () => {
    return this.state.todos.filter(todo => todo.completed).length;
  }

  clearCompleted = () => {
    this.setState((prevState, props) => {
      return {
        todos: prevState.todos.filter(todo => !todo.completed)
      };
    });
  }

  updateFilter = filter => {
    this.setState({ filter });
  }

  todosFiltered = () => {
    if (this.state.filter === 'all')
      return this.state.todos;
    if (this.state.filter === 'active')
      return this.state.todos.filter(todo => !todo.completed);
    if (this.state.filter === 'completed')
      return this.state.todos.filter(todo => todo.completed);

    return this.state.todos;
  }

  checkAllTodos = (event) => {
    event.persist();

    this.setState((prevState, props) => {
      let todos = prevState.todos;

      todos.forEach((todo) => todo.completed = event.target.checked);

      return { todos };
    });
  }

}

export default App;
