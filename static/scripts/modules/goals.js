export default function goals() {
    // Get the URL parameters.
    const parameters = new URLSearchParams(window.location.search)

    // Fill the hidden input fields with the URL parameter values.
    $$(".name").forEach(element => {
        element.value = parameters.get("name")
    })

    $$(".email").forEach(element => {
        element.value = parameters.get("email")
    })

    // Clear the localStorage.
    localStorage.clear()

    $("#add").addEventListener("click", () => {
        // Show the pop-up.
        $(".add_goal").classList.add("show_popup")
    })

    $(".close_popup").addEventListener("click", () => {
        // Hide the pop-up.
        $(".add_goal").classList.remove("show_popup")
    })

    

    $$(".checkmark").forEach((element, index) => {
        // Check if the streak is 21.
        if ($$(".repetition_change")[index].textContent == 21) {
            $$(".checkmark")[index].classList.add("checkmark_click_animation")
            $$(".checkmark_plus")[index].classList.add("hide_plus")
            $$(".checkmark_check_icon")[index].classList.add("checkmark_check_icon_animation")
        } else {
            $$(".checkmark")[index].classList.add("checkmark_click_animation")
        }

        element.addEventListener("click", () => {
            // Submit the hidden form.
            $$(".increase_streak")[index].submit()

            // Show the check animation.
            // $$(".checkmark")[index].classList.add("checkmark_animation")
            // $$(".checkmark_check")[index].classList.add("checkmark_check_animation")


            // $("li").classList.add("confetti")
        })

        // Fill in the progress bar.
        $$("#progress div")[index].style.width = $$(".repetition_change")[index].textContent * 100 / 21 + "%"

        // if complete {
        // $("confetti_container").classList.remove("hide_state")
        // }
    })

    // You won't fucking believe it it sometimes doesn't show the dots content for the right index. 
    $$(".three_dots").forEach((element, index) => {
        element.addEventListener("click", () => {
            $$(".dots_content")[index].classList.add("show_state")
            // $("main").classList.add("click_away_screen")
        })
    })

    // $(".goals_page").addEventListener("click", () => {
    //     // $$(".three_dots").forEach((index) => {
    //     $$(".dots_content").classList.remove("show_state")
    //     // $$(".dots_content")[index].classList.remove("show_state")
    //     // })

    // })
}