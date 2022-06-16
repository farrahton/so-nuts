// Import Node.js modules.
require("dotenv").config()
const express = require("express")
const handlebars = require("express-handlebars")
const { createClient } = require("@supabase/supabase-js")

// Import modules.
const get = require("./modules/get.js")
const reponses = require("./modules/reponses.js")
const post = require("./modules/post.js")

// Initialise Supabase with a service key, to have full access to the data.
const supabase = createClient("https://depctutsufqakltbwctd.supabase.co", process.env.SERVICE_KEY)

// Initialise Express.
const app = express()

// Render static files.
app.use(express.static("static"))

// Set the view engine to Handlebars and import the helpers.
app.engine("handlebars", handlebars.engine({
    helpers: require("./helpers")
}))
app.set("view engine", "handlebars")

// Parse incoming requests.
app.use(express.urlencoded({
    extended: true
}))

// Set and log the port for Express.
app.listen(process.env.PORT, () => {
    console.log(`Express running at http://localhost:${process.env.PORT}.`)
})

// Listen to all GET requests on /onboarding.
app.get("/onboarding", (_req, res) => {
    // Load the onboarding page with the stylesheet.
    res.render("onboarding", {
    })
})

// Listen to all GET requests on /questionnaire.
app.get("/questionnaire", (_req, res) => {
    get.get("questionnaire", "Questionnaires/2")
        .then(questionnaire => {
            get.get("domains", "Domains")
                .then(domains => {
                    // Check if the files exist.
                    if (questionnaire != undefined && domains != undefined) {
                        // Load the questionnaire page with the domains, questionnaire, length and stylesheet.
                        res.render("questionnaire", {
                            domains: domains,
                            questionnaire: questionnaire.questions,
                            length: questionnaire.questions.length - 1
                        })
                    }
                })
        })
})

// Listen to all POST requests on /questionnaire.
app.post("/questionnaire", (req, res) => {
    // Transform the answers to a compatible format and send a POST request with them.
    post.post(reponses.reponses(req.body.answers))
        .then(data => {
            // Do not forget to remove this.
            console.log(data)

            // Redirect to the goals page.
            res.redirect("/goals")
        })
})

// Listen to all GET requests on /profile.
app.get("/profile", (_req, res) => {
    get.get("questionnaire", "Questionnaires/2")
        .then(questionnaire => {
            get.get("questionnaire_response", "QuestionnaireResponses/3")
                .then(questionnaire_response => {
                    // Check if the files exist.
                    if (questionnaire != undefined && questionnaire_response != undefined) {
                        // Load the profile page with the questionnaire, questionnaire response and stylesheet.
                        res.render("profile", {
                            questionnaire: questionnaire.questions,
                            questionnaire_response: questionnaire_response.questionResponses
                        })
                    }
                })
        })
})

// Listen to all GET requests on /goals.
app.get("/goals", (_req, res) => {
    // Get the goals from the database.
    read_goals()
        .then(data => {
            // Load the goals page with the stylesheet.
            res.render("goals", {
                goals: data
            })
        })
    // get.get("food_goals", "Goals?domainId=voeding")
    //     .then(food_goals => {
    //         // Check if the file exists.
    //         if (food_goals != undefined) {
    //             // Load the goals page with the stylesheet.
    //             res.render("goals", {
    //                 food_goals: food_goals,
    //                 style: "goals.css"
    //             })
    //         }
    //     })
})


// Listen to all GET requests on /.
app.get("/", (_req, res) => {
    // Load the login page with the stylesheet.
    res.render("login", {
    })
})

// Listen to all POST requests on /.
app.post("/", (req, res) => {
    // Check if the user already exists in the database.
    read_user(req.body)
        .then(data => {
            // If not, create a new user in the database.
            if (data.length == 0) {
                insert_user(req.body)
                    .then(
                        // Redirect to the onboarding page.
                        res.redirect("/onboarding")
                    )
            } else {
                // Check if the onboarding and questionnaire have already been completed. If not, redirect to the corresponding page.
                if (!data.onboarding) {
                    // Redirect to the onboarding page.
                    res.redirect("/onboarding")
                } else if (!data.questionnaire) {
                    // Redirect to the questionnaire page.
                    res.redirect("/questionnaire")
                } else {
                    // Redirect to the goals page.
                    res.redirect("/goals")
                }
            }
        })
})

async function read_goals() {
    const reponse = await supabase
        .from("goals")
        .select("*")

    return reponse.data
}

async function read_user(user) {
    const reponse = await supabase
        .from("users")
        .select("*")
        .eq("name", user.name)
        .eq("email", user.email)

    return reponse.data
}

async function insert_user(user) {
    await supabase
        .from("users")
        .insert([user])
}

async function update_user(user, value) {
    await supabase
        .from("users")
        .update(value)
        .eq("name", user.name)
        .eq("email", user.email)
}