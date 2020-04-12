const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
let birthdayList = [
    {
        name: "Tyrion Lannister",
        birthday: "12/02/1978"
    },
    {
        name: "Cersie Lannister",
        birthday: "11/30/1975"
    },
    {
        name: "Daenerys Targaryen",
        birthday: "11/24/1991"
    },{
        name: "Arya Stark",
        birthday: "11/25/1996"
    }
    ,{
        name: "Jon Snow",
        birthday: "12/03/1989"
    }
    ,{
        name: "Sansa Stark",
        birthday: "01/21/1992"
    }
    ,{
        name: "Tony Stark",
        birthday: "10/07/1976"
    },
    {
        name: "Emmy Stark",
        birthday: "08/12/1981"
    },
    {
        name: "Thor Ragnarok",
        birthday: "07/09/1978"
    },
    {
        name: "Emmy Watson",
        birthday: "05/21/1984"
    }
];

let birthdayMap = new Map();

let cardContainer = document.querySelector(".card-container");
let textArea = document.querySelector("#textarea_input");
let inputYear = document.querySelector("#year");

function init() {
    generateCards();
    generateTextAreaValue();
};

function generateCards() {
    DAYS.forEach(day => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("cal__day", "card");

        let titleDiv = document.createElement("div");
        titleDiv.classList.add("card-title");
        titleDiv.innerHTML = day;

        let bodyDiv = document.createElement("div");
        bodyDiv.classList.add("card-body", `card-${day}`);

        newDiv.innerHTML += titleDiv.outerHTML + bodyDiv.outerHTML;
        cardContainer.innerHTML += newDiv.outerHTML;
    });
};

function generateTextAreaValue() {
    const parent = document.createElement("pre");
    const tab = document.createElement("pre");
    tab.innerHTML = "\t"
    parent.innerHTML = "[\n" + tab.innerText;

    birthdayList.forEach((personObj, index) => {
        let li = document.createElement("li");
        let code = document.createElement("code");
        code.innerHTML = "{\n" + tab.innerText + "&nbsp &nbsp" + `name: "${personObj.name}",` + "\n" + tab.innerText
            + "&nbsp &nbsp" + `birthday: "${personObj.birthday}"` + "\n" + tab.innerText + "},&nbsp"
        li.innerHTML = code.outerHTML;
        parent.innerHTML += li.outerHTML
    });

    parent.innerHTML += "\n]"
    textArea.value = parent.innerText;
};

function textAreaInputChange() {
    let textAreaVal = textArea.value.replace(/\t/g, "").replace(/\n/g, "").replace(/\s/g, "").replace(/name/g, `"name"`)
    .replace(/birthday/g, `"birthday"`).replace(/,]$/, "]");

    birthdayList = JSON.parse(textAreaVal);
};

function calculateAge(dateString) {
    var birthday = new Date(dateString);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getFullYear() - 1970);
};

function getBirthday(dateString, year) {
    const ALLDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString).getDate();
    let month = new Date(dateString).getMonth();
    let birthday = ALLDAYS[new Date(+year, month, date).getDay()];
    return birthday.substring(0, 3).toUpperCase();
};

function update() {
    let year = inputYear.value;
    let birthdayPersonList = birthdayList.map(personObj => {
        let personInitials = personObj.name.split(' ').map(x => x[0]).join('').toUpperCase();
        let age = calculateAge(personObj.birthday);
        let birthday = getBirthday(personObj.birthday, year);

        return {person: personInitials, age, day: birthday};
    }).sort((a, b) => a.age - b.age);

    DAYS.forEach(day => {
        let birthdayListOnThisDay = birthdayPersonList.filter(personObj => personObj.day === day)
        birthdayMap.set(day, birthdayListOnThisDay);
    });
    console.log(birthdayMap);
    generateCalendar();
};

function generateCalendar() {
    for (let [key, list] of birthdayMap) {
        let cardBody = document.querySelector(`[class$='${key}']`);
        // const cardWidth = cardBody.clientWidth;
        // const cardHeight = cardBody.clientHeight;
        // const cardArea = cardWidth * cardHeight;


        if (list && list.length) {
            list.forEach(info => {
                let box = document.createElement("div");
                // const boxArea = cardArea / list.length;
                box.setAttribute("style", `background-color: #${Math.floor(Math.random()*16777215).toString(16)};`);
                box.classList.add("day__person")
                box.innerHTML = info.person;
                cardBody.innerHTML += box.outerHTML;
            });
        } else {
            cardBody.classList.add("day--empty");
        }
    }
}

init();