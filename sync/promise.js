function fetchUser() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const error = null;

            if (error) {
                return reject(error);
            }

            const data = { id: 1, name: "anya" };

            console.log("fetchUser todo");
            resolve(data);
            console.log("fetchUser ok");
        }, 1000);
    });
}

function fetchAct(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const error = null;

            if (error) {
                return reject(error);
            }

            const data2 = [{ id: userId, speak: "waku" }];

            console.log("fetchAct todo");
            resolve(data2);
            console.log("fetchAct ok");
        }, 2000);
    });
}

function runPromiseChainDemo() {
    console.log("=== promise chain demo ===");

    return fetchUser()
        .then((data) => {
            console.log("data:", data);
            return fetchAct(data.id);
        })
        .then((data2) => {
            console.log("data2:", data2);
        })
        .catch((err) => {
            console.error("error:", err);
        });
}

function runPromiseAllDemo() {
    console.log("=== Promise.all demo ===");

    return Promise.all([fetchUser(), fetchAct(1)])
        .then(([user, act]) => {
            console.log("user:", user);
            console.log("act:", act);
        })
        .catch((err) => {
            console.error("error:", err);
        });
}

module.exports = {
    fetchUser,
    fetchAct,
    runPromiseChainDemo,
    runPromiseAllDemo,
};

if (require.main === module) {
    runPromiseChainDemo().then(() => runPromiseAllDemo());
}
