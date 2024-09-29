let container = document.querySelector(".main");
let searchForm = document.querySelector(".form");
let searchInput = document.querySelector(".form__input");
let searchFormList = document.querySelector(".form__list");
let main__form = document.querySelector(".main__form");
let fragment = document.createDocumentFragment();

async function getRequest(searchText) {
  try {
    if (!searchText.trim()) {
      return (searchFormList.innerHTML = "");
    }

    const response = await fetch(
      `https://api.github.com/search/repositories?q=${searchText}`,
    );
    const result = await response.json();
    searchFormList.innerHTML = "";

    firstFiveItems = result.items.slice(0, 5);
    firstFiveItems.forEach((el) => {
      const item = document.createElement("li");
      item.classList.add("form__list-item");
      item.setAttribute("data-name", `${el.name}`);
      item.setAttribute("data-owner", `${el.owner.login}`);
      item.setAttribute("data-stars", `${el.stargazers_count}`);
      item.textContent = el.name;
      fragment.appendChild(item);
      searchFormList.appendChild(fragment);
    });
  } catch (error) {
    console.error("Error in getRequest:", error);
  }
}
const debounce = (fn, debounceTime) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
};

function logSearchValue() {
  return searchInput.value;
}

searchInput.addEventListener(
  "keyup",
  debounce(function () {
    const searchText = logSearchValue();
    getRequest(searchText);
  }, 200),
);

searchFormList.addEventListener("click", function (event) {
  let closestMenuItem = event.target.closest(".form__list-item");

  if (closestMenuItem) {
    searchInput.value = "";
    searchFormList.innerHTML = "";

    let name = closestMenuItem.getAttribute("data-name");
    let owner = closestMenuItem.getAttribute("data-owner");
    let star = closestMenuItem.getAttribute("data-stars");

    let htmlString = `
      <p>Name: ${name}</p>
      <p>Owner: ${owner}</p>
      <p>Stars: ${star}</p>
    `;

    let resultItem = document.createElement("div");
    resultItem.classList.add("main__list-item");
    resultItem.insertAdjacentHTML("beforeend", htmlString);
    main__form.appendChild(resultItem);

    let btn = document.createElement("button");

    let img = document.createElement("img");
    img.src = "img/close.png";
    img.alt = "close";

    resultItem.appendChild(btn);
    btn.appendChild(img);
    btn.addEventListener("click", resultItemRemoveButtonClick);
  }
});

function resultItemRemoveButtonClick(event) {
  let currentResultDiv = event.target.closest(".main__list-item");
  if (currentResultDiv) {
    currentResultDiv.remove();
  }
}