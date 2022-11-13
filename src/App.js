import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
}

const App = () => {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      // Alert display
      showAlert(true, 'Пожалуйста, введите значение', 'danger');
    } else if (name && isEditing) {
      // Edit
      const newList = list.map((item) => {
        if (item.id === editID) {
          return { ...item, title: name };
        } 
        return item;
      });

      setList(newList);
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'Значение изменено', 'success');
    } else {
      const newItem = { id: new Date().getTime().toString(), title: name };
      
      setList([...list, newItem]);
      showAlert(true, 'Элемент добавлен в список', 'success');
      setName('');
    }
  }

  const showAlert = (show = false, message = "", type = "") => {
    setAlert({ show, message, type });
  }

  const clearList = () => {
    setList([]);
    showAlert(true, 'Пустой список', 'danger');
  }

  const removeItem = (id) => {
    const newList = list.filter((item) => item.id !== id);

    setList(newList);
    showAlert(true, 'Элемент удален', 'danger');
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);

    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        
        <h3>Список продукты</h3>

        <div className='form-control'>
          <input 
            type='text' 
            className='grocery'
            placeholder='Место для заметки'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'Изменить' : 'Добавить'}
          </button>
        </div>
      </form>

      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={clearList}>Очистить</button>
        </div>
      )}
    </section>
  );
}

export default App;