yogo.levels.push({
    hints: [
        {
            text: "走别的路...",
            rect: {x: 0, y: 0, width: 80, height: 401}
        },
        {
            text: "用方向键或者WSAD键移动到出口.",
            rect: {x: 80, y: 0, width: 340, height: 401}
        },
        {
            text: "差不多快到了...",
            rect: {x: 420, y: 0, width: 100, height: 401}
        },
        {
            text: "太远了 !",
            rect: {x: 540, y: 0, width: 61, height: 401}
        }
    ],
    player: {
        position: {x: 100.5, y: 200.5}
    },
    exit: {
        position: {x: 500.5, y: 200.5}
    },
    bots: [],
    barriers: {
        emitters: [],
        reflectors: []
    }
});
