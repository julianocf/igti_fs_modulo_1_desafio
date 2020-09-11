let allUsers = null;
let filteredUsers = null;
let divFilteredUsers = null;
let divStatistics = null;
let filterTermInput;
let filterTermSubmit;

window.addEventListener("load", () => {
    divFilteredUsers = document.querySelector("#filtered-users");
    divStatistics = document.querySelector("#statistics");

    filterTermInput = document.querySelector("#filterTermInput");
    filterTermSubmit = document.querySelector("#filterTermSubmit");

    fetchUsers();

    filterTermInput.addEventListener("keyup", handleKeyUp);
    filterTermSubmit.addEventListener("click", handleClick);

    document.querySelector("#filterTermInput").focus();
});

async function fetchUsers() {
    allUsers = getUsers();
    /* consultar json pelo site randomuser */
    /*
    const response = await fetch("https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo");
    const json = await response.json();
    allUsers = json.results.map( user => {        
        const { name, picture, dob, gender: gender } = user;

        return {
            name: name.first + ' ' + name.last,
            picture: picture.thumbnail,
            age: dob.age,
            gender,
        }
    });
    */
    allUsers.sort((a, b) => a.name.localeCompare(b.name));
}

function handleKeyUp({ key }) {
    if (key === "Enter") {
        filterUsers();
    }
}

function handleClick() {
    filterUsers();
}

function filterUsers() {
    filteredUsers = [];
    if (filterTermInput.value.length > 0) {
        filteredUsers = allUsers.filter(
            (user) =>
                user.name
                    .toLowerCase()
                    .indexOf(filterTermInput.value.toLowerCase()) !== -1
        );
    }
    render();
}

function render() {
    renderFilteredUserList();
    renderStatistics();
}

function renderFilteredUserList() {
    let filteredUsersHTML = "";

    if (filteredUsers.length > 0) {
        filteredUsersHTML = `<h2>${+filteredUsers.length} usuário(s) encontrado(s)</h2>`;
        filteredUsers.forEach((user) => {
            const { name, picture, age } = user;

            const userHTML = `
                <div class='filtered-user'>
                        <img class='filtered-user-image' src="${picture}" />
                    <div class='filtered-user-data'>
                        ${name}, ${age} anos
                    </div>
                </div>
            `;
            filteredUsersHTML += userHTML;
        });
    } else {
        filteredUsersHTML = "<p>Nenhum usuário filtrado</p>";
    }
    divFilteredUsers.innerHTML = filteredUsersHTML;
}

function renderStatistics() {
    let maleSum = 0;
    let femaleSum = 0;
    let agesSum = 0;
    let agesAverage = 0;

    if (filteredUsers.length > 0) {
        femaleSum = filteredUsers.reduce((accumulator, current) => {
            return accumulator + (current.gender === "female" ? 1 : 0);
        }, 0);

        maleSum = filteredUsers.reduce((accumulator, current) => {
            return accumulator + (current.gender === "male" ? 1 : 0);
        }, 0);

        agesSum = filteredUsers.reduce(
            (accumulator, current) => accumulator + current.age,
            0
        );

        agesAverage = (agesSum / (maleSum + femaleSum))
            .toFixed(2)
            .replace(".", ",");

        divStatistics.innerHTML = `
            <h2>Estatísticas</h2>
            <div>Sexo masculino: <b>${maleSum}</b></div>
            <div>Sexo feminino: <b>${femaleSum}</b></div>
            <div>Soma das idades: <b>${agesSum}</b></div>
            <div>Média das idades: <b>${agesAverage}</b></div>
        `;
    } else {
        divStatistics.innerHTML = "<p>Nada a ser exibido</p>";
    }
}
