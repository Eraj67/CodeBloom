const input = document.getElementById("todoInput");

if (input) {

    const list = document.getElementById("todoList");
    const addBtn = document.getElementById("addBtn");
    const status = document.getElementById("status");

    function pressButton() {

        addBtn.classList.add("press");

        setTimeout(() => {

            addBtn.classList.remove("press");

        }, 200);

    }

    function resetDemo() {

        input.value = "";
        list.innerHTML = "";
        status.style.opacity = "0";

    }

    function playDemo() {

        resetDemo();

        // Type first task
        setTimeout(() => {

            input.value = "Buy Milk";

        }, 500);

        // Add first task
        setTimeout(() => {

            pressButton();

            const li = document.createElement("li");

            li.textContent = "□ Buy Milk";

            li.classList.add("show");

            list.appendChild(li);

        }, 1200);

        // Type second task
        setTimeout(() => {

            input.value = "Learn JavaScript";

        }, 2200);

        // Add second task
        setTimeout(() => {

            pressButton();

            const li = document.createElement("li");

            li.textContent = "□ Learn JavaScript";

            li.classList.add("show");

            list.appendChild(li);

        }, 2900);

        // Complete first task
        setTimeout(() => {

            if (list.children.length > 0) {

                list.children[0].textContent = "✔ Buy Milk";
                list.children[0].classList.add("completed");

            }

        }, 4000);

        // Remove completed task
        setTimeout(() => {

            if (list.children.length > 0) {

                list.children[0].classList.add("remove");

            }

        }, 5200);

        // Delete completed task
        setTimeout(() => {

            if (list.children.length > 0) {

                list.children[0].remove();

            }

        }, 5800);

        // Show status
        setTimeout(() => {

            status.style.opacity = "1";

        }, 6200);

    }

    playDemo();

    setInterval(playDemo, 8000);

}