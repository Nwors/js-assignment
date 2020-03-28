
class User {
    constructor(name, password) {
        this.name = name
        this.password = password
        this.groups = []
    }
}
let listOfUsers = []
let listOfGroups = []
let listOfRights = []
let groupsRights = {}

// Возвращает массив всех пользователей.
function users() {
    return listOfUsers
}

//Создает нового пользователя с указанным логином username и паролем password, возвращает созданного пользователя.
function createUser(name, password) {
    let user = new User(name,password)
    listOfUsers.push(user)
    return user
}

// Удаляет пользователя user
function deleteUser(user) {
    if(!listOfUsers.includes(user)) throw new Error("Wrong input type")
    listOfUsers.splice(listOfUsers.indexOf(user),1)
}

// Возвращает массив групп, к которым принадлежит пользователь user
function userGroups(user) {
    return user.groups
}

// Добавляет пользователя user в группу group
function addUserToGroup(user, group) {
    if(!listOfUsers.includes(user) || !listOfGroups.includes(group)) throw new Error("Wrong input type")
    listOfUsers[listOfUsers.indexOf(user)].groups.push(group)
}

// Удаляет пользователя user из группы group. Должна бросить исключение, если пользователя user нет в группе group
function removeUserFromGroup(user, group) {
    if(!listOfUsers[listOfUsers.indexOf(user)].groups.includes(group)) throw new Error ("User already deleted from this group")
    listOfUsers[listOfUsers.indexOf(user)].groups.splice(listOfUsers[listOfUsers.indexOf(user)].groups.indexOf(group),1)

}

// Возвращает массив прав
function rights() {
    return listOfRights
}

// Создает новое право с именем name и возвращает его
function createRight(name) {
    listOfRights.push(name)
    return name
}

// Удаляет право right
function deleteRight(right) {
    if(!listOfRights.includes(right)) throw Error("This right does not exist")
    listOfRights.splice(listOfRights.indexOf(right),1)
    for (let key in groupsRights) {
        if(groupsRights[key].includes(right)) {
            groupsRights[key].splice(groupsRights[key].indexOf(right),1)
        }
    }
}

// Возвращает массив групп
function groups() {
    return listOfGroups
}

// Создает новую группу и возвращает её.
function createGroup(name) {
    listOfGroups.push(name)
    groupsRights[name] = []
    return name
}

// Удаляет группу group
function deleteGroup(group) {
    if (!listOfGroups.includes(group)) throw new Error("Group has been not created or was deleted")
    listOfGroups.splice(listOfGroups.indexOf(group),1)
    delete groupsRights[group]
    listOfUsers.forEach(user => {if(user.groups.includes(group)) user.groups.splice(user.groups.indexOf(group),1)})
}

// Возвращает массив прав, которые принадлежат группе group
function groupRights(group) {
    return groupsRights[group]
}

// Добавляет право right к группе group
function addRightToGroup(right, group) {
    if(!listOfRights.includes(right) || !listOfGroups.includes(group)) throw new Error("Wrong input type")  
    groupsRights[group].push(right)
}

// Удаляет право right из группы group. Должна бросить исключение, если права right нет в группе group
function removeRightFromGroup(right, group) {
    //if(!listOfRights.includes(right) || !listOfGroups.includes(group)) throw new Error("Wrong input type")
    if(!groupsRights[group].includes(right)) throw new Error("Group does not have this right")
    groupsRights[group].splice(groupsRights[group].indexOf(right),1)
}

let session = {}

function login(username, password) {
    let tempList = listOfUsers.filter(user => user.name == username && user.password == password)
    if(!session[username] && tempList.length) {
        session[username] = true;
        return true
    } else {return false}
}

function currentUser() {
    for(let key in session) {
        if (session[key]) return listOfUsers.filter(user => user.name == key)[0]
    }
}

function logout() {
    for(let key in session) {
        if(session[key]) session[key] = false
    }
}

function isAuthorized(user, right) {
    if(!listOfUsers.includes(user) || !listOfRights.includes(right)) throw new Error("User or right has been deleted")
    const getUserRights = (u) => listOfUsers.filter(item => item.name == u.name )[0].groups.map(group => groupsRights[group])
    let authorized = false
    getUserRights(user).forEach(array => {if(array.includes(right)) authorized = true})
    return authorized
}
