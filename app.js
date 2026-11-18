// app.js : 영화 배열을 다루는 함수 6개 / 박희성 / 11주차
// average : 영화 배열 ⇒ 평균 평점(숫자)

const average = (list) => {
    let sum = 0;
    for (const m of list) {
        sum = sum + m.rating;
    }
    return sum / list.length;
}
console.log("평균:", average(movies));

const best = list => {
    let top = list[0];
    for (const m of list) {
        if (m.rating > top.rating) {
            top = m;
        }
    }
    return top;
}
console.log("최고:", best(movies).title);

const filterByRating = (list, min) => {
    return list.filter(m => m.rating >= min);
}
console.log("8점 이상:", filterByRating(movies, 8).length + "편");

const sortByRating = list => {
    return [...list].sort((a, b) => b.rating - a.rating);
}
const sorted = sortByRating(movies);
console.log("정렬 1위:", sorted[0].title, "/ 원본 1번:", movies[0].title);

const yearsSince = dateStr => {
    return new Date().getFullYear() - new Date(dateStr).getFullYear();
}
console.log(yearsSince(movies[0].date) + "년 전 개봉");

const posterUrl = (path, size) => {
    return "https://image.tmdb.org/t/p/" + size + path;
}
console.log(posterUrl(movies[0].poster, "w342"));




// renderCards : 영화 배열 ⇒ 보드에 카드 생성(반환값 없음)
const renderCards = list => {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        if (m.rating >= 8) {
            card.classList.add("hot");
        }
        card.innerHTML = `
 <img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">
 <span class="badge">${m.rating}</span>
 <div class="info">
     <h2>${m.title}</h2>
    <p class="year">${m.year}</p>
    <button class="like" type="button">♥</button>
 </div>`;
        board.appendChild(card);

        document.querySelector("#count").textContent = list.length + "편";
    }
    updateLikeCount();
    if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }
}


// sortBy : 영화 배열, 키 이름, 내림차순 여부 ⇒ 정렬한 새 배열(원본은 그대로)
const sortBy = (list, key, desc) => {
    const copy = [...list];
    copy.sort((a, b) => {
        if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
        return a[key] - b[key];
    });
    if (desc) copy.reverse();
    return copy;
}
// applySort : 선택 상자 값으로 정렬해서 다시 그리기(반환값 없음)
function applySort() {
    renderCards(getView());
}
applySort();
// 검색창 : 글자를 칠 때마다 제목으로 걸러서 다시 그리기(12.6절)
document.getElementById("q").addEventListener("input", (e) => {
    renderCards(getView());
});
document.getElementById("sort").addEventListener("change", applySort);
// getView : 없음 ⇒ 검색어로 거른 뒤 선택 상자 기준으로 정렬한 새 배열
function getView() {
    const keyword = document.getElementById("q").value.trim().toLowerCase();
    const found = movies.filter(m => m.title.toLowerCase().includes(keyword));
    const key = document.getElementById("sort").value;
    return sortBy(found, key, key !== "title");
}
// function (e) 로 쓰면 this는 리스너를 단 보드(.board)이고, e.target은 실제로 누른 ♥ 버튼이다.
// 화살표 함수로 쓰면 this는 바깥의 this(window)가 되고, e.target은 똑같이 누른 ♥ 버튼이다.
document.querySelector(".board").addEventListener("click", (e) => {
    if (e.target.classList.contains("like")) {
        e.target.classList.toggle("liked");
        updateLikeCount();
    }
});
function updateLikeCount() {
    document.getElementById("likeCount").textContent = document.querySelectorAll(".liked").length;
}
document.getElementById("q").addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        e.target.value = "";
        renderCards(getView());
    }
});