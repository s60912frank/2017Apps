const mode = (process.argv[2]) ? process.argv[2] : 'remote'
module.exports = {
    target: (mode == 'remote') ? 'http://104.199.219.156:8080' : require('../app'),
    studentID: 'apps16',
    getTestUsers: () => {
        return [
        { username: "alice", password: "a1234" },
        { username: "bob", password: "b1234" },
        { username: "chris", password: "c1234" }
    ]}
}