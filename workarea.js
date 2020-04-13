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

// generate card for each day in a week
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


// create and generate text area value in json form
function generateTextAreaValue() {
    const parent = document.createElement("pre");
    const tab = document.createElement("pre");
    tab.innerHTML = "&#9;"
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

// on textarea input change handler
function textAreaInputChange() {
    let textAreaVal = [];
    textAreaVal = textArea.value.replace(/\t/g, "").replace(/\n/g, "").replace(/\s\s+/g, "").replace(/,\s/g, ",").replace(/name/g, `"name"`)
    .replace(/birthday/g, `"birthday"`).replace(/,]$/, "]");

    birthdayList = JSON.parse(textAreaVal);
};

// calculate age of a person on input year
function calculateAge(dateString) {
    var birthday = new Date(dateString);
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getFullYear() - 1970);
};


// get birth day on input year
function getBirthday(dateString, year) {
    const ALLDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString).getDate();
    let month = new Date(dateString).getMonth();
    let birthday = ALLDAYS[new Date(+year, month, date).getDay()];
    return birthday.substring(0, 3).toUpperCase();
};


// on update button click, update the calendar with new data
function update() {
    let year = inputYear.value;
    let birthdayPersonList = [];
    birthdayPersonList = birthdayList.map(personObj => {
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

    removeAndCreateCard();
    generateCalendar();
};

// To remove the card present from earlier render and recreate it
function removeAndCreateCard() {
    while (cardContainer.firstChild) cardContainer.removeChild(cardContainer.firstChild);

    generateCards();
};

// generate calendar having each person as item
function generateCalendar() {
    for (let [key, list] of birthdayMap) {
        let cardBody = document.querySelector(`[class$='${key}']`);
        const cardWidth = cardBody.clientWidth;
        const cardHeight = cardBody.clientHeight;
        const cardArea = cardWidth * cardHeight;


        if (list && list.length) {
            let squareNum = getPerfectSquare(list.length);
            list.forEach(info => {
                let box = document.createElement("div");
                const boxArea = cardArea / squareNum;
                box.setAttribute("style", `background-color: #${Math.floor(Math.random()*16777215).toString(16)};width:${Math.sqrt(boxArea)}px;height:${Math.sqrt(boxArea)}px;`);
                box.classList.add("day__person")
                box.innerHTML = info.person;
                cardBody.innerHTML += box.outerHTML;
            });
        } else {
            let img = document.createElement("img");
            img.setAttribute("src", "nothing.png");
            cardBody.classList.add("day--empty");
            cardBody.appendChild(img);
        }
    }
};

// check whether number is perfect square and return that number, if not return next perfect square
function getPerfectSquare(n) {
    let sr = Math.sqrt(n)
    if((sr - Math.floor(sr)) == 0) {
        return n;
    } else {
        let nextN = Math.floor(sr) + 1;
        return nextN * nextN;
    }
};

init(); // initialize the first render