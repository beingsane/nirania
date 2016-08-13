module.exports = (function (Particles, Protagonist, COLOR, Wall, THREE, TWEEN) {

    /**
     * Represents Scene
     * @param {number} width width of browser window
     * @param {number} height height of browser window
     * @constructor
     */
    function Scene(width, height) {
        this.width = width;
        this.height = height;

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 3000);
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = false;

        this.objects = {
            particles: new Particles(),
            protagonist: new Protagonist()
        };

        this.lights = {
            hemisphere: null,
            shadow: null
        };
        this.addLights();

    }

    /**
     * adds lights to scene
     */
    Scene.prototype.addLights = function () {
        this.lights.hemisphere = new THREE.HemisphereLight(0xA73B63, COLOR.way, 0.8);//0x53034A, COLOR.way, 0.8)

        this.lights.shadow = new THREE.DirectionalLight(0xffffff, .9);//0xffffff, 1);
        this.lights.shadow.position.set(0, 200, 0);
        this.lights.shadow.position.copy(this.camera.position);
        this.lights.shadow.position.y += 1000;
        this.lights.shadow.target.position.set(0, 0, 0);
        this.lights.shadow.castShadow = true;

        //visible area of the projected shadow
        this.lights.shadow.shadow.camera.left = -4000;
        this.lights.shadow.shadow.camera.right = 4000;
        this.lights.shadow.shadow.camera.top = 4000;
        this.lights.shadow.shadow.camera.bottom = -4000;
        this.lights.shadow.shadow.camera.near = 1;
        this.lights.shadow.shadow.camera.far = 4000;

        //resolution
        this.lights.shadow.shadow.mapSize.width = 1000;
        this.lights.shadow.shadow.mapSize.height = 1000;

        this.scene.add(this.lights.hemisphere);
        this.scene.add(this.lights.shadow);
        this.scene.add(new THREE.DirectionalLightHelper(this.lights.shadow, 0.2));
    };

    /**
     * positions and creates intro view
     */
    Scene.prototype.showIntro = function () {
        this.camera.position.z = 50;
        this.camera.position.y = 1000;
        this.camera.position.x = 250;

        //add particles
        this.scene.add(this.objects.particles.group);

        //add protagonist
        this.objects.protagonist.group.position.set(0, 950, 0);
        this.objects.protagonist.group.rotateY(Math.PI);
        this.scene.add(this.objects.protagonist.group);

        /*
        //add cube
        this.objects.wayHelper = new THREE.Mesh(
            new THREE.CylinderGeometry( 25, 25, 20, 32 ),
            new THREE.MeshLambertMaterial({color: COLOR.way})
        );
        this.objects.wayHelper.position.set(0, 915, 802);
        this.scene.add(this.objects.wayHelper);
        */

        this.camera.lookAt(this.objects.protagonist.group.position);
    };

    /**
     * Renders scene and starts basic animations like particles
     */
    Scene.prototype.render = function () {
        this.objects.particles.animate();
        this.objects.protagonist.animate();
        this.renderer.render(this.scene, this.camera);
    };

    /**
     * starting animation part 1 (protagonist and cube fall)
     * @param {function} cb callback function
     */
    Scene.prototype.startingAnimation1 = function (cb) {
        var self = this;
        var t = 150;
        var fall = function () {
            //self.objects.wayHelper.position.y--;
            self.objects.protagonist.group.position.y--;
            t--;
            if (t > 0) {
                setTimeout(function () {
                    fall();
                }, 1);
            } else {
                cb();
            }
        };
        fall();
    };

    /**
     * starting animation part 2 (protagonist, cube and camera fall)
     * @param {function} cb callback function
     */
    Scene.prototype.startingAnimation2 = function (cb) {
        var self = this;
        var t = 800;
        var fall = function () {
            //self.objects.wayHelper.position.y--;
            self.objects.protagonist.group.position.y--;
            self.camera.position.y--;
            t--;
            if (t > 0) {
                setTimeout(function () {
                    fall();
                }, 1);
            } else {
                cb();
            }
        };
        fall();
    };

    /**
     * starting animation part 3 (camera falls to needed height)
     * @param cb
     */
    Scene.prototype.startingAnimation3 = function (cb) {
        var self = this;
        var t = 150;
        var fall = function () {
            self.camera.position.y--;
            t--;
            if (t > 0) {
                setTimeout(function () {
                    fall();
                }, 1);
            } else {
                self.camera.lookAt(self.objects.protagonist.group.position);
                cb();
            }
        };
        fall();
    };

    /**
     * starting animation part 4 (camera rotates to x position = 0)
     * @param {function} cb callback function
     */
    Scene.prototype.startingAnimation4 = function (cb) {
        var self = this;
        var t = 250;
        var fall = function () {
            self.camera.position.x--;
            self.camera.position.z+= 0.5 ;
            self.camera.lookAt(self.objects.protagonist.group.position);
            t--;
            if (t > 0) {
                setTimeout(function () {
                    fall();
                }, 1);
            } else {
                self.camera.lookAt(self.objects.protagonist.group.position);
                cb();
            }
        };
        fall();
    };

    /**
     * creates the animation for starting the game
     * @param {function} cb callback function
     */
    Scene.prototype.startingAnimation = function (cb) {
        var self = this;
        //protagonist and cube fall
        self.startingAnimation1(function () {
            //protagonist, cube and camera fall
            self.startingAnimation2(function () {
                //camera falls to needed height
                self.startingAnimation3(function(){
                    self.startingAnimation4(function(){
                        cb();
                    });
                });
            });
        });
    };


    /*
     TODO das muss wo anders hin
     //TWEEN.update();
     //Wall.prototype.wallMove(5);
     */

    /*

     Scene.prototype.init = function(){
     // controls
     //controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

     //TODO create way
     var way = new THREE.Mesh(
     new THREE.CubeGeometry(300, 100, 2000),
     new THREE.MeshLambertMaterial({color: COLOR.way})
     );
     way.position.z = 0;//0;
     way.position.y = -50;
     way.receiveShadow = true;
     Wall.prototype.createWall();

     this.scene.add(way);
     //this.scene.add(activeWall[activeWall.length - 1]);

     };

     */


    Scene.prototype.addObject = function (givenObject) {
        mainScene.scene.add(givenObject);
    };

    Scene.prototype.removeObject = function (givenObject) {
        mainScene.scene.remove(givenObject);
    };


    return Scene;
})(
    require('./Particles'),
    require('./protagonist/Protagonist'),
    require('./COLOR'),
    require('./Wall'),
    require('three'),
    require('tween.js')
);