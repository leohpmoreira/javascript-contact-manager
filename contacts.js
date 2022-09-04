function updateCurrent(person) {
    document.getElementById('curName').innerText = person.name
    document.getElementById('curPhone').innerText = person.phone
    document.getElementById('curEmail').innerText = person.email
    document.getElementById('curAddress').innerText = person.address
}

function loadContacts() {
    contactsArray = JSON.parse(localStorage.getItem('contacts'))
    if (contactsArray === null) {
        contactsArray = []
        return
    }
    reloadContactBtn()
    updateCurrent(contactsArray[0])
}

function reloadContactBtn() {
    let oldButtons = document.getElementsByClassName('nameButtons')
    while (oldButtons.length > 0) {
        oldButtons[0].parentNode.removeChild(oldButtons[0])
    }
    for (let i = 0; i < contactsArray.length; i++) {
        let btn = document.createElement("input")
        btn.className = "nameButtons"
        btn.type = "button"
        btn.value = contactsArray[i].name
        document.getElementById("names").append(btn)
        btn.addEventListener('click', () => {
            loadPerson(contactsArray[i].id)
        })
    }
}

function loadPerson(id) {
    let person = contactsArray.find(person => person.id === id)
    updateCurrent(person)
    hideAddScreen()
    hideEditScreen()
}

function showAddScreen() {
    document.getElementById('acceptContactBtn').style.display = 'block'
    document.getElementById('newInfo').style.display = 'block'
    document.getElementById('infoText').style.display = 'none'
}

function hideAddScreen() {
    document.getElementById('acceptContactBtn').style.display = 'none'
    document.getElementById('newInfo').style.display = 'none'
    document.getElementById('infoText').style.display = 'block'
    newName.value = newEmail.value = newPhone.value = newAddress.value = ''
}

function newContact() {
    if (newName.value === '') return
    let lastID
    if (contactsArray === null) {
        lastID = -1
    }
    else {
        lastID = Math.max.apply(Math,contactsArray.map(function(o){return o.id;}))
    }
    person = {
        id: lastID + 1,
        name: newName.value,
        email: newEmail.value,
        phone: newPhone.value,
        address: newAddress.value
    };
    contactsArray.push(person)
    contactsArray.sort((a, b) => a.name.localeCompare(b.name))
    localStorage.setItem('contacts', JSON.stringify(contactsArray))
    reloadContactBtn()
    hideAddScreen()
}

function showEditScreen() {
    document.getElementById('deleteButton').style.display = 'block'
    document.getElementById('acceptEditButton').style.display = 'block'
    document.getElementById('newInfo').style.display = 'block'
    document.getElementById('infoText').style.display = 'none'
    let person = contactsArray.find((person) => person.name === document.getElementById('curName').innerText)
    newName.value = person.name
    newEmail.value = person.email
    newPhone.value = person.phone
    newAddress.value = person.address
}

function hideEditScreen() {
    document.getElementById('deleteButton').style.display = 'none'
    document.getElementById('acceptEditButton').style.display = 'none'
    document.getElementById('newInfo').style.display = 'none'
    document.getElementById('infoText').style.display = 'block'
    newName.value = newEmail.value = newPhone.value = newAddress.value = ''
}

function findPersonIndex() {
    let oldName = document.getElementById('curName').innerText
    let oldPhone = document.getElementById('curPhone').innerText
    let oldAddress = document.getElementById('curAddress').innerText
    let oldEmail = document.getElementById('curEmail').innerText
    return contactsArray.findIndex(person => person.name === oldName && person.phone === oldPhone &&
        person.address === oldAddress && person.email === oldEmail)
}

function updatePerson() {
    if (newName.value === '') return
    let index = findPersonIndex()
    contactsArray[index].name = newName.value
    contactsArray[index].email = newEmail.value
    contactsArray[index].phone = newPhone.value
    contactsArray[index].address = newAddress.value
    contactsArray.sort((a, b) => a.name.localeCompare(b.name))
    localStorage.setItem('contacts', JSON.stringify(contactsArray))
    reloadContactBtn()
    updateCurrent(contactsArray[index])
    hideEditScreen()
}

function deletePerson() {
    if (!confirm('Are you sure you want to delete the selected person?')) return
    let index = findPersonIndex()
    contactsArray.splice(index, 1)
    reloadContactBtn()
    hideEditScreen()
    console.log(contactsArray)
    if (contactsArray.length === 0) {
        localStorage.removeItem('contacts')
        return
    }
    localStorage.setItem('contacts', JSON.stringify(contactsArray))
    updateCurrent(contactsArray[0])
}

let person = {
    id: undefined,
    name: undefined,
    email: undefined,
    phone: undefined,
    address: undefined
};
let contactsArray = []
let editBtn = document.getElementById('editBtn')
let addBtn = document.getElementById('newContact')
let acceptContactBtn = document.getElementById('acceptContactBtn')
let acceptEditBtn = document.getElementById('acceptEditButton')
let deleteBtn = document.getElementById('deleteButton')
let newName = document.getElementById('newName')
let newPhone = document.getElementById('newPhone')
let newAddress = document.getElementById('newAddress')
let newEmail = document.getElementById('newEmail')
let search = document.getElementById('searchBox')

loadContacts()

addBtn.addEventListener('click', () => {
    if (contactsArray === null || contactsArray === [] || contactsArray.length === 0) {
        console.log('add')
        return
    }
    showAddScreen()
})

acceptContactBtn.addEventListener('click', () => {
    newContact()
})

editBtn.addEventListener('click', () => {
    if (contactsArray === null || contactsArray === [] || contactsArray.length === 0) {
        console.log('edit')
        return
    }
    showEditScreen()
})

acceptEditBtn.addEventListener('click', () => {
    updatePerson()
})

deleteBtn.addEventListener('click', () => {
    deletePerson()
})

search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && search.value !== '') {
        let person = contactsArray.find(person => person.name === search.value)
        search.value = ''
        if (person === undefined) {
            alert('Person not found')
            return
        }
        loadPerson(person.id)
    }
})