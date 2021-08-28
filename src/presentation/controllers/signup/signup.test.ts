import * as signup from "./signup"

// @ponicode
describe("handle", () => {
    let inst: any

    beforeEach(() => {
        inst = new signup.SignUpController({ add: () => ({ id: "03ea49f8-1d96-4cd0-b279-0684e3eec3a9", name: "Michael", email: "TestUpperCase@Example.com", password: "accessdenied4u" }) }, { validate: () => ({ name: "Jean-Philippe", message: "Unable to allocate address", stack: "transmit bluetooth bus" }) })
    })

    test("0", async () => {
        await inst.handle({ body: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E" })
    })

    test("1", async () => {
        await inst.handle({ body: 56784 })
    })

    test("2", async () => {
        await inst.handle({ body: 987650 })
    })

    test("3", async () => {
        await inst.handle({ body: false })
    })

    test("4", async () => {
        await inst.handle({ body: true })
    })

    test("5", async () => {
        await inst.handle({ body: -Infinity })
    })
})
