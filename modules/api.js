// Import node-fetch.
const fetch = require("node-fetch")
// Import database module.
const database = require("./database.js")

module.exports = {
    get: async (url) => {
        try {
            // Get the data from the Chippr API.
            const response = await fetch(`https://fhir.mibplatform.nl/api/${url}`)
            const data = await response.json()

            return data
        } catch {
            // Get the data from the local JSON files.
            if (url == "Questionnaires/2") {
                return require("../static/json/Questionnaires.json")
            } else if (url.includes("QuestionnaireResponses/")) {
                return require("../static/json/QuestionnaireResponses.json")
            } else if (url == "Domains") {
                return require("../static/json/Domains.json")
            }
        }
    },
    post: async (responses) => {
        try {
            // Post the questionnaire to the Chippr API.
            const response = await fetch("https://fhir.mibplatform.nl/api/QuestionnaireResponses", {
                method: "POST",
                body: JSON.stringify({
                    "id": "string",
                    "questionnaireId": "2",
                    "participantId": "1",
                    "questionResponses": responses
                }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            })
            const data = await response.json()

            return data.id
        } catch {
            // Get the highest ID plus one.
            const id = await database.read_next_id()
            
            return id
        }
    },
    quote: async () => {
        // Get the daily quote from the ZenQuotes API.
        const response = await fetch("https://zenquotes.io/api/today/")
        const data = await response.json()

        return data[0]
    }
}