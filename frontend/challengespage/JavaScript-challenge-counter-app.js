const counter = document.getElementById("counter");

if (counter) {

    const plus = document.getElementById("plus");
    const minus = document.getElementById("minus");
    const reset = document.getElementById("reset");

    let value = 0;

    function updateCounter() {

        counter.textContent = value;

        counter.classList.add("pop");

        setTimeout(() => {
            counter.classList.remove("pop");
        }, 200);

    }

    function press(button) {

        button.classList.add("press");

        setTimeout(() => {
            button.classList.remove("press");
        }, 200);

    }

    function playAnimation() {

        value = 0;
        updateCounter();

        setTimeout(() => {
            press(plus);
            value++;
            updateCounter();
        }, 1000);

        setTimeout(() => {
            press(plus);
            value++;
            updateCounter();
        }, 2000);

        setTimeout(() => {
            press(minus);
            value--;
            updateCounter();
        }, 3000);

        setTimeout(() => {
            press(reset);
            value = 0;
            updateCounter();
        }, 4000);

    }

    playAnimation();

    setInterval(playAnimation, 6000);

}