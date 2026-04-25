function fetchUser(callback) {
    setTimeout(() => {
        const error = null;

        if (error) {
            return callback(error, null);
        }

        const data = { id: 1, name: "anya" };

        console.log("fetchUser todo");
        callback(null, data);
        console.log("fetchUser ok");
    }, 1000);
}

function fetchAct(userId, callback) {
    setTimeout(() => {
        const error = null;

        if (error) {
            return callback(error, null);
        }

        const data2 = [{ id: userId, speak: "waku" }];

        console.log("fetchAct todo");
        callback(null, data2);
        console.log("fetchAct ok");
    }, 2000);
}

function runCallbackDemo() {
    console.log("=== callback demo ===");

    fetchUser((err, data) => {
        if (err) {
            return console.error("User error:", err);
        }

        console.log("data:", data);

        fetchAct(data.id, (err2, data2) => {
            if (err2) {
                return console.error("fetchAct error:", err2);
            }

            console.log("data2:", data2);
        });
    });
}

module.exports = {
    fetchUser,
    fetchAct,
    runCallbackDemo,
};

if (require.main === module) {
    runCallbackDemo();
}
