yogo.levels.push({
    hints: [
        {
            text: "关于机器人还有些事情...",
            rect: {x: 0, y: 0, width: 200, height: 40}
        },
        {
            text: "第一，最外面的环表示它们的感知区域.",
            rect: {x: 0, y: 40, width: 160, height: 60}
        },
        {
            text: "里面的环代表它们的攻击范围.",
            rect: {x: 0, y: 100, width: 80, height: 100}
        },
        {
            text: "也就是你会挂掉的区域 :)",
            rect: {x: 0, y: 200, width: 80, height: 100}
        },
        {
            text: "如果它们听到你，它们会靠近你产生的声音.",
            rect: {x: 100, y: 140, width: 120, height: 40}
        },
        {
            text: "如果它们听到你，它们会靠近你产生的声音.",
            rect: {x: 140, y: 140, width: 80, height: 40}
        },
        {
            text: "所以用shift键走的轻一点然后逃跑",
            rect: {x: 180, y: 40, width: 80, height: 80}
        },
        {
            text: "所以用shift键走的轻一点然后逃跑.",
            rect: {x: 200, y: 0, width: 100, height: 101}
        },
        {
            text: "最后，当你毁掉一个机器人的时候，你会看到一些电火花.",
            rect: {x: 340, y: 0, width: 261, height: 140}
        },
        {
            text: "它们可以破坏其他的机器人和设备.",
            rect: {x: 380, y: 140, width: 221, height: 60}
        },
        {
            text: "利用它们.",
            rect: {x: 480, y: 200, width: 121, height: 100}
        }
    ],
    player: {
        position: {x: 140.5, y: 20.5}
    },
    exit: {
        position: {x: 300.5, y: 140.5}
    },
    bots: [
        {
            position: {x: 240.5, y: 320.5}
        },
        {
            position: {x: 360.5, y: 320.5}
        }
    ],
    barriers: {
        emitters: [
            {
                position: {x: 560.5, y: 360.5},
                direction: {x: -1, y: -1}
            },
            {
                position: {x: 200.5, y: 0.5},
                direction: {x: -1, y: 1}
            }
        ],
        reflectors: [
            {
                position: {x: 300.5, y: 100.5},
                reflection: 'clockwise'
            },
            {
                position: {x: 40.5, y: 160.5},
                reflection: 'clockwise'
            },
            {
                position: {x: 80.5, y: 200.5},
                reflection: 'clockwise'
            }
        ]
    }
});
