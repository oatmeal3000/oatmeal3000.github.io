yogo.levels.push({
    hints: [
        {
            text: "这里有个监控机器人.",
            rect: {x: 0, y: 0, width: 120, height: 100},
            min_bots_left: 1
        },
        {
            text: "试着靠近它，小心点.",
            rect: {x: 120, y: 0, width: 80, height: 100},
            min_bots_left: 1
        },
        {
            text: "按住shift键可以慢点走过去.",
            rect: {x: 200, y: 0, width: 140, height: 150},
            min_bots_left: 1
        },
        {
            text: "再多一点...",
            rect: {x: 200, y: 150, width: 200, height: 50},
            min_bots_left: 1
        },
        {
            text: "好的够近了，现在用空格键让它的防御失效吧.",
            rect: {x: 280, y: 182, width: 40, height: 28},
            min_bots_left: 1
        },
        {
            text: "好的，现在用空格键让它失效.",
            rect: {x: 260, y: 185, width: 80, height: 25},
            min_bots_left: 1
        },
        {
            text: "干的不错，现在出口被解锁了.",
            rect: {x: 260, y: 100, width: 80, height: 100},
            max_bots_left: 0
        },
        {
            text: "等会你会遇到很多机器人...",
            rect: {x: 340, y: 0, width: 120, height: 100},
            max_bots_left: 0
        },
        {
            text: "但是你只有一次攻击 :)",
            rect: {x: 500, y: 0, width: 101, height: 140},
            max_bots_left: 0
        }
    ],
    player: {
        position: {x: 50.5, y: 50.5}
    },
    exit: {
        position: {x: 560.5, y: 200.5}
    },
    bots: [
        {
            is_deaf: true,
            position: {x: 300.5, y: 300.5}
        }
    ],
    barriers: {
        emitters: [
            {
                position: {x: 0.5, y: 100.5},
                direction: {x: 1, y: 0}
            }
        ],
        reflectors: [
            {
                position: {x: 260.5, y: 100.5},
                reflection: 'counter-clockwise'
            },
            {
                position: {x: 260.5, y: 200.5},
                reflection: 'clockwise'
            },
            {
                position: {x: 340.5, y: 200.5},
                reflection: 'clockwise'
            },
            {
                position: {x: 340.5, y: 100.5},
                reflection: 'counter-clockwise'
            },
            {
                position: {x: 500.5, y: 100.5},
                reflection: 'counter-clockwise'
            }
        ]
    }
});
