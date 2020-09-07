let globalUsers = [];
let globalCountries = [];
let globalUsersAndCountries = [];

async function start(){
    console.log('DOM carregado');

    // await fetchUsers();
    // await fetchCountries();
    // await promiseUsers();
    // await promiseCountries();

    console.time('promiseAll');
    const p1 = promiseUsers();
    const p2 = promiseCountries();
    await Promise.all([p1,p2]);
    console.timeEnd('promiseAll');

    hideSpinner();
    mergeUsersAndCountries();
    render();
}

function promiseUsers(){
    return new Promise(async (resolve,reject)=>{
        const users = await fetchUsers();
        setTimeout(()=>{
            resolve(users);
        },5000) 
    });
}

function promiseCountries(){
    return new Promise(async (resolve,reject)=>{
        const countries = await fetchCountries();
        setTimeout(()=>{
            resolve(countries);
        },6000)
    });
}

async function fetchUsers(){
    const res = await fetch('https://randomuser.me/api/?results=100&seed=promise&nat=us,fr,au,br');
    const json = await res.json();
    globalUsers = json.results.map(({name,picture,nat})=>{
        return{
            userName:name.first,
            userPicture:picture.large,
            userCountry:nat
        };
    });
}

async function fetchCountries(){
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    const json = await res.json();
    globalCountries = json.map(({name,alpha2Code,flag})=>{
        return{
            countryName:name,
            countryCode:alpha2Code,
            countryFlag:flag
        };
    });
//     console.log(globalCountries);
}

function hideSpinner(){
    const spinner = document.querySelector('#spinner');
    spinner.classList.add('hide');
}

function mergeUsersAndCountries(){
    globalUsersAndCountries = [];
    console.log(globalUsers);
    globalUsers.forEach(user=>{
        const userCountry = globalCountries.find(country=>{
            return country.countryCode === user.userCountry;
        });
    // console.log(userCountry);
    globalUsersAndCountries.push({...user,...userCountry});
    });
    console.log(globalUsersAndCountries);
}

function render(){
    const divUsers = document.querySelector('#divUsers');

    divUsers.innerHTML = `
        <div class='row'>
            ${globalUsersAndCountries.map(({userPicture,userName,countryFlag})=>{
                return `
                  <div class='col s6 m4 l3'>
                      <div class='flex-row bordered'>
                        <img class='avatar' src='${userPicture}' />
                        <div class='flex-column'>
                            <span>${userName}</span>
                            <img class='flag' src='${countryFlag}' />
                        </div>
                    </div>
                </div>
            `;
          }
        ).join('')}
        </div>
    `;
}

start();