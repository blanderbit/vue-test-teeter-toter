<template src="./app.html"></template>

<script>

    /**
     *
     * sequence of imports
     *
     * 1 - vue related
     * 2 - vue component
     * 3 - helpers
     * 4 - consts
     *
     */

    import {
        mapState,
        mapGetters,
        mapMutations
    } from "vuex";

    import GameControls from "./components/GameControls.vue";
    import GameData from "./components/GameData.vue";
    import GameOver from "./components/GameOver.vue";
    import Shape from "./components/Shape.vue";

    import {
        availableWeight,
        clearTimeouts,
        generateUUID,
        getRandomNumber
    } from "./helpers";

    import {
        ACTION,
        DIRECTIONS,
        KEY_CODES
    } from "./consts";

    /**
     *
     * local variables
     *
     */

    const speedIntervalTime = 100;
    const timeBeforeDeleteShapes = 3000;
    const timeBeforeCreateComputerShape = 2000;

    const player = {
        user: "user",
        computer: "Computer"
    };

    /**
     *
     * used for automatic direction selection
     *
     * @param bool: boolean
     * @returns {string}
     */

    const directionsAsBoolean = (bool) => bool ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;

    export default {
        name: "App",
        components: {
            GameData,
            GameOver,
            Shape,
            GameControls,
        },
        data: () => ({
            newShapeBottom: 100,
            newShape: {
                type: null,
                weight: null,
                distance: null,
                bottom: null,
            },
            controls: Object.values(ACTION),
            timeInterval: null,
            timeoutObject: {},
            activePlayer: null,
            speed: 1,
            isAutoMode: false,
            isGameOver: false,
            horizontalIncrement: 10,
        }),
        watch: {

            /**
             *
             * when the item reaches the bar
             * the element was controlled by a user or a robot
             *
             * @param newValue: number
             */

            newShapeBottom(newValue) {

                if (!this.isGameOver && newValue <= 0) {

                    clearInterval(this.timeInterval);

                    this.addNewShape([
                        "userShapes",
                        this.newShape
                    ]);

                    this.activePlayer = player.computer;
                }
            },


            /**
             *
             * after the expiration of the time, we start the robot
             *
             * @param newValue: {
             *      type: null | string,
             *      weight: null | number,
             *      distance: null | number,
             *      bottom: null | number,
             *  }[]
             */

            userShapes(newValue) {

                if (this.isGameOver) {
                    return;
                }

                this.speed = Math.ceil((newValue.length + 1) / 5);

                this.newShape = {};

                this.activePlayer = player.computer;

                setTimeout(
                    this.createComputerShape.bind(this),
                    timeBeforeCreateComputerShape
                );
            },


            /**
             *
             * kg * m > 20
             * we end the game and clear all data
             *
             * @param newValue: {
             *      type: null | string,
             *      weight: null | number,
             *      distance: null | number,
             *      bottom: null | number,
             *  }[]
             */

            extraMomentum(newValue) {
                if (Math.abs(newValue) > 20) {

                    this.isGameOver = true;

                    this.newShape = {};

                    this.speed = 1;

                    setTimeout(
                        this.removeOneByOne.bind(this),
                        timeBeforeDeleteShapes
                    );
                }
            },

            isAutoMode(newValue) {
                if(newValue){
                    this.balanceAuthomatically()
                }
            }
        },
        computed: {

            ...mapState({
                userShapes: ({ commonModule }) => commonModule.userShapes,
                computerShapes: ({ commonModule }) => commonModule.computerShapes,
                availableShapes: ({ commonModule }) => commonModule.availableShapes,
            }),

            ...mapGetters({
                shapesWeight: "commonModule/shapesWeight",
                shapesMomentum: "commonModule/shapesMomentum",
            }),

            extraMomentum() {
                return this.shapesMomentum("computerShapes") - this.shapesMomentum("userShapes");
            },

            barAngle() {
                return this.extraMomentum / 2;
            },

            getStyle() {
                return {
                    transform: `rotate(${ this.barAngle }deg)`,
                    transitionDuration: `${ 10000 / Math.abs(this.extraMomentum) }ms`,
                }
            }
        },

        methods: {
            ...mapMutations({
                addNewShape: "commonModule/addNewShape",
                removeAllShapes: "commonModule/removeAllShapes",
                removeLastShape: "commonModule/removeLastShape",
            }),

            moveShapeDown() {
                clearInterval(this.timeInterval);
                this.timeInterval = setInterval(
                    () => this.newShapeBottom = this.newShapeBottom - this.speed,
                    speedIntervalTime
                );
            },

            createComputerShape() {
                if (this.isGameOver) {
                    return;
                }
                this.addNewShape([
                    "computerShapes",
                    this._createNewShape()
                ]);
                this.throwNewShape()
            },

            moveShapeHorizontally(direction) {
                const increments = {
                    [ DIRECTIONS.LEFT ]: this.horizontalIncrement,
                    [ DIRECTIONS.RIGHT ]: -this.horizontalIncrement,
                };

                const distance = this.newShape.distance + increments[ direction ];

                if (distance < 0 || distance > 500) {
                    return;
                }

                this.newShape.distance = this.newShape.distance + increments[ direction ];
            },

            /**
             *
             * @param event: keyDownEvent
             * @returns {void|*|void}
             *
             * */

            handleKeydown({ keyCode }) {
                if (this.isAutoMode) {
                    return;
                }

                switch ( keyCode ) {
                    case KEY_CODES.ARROW_LEFT:
                        return this.moveShapeHorizontally(DIRECTIONS.LEFT);

                    case KEY_CODES.ARROW_RIGHT:
                        return this.moveShapeHorizontally(DIRECTIONS.RIGHT);

                    case KEY_CODES.ARROW_DOWN:
                        return this.newShapeBottom = 0;
                }
            },

            /**
             *
             * @param control:  string
             * @returns {void|*|void}
             */

            handleControlClick(control) {
                switch ( control ) {
                    case ACTION.START:
                        this.removeAllShapes();
                        return this.startNewGame();

                    case ACTION.PAUSE:
                        return clearInterval(this.timeInterval);

                    case ACTION.CONTINUE:
                        return this.moveShapeDown();

                    case ACTION.NEW:
                        this.removeAllShapes();
                        this.startNewGame();
                        return
                }
            },

            /**
             *
             * progress of work, creation of an element and
             * its instant appearance on the scales, transition to the user's move
             *
             */

            throwNewShape() {

                if (this.isGameOver) {
                    return;
                }

                this.activePlayer = player.user;

                this.newShape = {
                    ...this._createNewShape(),
                    distance: 0,
                    bottom: 100,
                };

                this.newShapeBottom = 100;

                this.moveShapeDown();
            },

            _createNewShape() {
                return {
                    type: this.availableShapes[ getRandomNumber(this.availableShapes.length - 1) ],
                    weight: getRandomNumber(availableWeight(this.userShapes.length), 1),
                    distance: getRandomNumber(500),
                };
            },

            startNewGame() {
                this.isGameOver = false;

                this.removeAllShapes();

                clearTimeouts(this.timeoutObject);

                this.throwNewShape();
            },

            /**
             *
             * used for random movement, only in automatic mode
             *
             * @param maxExtraMomentum: number
             */

            balanceAuthomatically(maxExtraMomentum = 0) {
                const {
                    weight,
                    distance
                } = this.newShape;

                const kf = ((0.01 * (distance + this.horizontalIncrement) * weight - this.extraMomentum) < maxExtraMomentum);

                if (kf || this.isAutoMode) {
                    this.moveShapeHorizontally(
                        directionsAsBoolean(
                            getRandomNumber(2, 0)
                        )
                    );
                }
            },

            removeOneByOne() {
                const length = this.userShapes.length > this.computerShapes.length
                    ? this.userShapes.length
                    : this.computerShapes.length;

                for (let i = 0; i < length; i++) {
                    this.timeoutObject[generateUUID()] = setTimeout(() => {
                        this.removeLastShape("userShapes");
                        this.removeLastShape("computerShapes")
                    }, 500 * i);
                }
            },
        },

        mounted() {
            window.onkeydown = this.handleKeydown;
        },

        destroyed() {
            window.onkeydown = null;
            clearInterval(this.timeInterval);
        },

    };
</script>

<style lang="scss" src="./app.scss"></style>
