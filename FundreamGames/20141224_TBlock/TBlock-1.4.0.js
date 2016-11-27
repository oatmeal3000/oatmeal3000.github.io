(function(window){
    var TBlock={};
    var prototype={
        show:function(){
            this.scene.add(this.block);
            this.visible=true;
        },
        hide:function(){
            this.scene.remove(this.block);
            this.visible=false;
        },
        isVisible:function(){
            return this.visible;
        },
        position:function(){
            return [this.block.position.x,-this.block.position.z];
        },
        rect:function(){
            var position=this.position();
            return [position[0]-5,position[1]-5,10,10]
        },
        move:function(x,y){
            this.block.position.x=x;
            this.block.position.z=-y;
        },
        moveBy:function(x,y){
            this.block.position.x+=x;
            this.block.position.z-=y;
        },
        contains:function(x,y){
            var rect=this.rect();
            if(rect[0]<=x && x<=rect[0]+rect[2] && rect[1]<=y && y<=rect[1]+rect[3]){
                return true;
            }else{
                return false;
            }
        },
        containsRect:function(x,y,width,height){
            return this.contains(x,y) && this.contains(x+width,y) && this.contains(x,y+height) && this.contains(x+width,y+height);
        },
        collision:function(x,y,width,height){
            return this.contains(x,y) || this.contains(x+width,y) || this.contains(x,y+height) || this.contains(x+width,y+height);
        }
    };
    TBlock.Block=function(scene){
        this.scene=scene;
        this.visible=false;
        this.block=new THREE.Mesh(
            new THREE.CubeGeometry(
                10,
                10,
                10
            )
        );
    };
    TBlock.Block.prototype=prototype;
    TBlock.User=function(scene){
        this.scene=scene;
        this.visible=false;
        this.block=new THREE.Mesh(
            new THREE.SphereGeometry(
                5
            )
        );
    };
    TBlock.User.prototype=prototype;
    TBlock.Game=function(parent){
        parent=parent || document.body;
        var scene_width=400; //画布宽度
        var scene_height=400; //画布高度
        var width=200; //场景宽度
        var height=400; //场景高度
        var fps=60; //帧频
        var max=1; //每行最高方块数
        var count=100; //方块池大小
        var speed=3; //前进速度
        var fast_speed=5; //加速后速度
        var slow_speed=2; //减速后速度
        var move_speed=5; //左右移动速度
        var slow_move_speed=2; //慢速左右移动速度
        var frames=10; //每隔多少帧为一行
        var scene=new THREE.Scene();
        var camera=new THREE.PerspectiveCamera(45,scene_width/scene_height,0.1,1000);
        var renderer=new THREE.CanvasRenderer();
        scene.add(camera);
        camera.position.x=width/2;
        camera.position.y=150;
        camera.position.z=250;
        camera.rotation.x=-0.25;
        renderer.setSize(scene_width,scene_height);
        parent.appendChild(renderer.domElement);
        var ground=new THREE.Object3D();
        ground.position.x=width/2;
        scene.add(ground);
        var proxy=new THREE.Object3D();
        proxy.position.x=-width/2;
        ground.add(proxy);
        var blocks=[];
        for(var i=0;i<count;i++){
            blocks[i]=new TBlock.Block(proxy);
        }
        var user=new TBlock.User(scene);
        user.show();
        var time;
        var isdown;
        var temp;
        var score;
        var init=function(){
            for(var i=0;i<count;i++){
                blocks[i].hide();
            }
            user.move(width/2,10);
            camera.position.x=width/2;
            time=new Date().getTime();
            isdown={
                left:false,
                right:false,
                up:false,
                down:false,
                slow:false
            };
            temp=0;
            score=0;
        };
        var timer=function(){
            var now=new Date().getTime();
            if(now-time>=1000/fps){
                var times=Math.floor((now-time)/(1000/fps));
                game(times);
                time+=times*(1000/fps);
            }
            setTimeout(timer,0);
        };
        var game=function(times){
            for(var i=0;i<times;i++){
                var sp=speed;
                if(isdown.up){
                    sp=fast_speed;
                }
                if(isdown.down){
                    sp=slow_speed;
                }
                var hidden=[];
                for(var j=0;j<count;j++){
                    if(blocks[j].isVisible()){
                        blocks[j].moveBy(0,-sp);
                        if(blocks[j].rect()[1]+blocks[j].rect()[3]<0){
                            blocks[j].hide();
                        }
                    }else{
                        hidden.push(blocks[j]);
                    }
                }
                temp++;
                if(temp==frames){
                    temp=0;
                    for(var j=0;j<max && j<hidden.length;j++){
                        hidden[j].show();
                        hidden[j].move(Math.floor(Math.random()*(width-10)+5),height);
                    }
                }
                var s=isdown.slow?slow_move_speed:move_speed;
                if(isdown.left){
                    if(user.position()[0]>=10){
                        user.moveBy(-s,0);
                        camera.position.x-=s;
                    }
                    if(ground.rotation.z>-0.1){
                        ground.rotation.z-=0.01;
                    }
                }else{
                    if(ground.rotation.z<0){
                        ground.rotation.z+=0.01;
                    }
                }
                if(isdown.right){
                    if(user.position()[0]<=width-10){
                        user.moveBy(s,0);
                        camera.position.x+=s;
                    }
                    if(ground.rotation.z<0.1){
                        ground.rotation.z+=0.01;
                    }
                }else{
                    if(ground.rotation.z>0){
                        ground.rotation.z-=0.01;
                    }
                }
                for(var j=0;j<count;j++){
                    if(blocks[j].isVisible()){
                        var rect=blocks[j].rect();
                        if(user.collision(rect[0],rect[1],rect[2],rect[3])){
                            renderer.render(scene,camera);
                            alert("Game Over!!!\nScore: "+score);
                            init();
                        }
                    }
                }
                score+=sp;
            }
            renderer.render(scene,camera);
        };
        window.onkeydown=function(e){
            e=e||window.event;
            var key=e.which || e.keyCode;
            switch(key){
                case 37:
                    isdown.left=true;
                    break;
                case 38:
                    isdown.up=true;
                    break;
                case 39:
                    isdown.right=true;
                    break;
                case 40:
                    isdown.down=true;
                    break;
                case 16:
                    isdown.slow=true;
                    break;
            }

        };
        window.onkeyup=function(e){
            e=e||window.event;
            var key=e.which || e.keyCode;
            switch(key){
                case 37:
                    isdown.left=false;
                    break;
                case 38:
                    isdown.up=false;
                    break;
                case 39:
                    isdown.right=false;
                    break;
                case 40:
                    isdown.down=false;
                    break;
                case 16:
                    isdown.slow=false;
                    break;
            }

        };
        init();
        timer();
    };
    window.TBlock=TBlock;
})(window);