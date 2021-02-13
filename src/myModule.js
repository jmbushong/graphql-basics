//Named export- Has a name. Have as many as needed
//Default export- has no name. You can only have one

const message= 'Some message from myModule.js'
const name= 'Jessica'
const location= 'Indianapolis'

const getGreeting= (name) => {
    return `Welcome to the course ${name}`
}

export { message, name, getGreeting, location as default }